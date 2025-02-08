// app/api/analyze/route.ts
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Minimal configuration
export const dynamic = 'force-dynamic';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

// Helper function for consistent error responses
function errorResponse(message: string, status: number = 500) {
  console.error(`API Error: ${message}`);
  return new NextResponse(
    JSON.stringify({ 
      error: message,
      timestamp: new Date().toISOString(),
      path: '/api/analyze'
    }),
    { 
      status,
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, must-revalidate'
      }
    }
  );
}

async function extractSiteLogo(html: string, url: string) {
  try {
    const baseUrl = new URL(url);
    
    // Common patterns for logo detection
    const logoPatterns = [
      /<link[^>]*rel="icon"[^>]*href="([^"]+)"/i,
      /<link[^>]*rel="shortcut icon"[^>]*href="([^"]+)"/i,
      /<link[^>]*rel="apple-touch-icon"[^>]*href="([^"]+)"/i,
      /<meta[^>]*property="og:image"[^>]*content="([^"]+)"/i,
    ];

    for (const pattern of logoPatterns) {
      const match = html.match(pattern);
      if (match && match[1]) {
        let logoUrl = match[1];
        
        // Handle relative URLs
        if (logoUrl.startsWith('//')) {
          logoUrl = `https:${logoUrl}`;
        } else if (logoUrl.startsWith('/')) {
          logoUrl = `${baseUrl.origin}${logoUrl}`;
        } else if (!logoUrl.startsWith('http')) {
          logoUrl = new URL(logoUrl, baseUrl.origin).href;
        }
        
        // Verify the logo URL is accessible
        try {
          const response = await fetch(logoUrl);
          if (response.ok && response.headers.get('content-type')?.startsWith('image/')) {
            return logoUrl;
          }
        } catch (e) {
          console.error('Error verifying logo URL:', e);
        }
      }
    }

    // Fallback: Try to get favicon.ico
    const faviconUrl = `${baseUrl.origin}/favicon.ico`;
    try {
      const response = await fetch(faviconUrl);
      if (response.ok && response.headers.get('content-type')?.startsWith('image/')) {
        return faviconUrl;
      }
    } catch (e) {
      console.error('Error fetching favicon:', e);
    }

    return '/api/placeholder/64/64'; // Fallback to placeholder
  } catch (error) {
    console.error('Error extracting site logo:', error);
    return '/api/placeholder/64/64';
  }
}

