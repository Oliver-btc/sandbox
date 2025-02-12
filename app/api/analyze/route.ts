import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { put } from '@vercel/blob';

// Basic configuration
export const runtime = 'edge';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization'
};

// Validate OpenAI API key
if (!process.env.OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY is not configured in environment variables');
}

if (!process.env.BLOB_READ_WRITE_TOKEN) {
  throw new Error('BLOB_READ_WRITE_TOKEN is not configured');
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function generateImageWithRetry(prompt: string, retryCount = 3, delayMs = 1000) {
  for (let attempt = 1; attempt <= retryCount; attempt++) {
    try {
      console.log(`Attempt ${attempt} to generate image for prompt: ${prompt.substring(0, 50)}...`);
      
      const image = await openai.images.generate({
        model: "dall-e-3",
        prompt: prompt,
        n: 1,
        size: "1024x1024",
        quality: "standard",
        style: "natural"
      });

      console.log(`Successfully generated image on attempt ${attempt}`);
      return image;
    } catch (error: any) {
      console.error(`Error on attempt ${attempt}:`, error);
      
      if (attempt === retryCount) {
        throw error;
      }

      if (error.status === 429 || (error.response && error.response.status === 429)) {
        console.log(`Rate limit hit, waiting ${delayMs}ms before retry...`);
        await new Promise(resolve => setTimeout(resolve, delayMs * attempt));
      }
    }
  }
}

async function scrapeUrl(url: string, retryCount = 3): Promise<string> {
  const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.5',
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache',
  };

  for (let attempt = 0; attempt < retryCount; attempt++) {
    try {
      if (attempt > 0) {
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
      }

      const response = await fetch(url, { headers });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`HTTP ${response.status} on attempt ${attempt + 1}:`, errorText);
        
        if (response.status === 403) {
          const urlInfo = await extractInfoFromUrl(url);
          if (urlInfo) return urlInfo;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const html = await response.text();
      if (!html || html.trim().length === 0) {
        throw new Error('Empty response received');
      }
      
      return html;
    } catch (error) {
      console.error(`Attempt ${attempt + 1} failed:`, error);
      if (attempt === retryCount - 1) {
        throw error;
      }
    }
  }
  
  throw new Error('Failed to fetch URL after all retries');
}

async function extractInfoFromUrl(url: string): Promise<string | null> {
  try {
    const urlObj = new URL(url);
    const pathSegments = urlObj.pathname.split('/').filter(Boolean);
    const productName = pathSegments[pathSegments.length - 1] || urlObj.hostname;
    
    const readableText = productName
      .replace(/-|_/g, ' ')
      .replace(/([A-Z])/g, ' $1')
      .trim();

    return `Product Information:\nTitle: ${readableText}\nWebsite: ${urlObj.hostname}\nCategory: ${pathSegments[0] || 'General'}\n`;
  } catch (error) {
    console.error('Error extracting info from URL:', error);
    return null;
  }
}

async function extractSiteLogo(html: string, url: string): Promise<string> {
  try {
    const baseUrl = new URL(url);
    
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
        
        if (logoUrl.startsWith('//')) {
          logoUrl = `https:${logoUrl}`;
        } else if (logoUrl.startsWith('/')) {
          logoUrl = `${baseUrl.origin}${logoUrl}`;
        } else if (!logoUrl.startsWith('http')) {
          logoUrl = new URL(logoUrl, baseUrl.origin).href;
        }
        
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

    const faviconUrl = `${baseUrl.origin}/favicon.ico`;
    try {
      const response = await fetch(faviconUrl);
      if (response.ok && response.headers.get('content-type')?.startsWith('image/')) {
        return faviconUrl;
      }
    } catch (e) {
      console.error('Error fetching favicon:', e);
    }

    return '/api/placeholder/64/64';
  } catch (error) {
    console.error('Error extracting site logo:', error);
    return '/api/placeholder/64/64';
  }
}

