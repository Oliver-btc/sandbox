"use client"

import React, { useState, FormEvent } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import LoadingMessagesDisplay from './LoadingMessagesDisplay';
import { useRouter } from 'next/navigation';

export default function URLAnalyzer() {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [usePlaceholders, setUsePlaceholders] = useState(true);
  const router = useRouter();


// In your URLAnalyzer component, update the handleSubmit function:

const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setIsLoading(true);
  setError(null);

  try {
    console.log('Sending request with URL:', url);
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        url,
        usePlaceholders
      }),
    });

    // Log raw response details
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    let data;
    try {
      const textResponse = await response.text();
      console.log('Raw response:', textResponse);

      try {
        data = JSON.parse(textResponse);
      } catch (parseError) {
        console.error('JSON Parse Error:', parseError);
        throw new Error(`Invalid JSON response from server: ${textResponse.slice(0, 200)}...`);
      }
    } catch (error) {
      console.error('Response Reading Error:', error);
      throw new Error('Failed to read server response');
    }

    if (!response.ok) {
      throw new Error(data?.error || `Server error: ${response.status}`);
    }

    // Validate response data structure
    if (!data || !data.generalPitch || !data.specificPitch || !data.customerFeedback || !data.quiz) {
      console.error('Invalid response structure:', data);
      throw new Error('Invalid response format from server');
    }

    // Store the AI-generated content
    localStorage.setItem('analysisResults', JSON.stringify(data));
    router.push('/ai-qr');
    
  } catch (error: unknown) {
    console.error('Full error details:', error);
    setError(error instanceof Error ? error.message : 'An unexpected error occurred');
  } finally {
    setIsLoading(false);
  }
};

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-[#F7931A] to-black">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-gradient-to-b from-[#F7931A] to-black z-50 shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center h-16">
            <div className="flex items-center space-x-4">
              {/* <h1 className="text-2xl font-bold text-white">Welcome to</h1> */}
              <img
                  src="/images/BeyondTC.png"
                  alt="Beyond The Checkout"
                  className="h-8 object-contain"
                />
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-grow px-4 sm:px-6 lg:px-8 text-white pt-24">
        <div className="max-w-2xl mx-auto">
          {/* Welcome Card */}
          <Card className="bg-black/20 border-2 border-[#F7931A] mb-8">
            <CardContent className="p-6 text-center">
              <h2 className="text-2xl font-bold mb-4 text-white">Your products, New Customer Experiences</h2>
              <p className="text-lg text-white mb-2 text-center">
                <strong>Experience the power of integrating QR codes into your products:</strong>
              </p>
              <ul className="text-lg text-white mb-4 list-disc inline-block mx-auto space-y-1">
                <li className="text-left">New customer experiences</li>
                <li className="text-left">Incentivized product interaction</li>
                <li className="text-left">Detailed consumption analytics</li>
                <li className="text-left">And much more...</li>
              </ul>

              <div className="flex justify-center">
                <img
                  src="/images/CustomerExperience.png"
                  alt="Beyond The Checkout"
                  className="h-26 object-contain"
                />
              </div>
            </CardContent>
          </Card>

          {/* URL Input Form */}
          <Card className="bg-black/20 border-2 border-[#F7931A]">
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex flex-col space-y-4">
                  <label className="text-lg font-medium text-white">
                    Enter product URL to start:
                  </label>
                  <Input
                    type="url"
                    placeholder="https://your-product-url.com"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="url-input w-full px-4 py-3 bg-black/20 border-2 border-[#F7931A] rounded-lg text-white placeholder:text-white/70"
                    required
                  />
                  
                  <div className="flex items-center justify-center space-x-4 py-4">
                    <Label 
                      htmlFor="image-source" 
                      className={`cursor-pointer transition-all duration-200 ${
                        usePlaceholders ? 'text-white font-bold' : 'text-white/70'
                      }`}
                    >
                      Use Placeholder Images
                    </Label>
                    <Switch
                      id="image-source"
                      checked={!usePlaceholders}
                      onCheckedChange={(checked) => setUsePlaceholders(!checked)}
                      className="data-[state=checked]:bg-[#F7931A]"
                    />
                    <Label 
                      htmlFor="image-source" 
                      className={`cursor-pointer transition-all duration-200 ${
                        !usePlaceholders ? 'text-white font-bold' : 'text-white/70'
                      }`}
                    >
                      Use AI-Generated Images
                    </Label>
                  </div>

                  <Button 
                    type="submit"
                    disabled={isLoading}
                    className="w-full px-6 py-4 rounded-lg bg-[#F7931A] text-black hover:bg-[#e68b15] font-semibold text-lg transition-all duration-200"
                  >
                    {isLoading ? 'Analyzing...' : 'Start Your Journey'}
                  </Button>
                </div>
              </form>

              {error && (
                <Alert variant="destructive" className="mt-4">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Loading Messages Overlay */}
              {isLoading && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/0 z-50">
                  <div className="bg-gradient-to-b from-[#F7931A] to-black p-8 rounded-xl shadow-2xl border-2 border-[#F7931A] max-w-md mx-4">
                    <div className="flex flex-col items-center space-y-6">
                      <div className="text-4xl mb-2">🤖</div>
                      <div className="text-xl text-white text-center">
                        {/* Here we'll keep using the existing LoadingMessagesDisplay component
                            but only for the message rotation logic */}
                        <LoadingMessagesDisplay />
                      </div>
                      <div className="flex justify-center items-center space-x-3 mt-4">
                        <div className="w-3 h-3 bg-[#F7931A] rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                        <div className="w-3 h-3 bg-[#F7931A] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-3 h-3 bg-[#F7931A] rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto pb-4 text-center">
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