async function scrapeUrl(url: string, retryCount = 3) {
  const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.5',
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache',
    'Connection': 'keep-alive',
  };

  let lastError;
  
  for (let attempt = 0; attempt < retryCount; attempt++) {
    try {
      if (attempt > 0) {
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
      }

      const response = await fetch(url, { 
        headers,
        next: { revalidate: 0 } // Disable cache
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`HTTP ${response.status} on attempt ${attempt + 1}:`, errorText);
        
        if (response.status === 403) {
          const urlInfo = await extractInfoFromUrl(url);
          if (urlInfo) {
            return urlInfo;
          }
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const html = await response.text();
      if (!html || html.trim().length === 0) {
        throw new Error('Empty response received');
      }
      
      return html;
    } catch (error) {
      lastError = error;
      console.error(`Attempt ${attempt + 1} failed:`, error);
      
      if (attempt === retryCount - 1) {
        throw new Error(`Failed to fetch URL after ${retryCount} attempts: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
  }
  
  throw lastError || new Error('Failed to fetch URL after all retries');
}

async function extractInfoFromUrl(url: string) {
  try {
    const urlObj = new URL(url);
    const pathSegments = urlObj.pathname.split('/').filter(Boolean);
    const productName = pathSegments[pathSegments.length - 1] || urlObj.hostname;
    
    const readableText = productName
      .replace(/-|_/g, ' ')
      .replace(/([A-Z])/g, ' $1')
      .trim();

    const description = `Product Information:\nTitle: ${readableText}\nWebsite: ${urlObj.hostname}\nCategory: ${pathSegments[0] || 'General'}\n`;
    
    return description;
  } catch (error) {
    console.error('Error extracting info from URL:', error);
    return null;
  }
}

function extractProductInfo(html: string) {
  try {
    let content = html;
    content = content.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    content = content.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');
    
    // Extract meta descriptions
    const metaDescription = content.match(/<meta\s+name="description"\s+content="([^"]+)"/i);
    const metaTitle = content.match(/<meta\s+property="og:title"\s+content="([^"]+)"/i);
    const metaPrice = content.match(/<meta\s+property="product:price:amount"\s+content="([^"]+)"/i);
    
    // Extract main product information
    const title = content.match(/<h1[^>]*>(.*?)<\/h1>/i);
    const productDescription = content.match(/<div[^>]*class="[^"]*product-description[^"]*"[^>]*>(.*?)<\/div>/i);
    
    // Extract customer reviews
    const reviews = [];
    const reviewPattern = /<div[^>]*class="[^"]*review[^"]*"[^>]*>(.*?)<\/div>/gi;
    let match;
    while ((match = reviewPattern.exec(content)) !== null) {
      const reviewText = match[1].replace(/<[^>]*>/g, ' ').trim();
      if (reviewText.length > 0) {
        reviews.push(reviewText);
      }
    }
    
    // Combine the most relevant information
    let relevantInfo = 'Product Information:\n';
    if (metaTitle && metaTitle[1]) relevantInfo += `Title: ${metaTitle[1]}\n`;
    else if (title && title[1]) relevantInfo += `Title: ${title[1]}\n`;
    
    if (metaDescription && metaDescription[1]) relevantInfo += `Description: ${metaDescription[1]}\n`;
    else if (productDescription && productDescription[1]) relevantInfo += `Description: ${productDescription[1]}\n`;
    
    if (metaPrice && metaPrice[1]) relevantInfo += `Price: ${metaPrice[1]}\n`;
    
    if (relevantInfo === 'Product Information:\n') {
      const cleanText = content.replace(/<[^>]*>/g, ' ')
                              .replace(/\s+/g, ' ')
                              .trim()
                              .slice(0, 1000);
      relevantInfo += cleanText;
    }
    
    return {
      description: relevantInfo,
      reviews: reviews
    };
  } catch (error) {
    console.error('Error extracting product info:', error);
    return {
      description: html.replace(/<[^>]*>/g, ' ').slice(0, 1000),
      reviews: []
    };
  }
}

export async function POST(request: Request) {
  console.log('=== Starting new request ===');
  
  try {
    // Verify OpenAI API key
    if (!process.env.OPENAI_API_KEY) {
      return errorResponse('OpenAI API key is not configured', 500);
    }

    // Parse request body
    let body;
    try {
      body = await request.json();
      console.log('Request body:', { url: body.url, usePlaceholders: body.usePlaceholders });
    } catch (e) {
      return errorResponse('Invalid request body', 400);
    }

    // Validate URL
    if (!body?.url) {
      return errorResponse('URL is required', 400);
    }

    try {
      new URL(body.url);
    } catch (e) {
      return errorResponse('Invalid URL format', 400);
    }

    // Scrape URL
    let html;
    try {
      console.log('Scraping URL content...');
      html = await scrapeUrl(body.url);
      console.log('Content scraped successfully');
    } catch (error) {
      return errorResponse(`Failed to scrape URL: ${error instanceof Error ? error.message : 'Unknown error'}`, 500);
    }

    // Extract product info
    let productInfo, reviews;
    try {
      const extracted = extractProductInfo(html);
      productInfo = extracted.description;
      reviews = extracted.reviews;
      console.log('Product information and reviews extracted');
    } catch (error) {
      return errorResponse(`Failed to extract product information: ${error instanceof Error ? error.message : 'Unknown error'}`, 500);
    }

    // Extract logo and site name
    let logoUrl, siteName;
    try {
      logoUrl = await extractSiteLogo(html, body.url);
      siteName = new URL(body.url).hostname.replace(/^www\./i, '');
    } catch (error) {
      console.error('Error extracting logo:', error);
      logoUrl = '/api/placeholder/64/64';
      siteName = new URL(body.url).hostname;
    }

    // Generate OpenAI content
    console.log('Generating content with OpenAI...');
    try {
      const [generalPitchResponse, specificPitchResponse, feedbackResponse] = await Promise.all([
        openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: "Create a short, engaging description focused on the overall value proposition and general benefits of the product."
            },
            {
              role: "user",
              content: `Create a 1-2 sentence sales pitch about the general concept and value of this product: ${productInfo}`
            }
          ],
          temperature: 0.7,
          max_tokens: 150
        }),
        openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: "Create a short, engaging description focused on a specific use case or unique feature of the product."
            },
            {
              role: "user",
              content: `Create a 1-2 sentence sales pitch highlighting a specific use case or unique feature of this product: ${productInfo}`
            }
          ],
          temperature: 0.7,
          max_tokens: 150
        }),
        openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: "Create an authentic-sounding customer testimonial. Include a plausible customer name at the end in the format '- Name'."
            },
            {
              role: "user",
              content: reviews.length > 0
                ? `Create a genuine-sounding customer testimonial based on these reviews: ${reviews.join(" | ")}`
                : `Create a genuine-sounding customer testimonial for this product: ${productInfo}`
            }
          ],
          temperature: 0.8,
          max_tokens: 150
        })
      ]);

      if (!generalPitchResponse.choices[0]?.message?.content || 
          !specificPitchResponse.choices[0]?.message?.content || 
          !feedbackResponse.choices[0]?.message?.content) {
        throw new Error('Failed to generate content from OpenAI');
      }

      const generalPitch = generalPitchResponse.choices[0].message.content;
      const specificPitch = specificPitchResponse.choices[0].message.content;
      const customerFeedback = feedbackResponse.choices[0].message.content;

      const customerName = customerFeedback.match(/- ([^"]+)$/)?.[1] || "Happy Customer";
      const testimonial = customerFeedback.replace(/- [^"]+$/, '').trim();

      console.log('Handling image generation/placeholder selection...');
      let images;
      
      if (body.usePlaceholders) {
        console.log('Using placeholder images');
        images = {
          general: { data: [{ url: '/images/PicPlaceholder.png' }] },
          specific: { data: [{ url: '/images/PicPlaceholder.png' }] },
          feedback: { data: [{ url: '/images/PicPlaceholder.png' }] }
        };
      } else {
        console.log('Generating AI images');
        try {
          const [generalImage, specificImage, feedbackImage] = await Promise.all([
            openai.images.generate({
              model: "dall-e-3",
              prompt: `Create a professional marketing image that represents this general product concept: ${generalPitch}. The image should be clean, professional, and focus on the overall value proposition.`,
              n: 1,
              size: "1024x1024",
              quality: "standard",
              style: "natural"
            }),
            openai.images.generate({
              model: "dall-e-3",
              prompt: `Create a professional marketing image that represents this specific use case: ${specificPitch}. The image should be clean, professional, and focus on demonstrating the specific feature or use case.`,
              n: 1,
              size: "1024x1024",
              quality: "standard",
              style: "natural"
            }),
            openai.images.generate({
              model: "dall-e-3",
              prompt: `Create a lifestyle image that represents a happy customer using this product. The image should be authentic and relatable, showing the positive impact of the product. Based on this testimonial: ${testimonial}`,
              n: 1,
              size: "1024x1024",
              quality: "standard",
              style: "natural"
            })
          ]);
          images = { general: generalImage, specific: specificImage, feedback: feedbackImage };
        } catch (error) {
          console.error('Error generating AI images:', error);
          images = {
            general: { data: [{ url: '/images/PicPlaceholder.png' }] },
            specific: { data: [{ url: '/images/PicPlaceholder.png' }] },
            feedback: { data: [{ url: '/images/PicPlaceholder.png' }] }
          };
        }
      }

      console.log('Generating quiz question and answers...');
      const quizCompletion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `You are a witty quiz creator who generates fun and engaging multiple choice questions. 
            Your wrong answers should be:
            1. Obviously incorrect but related to the product
            2. Humorous and entertaining
            3. Written in a playful tone
            4. Not offensive or inappropriate`
          },
          {
            role: "user",
            content: `Based on this product info: ${productInfo}
            
            Create a quiz with:
            1. A clear question about the main value proposition
            2. The correct answer that accurately states the key benefit
            3. Two humorous but obviously incorrect answers that are related to the product's purpose
            
            Format the response as JSON:
            {
              "question": "What is the main value proposition of this product?",
              "correctAnswer": "actual value proposition",
              "wrongAnswer1": "funny but obviously wrong answer 1",
              "wrongAnswer2": "funny but obviously wrong answer 2"
            }`
          }
        ],
        temperature: 0.8,
        max_tokens: 500
      });

      if (!quizCompletion.choices[0]?.message?.content) {
        throw new Error('Failed to generate quiz content');
      }

      let quizData;
      try {
        quizData = JSON.parse(quizCompletion.choices[0].message.content);
        
        const options = [
          quizData.correctAnswer,
          quizData.wrongAnswer1,
          quizData.wrongAnswer2
        ];
        
        // Shuffle options
        for (let i = options.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [options[i], options[j]] = [options[j], options[i]];
        }

        const correctAnswerIndex = options.indexOf(quizData.correctAnswer);

        return new NextResponse(
          JSON.stringify({
            generalPitch: {
              description: generalPitch,
              imageUrl: images.general.data[0].url
            },
            specificPitch: {
              description: specificPitch,
              imageUrl: images.specific.data[0].url
            },
            customerFeedback: {
              testimonial: testimonial,
              customerName: customerName,
              imageUrl: images.feedback.data[0].url
            },
            quiz: {
              question: quizData.question,
              options: options,
              correctAnswer: correctAnswerIndex,
              logoUrl: logoUrl,
              siteName: siteName
            }
          }),
          { 
            status: 200,
            headers: { 
              'Content-Type': 'application/json',
              'Cache-Control': 'no-store, must-revalidate'
            }
          }
        );
      } catch (error) {
        console.error('Error processing quiz data:', error);
        return errorResponse('Failed to process quiz data', 500);
      }
    } catch (error) {
      console.error('Error generating OpenAI content:', error);
      return errorResponse(
        `Failed to generate content: ${error instanceof Error ? error.message : 'Unknown error'}`,
        500
      );
    }
  } catch (error: unknown) {
    console.error('Error processing request:', error);
    return errorResponse(
      `Failed to process request: ${error instanceof Error ? error.message : 'Unknown error'}`,
      500
    );
  }
}