function extractProductInfo(html: string): { description: string, reviews: string[] } {
  try {
    let content = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                     .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');
    
    const metaDescription = content.match(/<meta\s+name="description"\s+content="([^"]+)"/i);
    const metaTitle = content.match(/<meta\s+property="og:title"\s+content="([^"]+)"/i);
    const title = content.match(/<h1[^>]*>(.*?)<\/h1>/i);
    const productDescription = content.match(/<div[^>]*class="[^"]*product-description[^"]*"[^>]*>(.*?)<\/div>/i);
    
    const reviews: string[] = [];
    const reviewPattern = /<div[^>]*class="[^"]*review[^"]*"[^>]*>(.*?)<\/div>/gi;
    let match;
    while ((match = reviewPattern.exec(content)) !== null) {
      const reviewText = match[1].replace(/<[^>]*>/g, ' ').trim();
      if (reviewText.length > 0) reviews.push(reviewText);
    }
    
    let relevantInfo = 'Product Information:\n';
    if (metaTitle?.[1]) relevantInfo += `Title: ${metaTitle[1]}\n`;
    else if (title?.[1]) relevantInfo += `Title: ${title[1]}\n`;
    
    if (metaDescription?.[1]) relevantInfo += `Description: ${metaDescription[1]}\n`;
    else if (productDescription?.[1]) relevantInfo += `Description: ${productDescription[1]}\n`;
    
    if (relevantInfo === 'Product Information:\n') {
      relevantInfo += content.replace(/<[^>]*>/g, ' ')
                            .replace(/\s+/g, ' ')
                            .trim()
                            .slice(0, 1000);
    }
    
    return { description: relevantInfo, reviews };
  } catch (error) {
    console.error('Error extracting product info:', error);
    return {
      description: html.replace(/<[^>]*>/g, ' ').slice(0, 1000),
      reviews: []
    };
  }
}

