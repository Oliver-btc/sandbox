"use client";

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useRouter } from 'next/navigation';
import { toast } from '@/components/ui/use-toast';

interface AnalysisResult {
  generalPitch: {
    description: string;
    imageUrl: string;
  };
  specificPitch: {
    description: string;
    imageUrl: string;
  };
  customerFeedback: {
    testimonial: string;
    imageUrl: string;
    customerName?: string;
  };
}

const defaultAnalysisResult: AnalysisResult = {
  generalPitch: {
    description: "Welcome! You're about to explore an exciting product.",
    imageUrl: "/images/Bitcoin Logo.png"
  },
  specificPitch: {
    description: "This product has been specifically designed for your needs.",
    imageUrl: "/images/Bitcoin Logo.png"
  },
  customerFeedback: {
    testimonial: "An amazing product that exceeded my expectations!",
    imageUrl: "/images/Bitcoin Logo.png",
    customerName: "Happy Customer"
  }
};

export function AIProductAnalysis() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadResults = async () => {
      try {
        setIsLoading(true);
        const sessionId = searchParams?.get('session');

        if (sessionId) {
          console.log('Fetching data for session:', sessionId);
          // Construct the URL for the stored session
          const blobUrl = `${process.env.NEXT_PUBLIC_BLOB_BASE_URL}/sessions/${sessionId}.json`;
          
          try {
            const response = await fetch(blobUrl);
            if (response.ok) {
              const data = await response.json();
              console.log('Successfully fetched session data');
              setResult({
                generalPitch: data.generalPitch,
                specificPitch: data.specificPitch,
                customerFeedback: data.customerFeedback
              });
              return;
            } else {
              console.error('Failed to fetch session data:', response.status);
            }
          } catch (error) {
            console.error('Error fetching from Blob:', error);
          }
        }

        // If no session ID or Blob fetch failed, try localStorage
        const storedResults = localStorage.getItem('analysisResults');
        if (storedResults) {
          const parsedResults = JSON.parse(storedResults);
          setResult({
            generalPitch: parsedResults.generalPitch,
            specificPitch: parsedResults.specificPitch,
            customerFeedback: parsedResults.customerFeedback
          });
          return;
        }

        // If all else fails, use default data
        setResult(defaultAnalysisResult);
      } catch (err) {
        console.error('Error loading analysis results:', err);
        setError('Failed to load analysis results');
        setResult(defaultAnalysisResult);
      } finally {
        setIsLoading(false);
      }
    };

    loadResults();
  }, [searchParams]);

  const handleNext = () => {
    // Get session ID from URL params
    const sessionId = searchParams?.get('session');
    
    // Create the path with or without session parameter
    const nextUrl = sessionId 
      ? `/ai-quiz?session=${sessionId}`
      : '/ai-quiz';
    
    console.log('Navigating to:', nextUrl); // For debugging
    router.push(nextUrl);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-b from-[#F7931A] to-black">
        <div className="flex-grow flex items-center justify-center">
          <div className="text-white text-xl">Loading analysis results...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-[#F7931A] to-black">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-gradient-to-b from-[#F7931A] to-black z-50 shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center h-16">
            <h1 className="text-2xl font-bold text-white">Product Information</h1>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-grow px-4 sm:px-6 lg:px-8 text-white pt-20">
        <div className="max-w-2xl mx-auto">
          {error ? (
            <div className="text-center text-red-500 mt-4">
              {error}
            </div>
          ) : (
            <Tabs defaultValue="general" className="w-full">
              <TabsList className="grid grid-cols-3 bg-black/20 rounded-lg p-1">
                <TabsTrigger value="general" className="text-white">Overview</TabsTrigger>
                <TabsTrigger value="specific" className="text-white">Use Case</TabsTrigger>
                <TabsTrigger value="feedback" className="text-white">Reviews</TabsTrigger>
              </TabsList>

              <TabsContent value="general">
                <Card className="bg-black/20 border-2 border-[#F7931A]">
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center space-y-4">
                      <img
                        src={result?.generalPitch.imageUrl}
                        alt="General Product"
                        className="w-64 h-64 rounded-lg object-cover"
                      />
                      <p className="text-lg text-center text-white">
                        {result?.generalPitch.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="specific">
                <Card className="bg-black/20 border-2 border-[#F7931A]">
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center space-y-4">
                      <img
                        src={result?.specificPitch.imageUrl}
                        alt="Specific Use Case"
                        className="w-64 h-64 rounded-lg object-cover"
                      />
                      <p className="text-lg text-center text-white">
                        {result?.specificPitch.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="feedback">
                <Card className="bg-black/20 border-2 border-[#F7931A]">
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center space-y-4">
                      <img
                        src={result?.customerFeedback.imageUrl}
                        alt="Customer Feedback"
                        className="w-64 h-64 rounded-lg object-cover"
                      />
                      <div className="text-center">
                        <p className="text-lg text-white italic mb-2">
                          "{result?.customerFeedback.testimonial}"
                        </p>
                        {result?.customerFeedback.customerName && (
                          <p className="text-sm text-gray-300">
                            - {result.customerFeedback.customerName}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
          
          <div className="mt-6 flex justify-center">
            <Button
              onClick={handleNext}
              className="px-6 py-3 rounded-lg bg-[#F7931A] text-black hover:bg-[#e68b15] font-semibold"
            >
              Next
            </Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-6 pb-4 text-center">
        <p className="text-gray-400 text-sm">Powered by</p>
        <img
          src="/images/BeyondTC.png"
          alt="Beyond The Checkout"
          width="100"
          height="50"
          className="mx-auto"
          style={{ aspectRatio: "2.34 / 1", objectFit: "cover" }}
        />
      </footer>
    </div>
  );
}