async function fetchAndStoreImage(imageUrl: string | undefined, prefix: string): Promise<{ url: string, success: boolean }> {
  if (!imageUrl) {
    console.error(`[fetchAndStoreImage] Missing image URL for ${prefix}`);
    return { url: '/images/PicPlaceholder.png', success: false };
  }
  
  try {
    console.log(`[fetchAndStoreImage] Starting process for ${prefix}`);
    console.log(`[fetchAndStoreImage] BLOB_TOKEN status: ${!!process.env.BLOB_READ_WRITE_TOKEN}`);
    
    const response = await fetch(imageUrl);
    console.log(`[fetchAndStoreImage] Fetch response status: ${response.status}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
    }
    
    const contentType = response.headers.get('content-type');
    console.log(`[fetchAndStoreImage] Content-Type: ${contentType}`);
    
    const blob = await response.blob();
    console.log(`[fetchAndStoreImage] Blob size: ${blob.size}, type: ${blob.type}`);
    
    const timestamp = Date.now();
    const filename = `${prefix}-${timestamp}.png`;
    
    const putResult = await put(filename, blob, {
      access: 'public',
      addRandomSuffix: false,
      token: process.env.BLOB_READ_WRITE_TOKEN
    }).catch((error: Error) => {
      console.error('[fetchAndStoreImage] Put error:', {
        error: error.toString(),
        details: error instanceof Error ? {
          message: error.message,
          stack: error.stack
        } : 'Unknown error type'
      });
      throw error;
    });
    
    console.log('[fetchAndStoreImage] Storage success:', {
      url: putResult.url,
      pathname: putResult.pathname
    });
    
    return { url: putResult.url, success: true };
  } catch (error) {
    console.error('[fetchAndStoreImage] Error details:', {
      error: error instanceof Error ? {
        message: error.message,
        stack: error.stack
      } : 'Unknown error type'
    });
    return { url: '/images/PicPlaceholder.png', success: false };
  }
}


async function handleImageGeneration(productInfo: string, generalPitch: string, specificPitch: string, testimonial: string, usePlaceholders: boolean) {
  if (usePlaceholders) {
    console.log('[handleImageGeneration] Using placeholder images as requested');
    return {
      general: { data: [{ url: '/images/PicPlaceholder.png' }] },
      specific: { data: [{ url: '/images/PicPlaceholder.png' }] },
      feedback: { data: [{ url: '/images/PicPlaceholder.png' }] }
    };
  }

  try {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OpenAI API key is not configured');
    }

    console.log('[handleImageGeneration] Starting AI image generation');
    
    const [generalImage, specificImage, feedbackImage] = await Promise.all([
      generateImageWithRetry(`Professional marketing image for: ${generalPitch}`, 3, 2000),
      generateImageWithRetry(`Professional image showing: ${specificPitch}`, 3, 2000),
      generateImageWithRetry(`Lifestyle image showing: ${testimonial}`, 3, 2000)
    ]);

    console.log('[handleImageGeneration] AI images generated, proceeding to storage');

    const [generalBlob, specificBlob, feedbackBlob] = await Promise.all([
      fetchAndStoreImage(generalImage?.data[0]?.url, 'general'),
      fetchAndStoreImage(specificImage?.data[0]?.url, 'specific'),
      fetchAndStoreImage(feedbackImage?.data[0]?.url, 'feedback')
    ]);

    if (!generalBlob.success || !specificBlob.success || !feedbackBlob.success) {
      console.warn('[handleImageGeneration] Some images failed to store properly, using placeholders');
      return {
        general: { data: [{ url: '/images/PicPlaceholder.png' }] },
        specific: { data: [{ url: '/images/PicPlaceholder.png' }] },
        feedback: { data: [{ url: '/images/PicPlaceholder.png' }] }
      };
    }

    return {
      general: { data: [{ url: generalBlob.url }] },
      specific: { data: [{ url: specificBlob.url }] },
      feedback: { data: [{ url: feedbackBlob.url }] }
    };

  } catch (error) {
    console.error('[handleImageGeneration] Error in image generation:', error);
    return {
      general: { data: [{ url: '/images/PicPlaceholder.png' }] },
      specific: { data: [{ url: '/images/PicPlaceholder.png' }] },
      feedback: { data: [{ url: '/images/PicPlaceholder.png' }] }
    };
  }
}

const rateLimit = {
  windowMs: 60 * 1000,
  max: 5
};

const rateLimitStore = new Map();

function errorResponse(message: string, status: number = 500) {
  console.error(`API Error: ${message}`);
  return new NextResponse(
    JSON.stringify({ error: message }),
    { 
      status,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    }
  );
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const windowStart = now - rateLimit.windowMs;
  
  // Clean up old entries
  for (const [key, timestamp] of rateLimitStore.entries()) {
    if (timestamp < windowStart) {
      rateLimitStore.delete(key);
    }
  }
  
  // Count requests in current window
  const requestCount = Array.from(rateLimitStore.entries())
    .filter(([key, timestamp]) => key.startsWith(ip) && timestamp >= windowStart)
    .length;
    
  if (requestCount >= rateLimit.max) {
    return false;
  }
  
  // Add new request
  rateLimitStore.set(`${ip}-${now}`, now);
  return true;
}

// Handle OPTIONS requests
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders
  });
}

// Main POST handler
export async function POST(request: NextRequest) {
  console.log('POST request received');
  
  try {
    // Check rate limit
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    if (!checkRateLimit(ip)) {
      return errorResponse('Too many requests. Please try again later.', 429);
    }

    // Validate request
    if (!request.headers.get('content-type')?.includes('application/json')) {
      return errorResponse('Content-Type must be application/json', 415);
    }

    let body;
    try {
      body = await request.json();
      console.log('Request body received:', body);
      console.log('URL:', body.url);
      console.log('Use Placeholders:', body.usePlaceholders);
    } catch (e) {
      return errorResponse('Invalid request body', 400);
    }

    if (!body?.url) {
      return errorResponse('URL is required', 400);
    }

    // Validate URL
    try {
      new URL(body.url);
    } catch {
      return errorResponse('Invalid URL provided', 400);
    }

    // Scrape URL content
    let html;
    try {
      html = await scrapeUrl(body.url);
      console.log('Content scraped successfully');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      return errorResponse(`Failed to scrape URL: ${errorMessage}`, 500);
    }

    // Extract product info
    const { description: productInfo, reviews } = extractProductInfo(html);
    console.log('Product information extracted');

    // Get logo and site name
    const logoUrl = await extractSiteLogo(html, body.url);
    const siteName = new URL(body.url).hostname.replace(/^www\./i, '');

    // Generate content with OpenAI
    try {
      console.log('Starting OpenAI content generation...');
      
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
              content: `Create a 1-2 sentence sales pitch about this product: ${productInfo}`
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
              content: `Create a 1-2 sentence sales pitch highlighting a specific feature of this product: ${productInfo}`
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
              content: "Create an authentic-sounding customer testimonial with a name at the end in format '- Name'."
            },
            {
              role: "user",
              content: reviews.length > 0
                ? `Create a testimonial based on these reviews: ${reviews.join(" | ")}`
                : `Create a testimonial for this product: ${productInfo}`
            }
          ],
          temperature: 0.8,
          max_tokens: 150
        })
      ]);

      if (!generalPitchResponse.choices[0]?.message?.content || 
          !specificPitchResponse.choices[0]?.message?.content || 
          !feedbackResponse.choices[0]?.message?.content) {
        throw new Error('Failed to generate complete content');
      }

      const generalPitch = generalPitchResponse.choices[0].message.content;
      const specificPitch = specificPitchResponse.choices[0].message.content;
      const customerFeedback = feedbackResponse.choices[0].message.content;
      const customerName = customerFeedback.match(/- ([^"]+)$/)?.[1] || "Happy Customer";
      const testimonial = customerFeedback.replace(/- [^"]+$/, '').trim();

      // Handle images using the new function
      const images = await handleImageGeneration(
        productInfo,
        generalPitch,
        specificPitch,
        testimonial,
        body.usePlaceholders
      );

      console.log('Image generation completed:', images);

      // Generate quiz
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
            4. Not offensive or inappropriate
            
            Format the response as JSON:
            {
              "question": "What is the main value proposition of this product?",
              "correctAnswer": "actual value proposition",
              "wrongAnswer1": "funny but obviously wrong answer 1",
              "wrongAnswer2": "funny but obviously wrong answer 2"
            }`
          },
          {
            role: "user",
            content: `Create a quiz with:
            1. A clear question about the main value proposition
            2. The correct answer that accurately states the key benefit
            3. Two humorous but obviously incorrect answers that are related to the product's purpose
            
            Product info: ${productInfo}`
          }
        ],
        temperature: 0.8,
        max_tokens: 500
      });

      if (!quizCompletion.choices[0]?.message?.content) {
        throw new Error('Failed to generate quiz content');
      }

      const quizData = JSON.parse(quizCompletion.choices[0].message.content);
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

      return NextResponse.json({
        generalPitch: {
          description: generalPitch,
          imageUrl: images.general.data[0].url
        },
        specificPitch: {
          description: specificPitch,
          imageUrl: images.specific.data[0].url
        },
        customerFeedback: {
          testimonial,
          customerName,
          imageUrl: images.feedback.data[0].url
        },
        quiz: {
          question: quizData.question,
          options,
          correctAnswer: correctAnswerIndex,
          logoUrl,
          siteName
        }
      }, {
        status: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      });

    } catch (error) {
      console.error('Error generating content:', error);
      return errorResponse(
        error instanceof OpenAI.APIError ? error.message : 'Failed to generate content',
        error instanceof OpenAI.APIError ? error.status || 500 : 500
      );
    }
  } catch (error) {
    console.error('Request processing error:', error);
    return errorResponse(
      error instanceof Error ? error.message : 'Internal server error',
      500
    );
  }
}