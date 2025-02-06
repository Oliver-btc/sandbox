"use client"

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface EducationContent {
  image: string;
  description: string;
}

export default function Withdrawal() {
  const [step, setStep] = useState(0);
  const [url, setUrl] = useState('');
  const [educationContent, setEducationContent] = useState<EducationContent | null>(null);

  const fetchAIContent = async () => {
    if (!url) return;
    try {
      const response = await fetch('/api/extract-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      // Extract dynamic sales pitch from the page's metadata
      const pageMetadataResponse = await fetch('/api/extract-metadata', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      const pageMetadata = await pageMetadataResponse.json();

      const dynamicDescription = pageMetadata.description || pageMetadata.title || "Check out this amazing product!";
      const salesPitch = `${dynamicDescription} Perfect for enhancing your daily routine.`;

      const cleanedEducationContent = {
        image: data.imageUrl || '/default-placeholder.png', // Use extracted image or placeholder
        description: salesPitch, // Dynamic sales pitch
      };

      setEducationContent(cleanedEducationContent);
      setStep(1);
    } catch (error) {
      console.error('Error fetching AI-generated content:', error);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="pt-20 flex justify-center">
            <div className="w-full max-w-md bg-black rounded-lg p-6">
              <p className="text-white text-xl font-bold text-center mb-4">Enter URL</p>
              <Input
                type="url"
                placeholder="https://..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full bg-[#1a1a1a] text-white border-[#F7931A]"
              />
              <Button
                className="w-full mt-4 bg-[#F7931A] text-black"
                onClick={fetchAIContent}
              >
                Generate Education
              </Button>
            </div>
          </div>
        );
      case 1:
        return (
          <div className="pt-20 flex flex-col items-center">
            <div className="w-full max-w-md bg-black rounded-lg p-6">
              {educationContent?.image ? (
                <img
                  src={educationContent.image}
                  alt="Educational Content"
                  className="mb-4 rounded-lg"
                  style={{
                    width: '50%', // Set image width to 50%
                    margin: '0 auto', // Center the image horizontally
                    display: 'block',
                  }}
                />
              ) : (
                <div
                  className="mb-4 rounded-lg bg-gray-700 flex items-center justify-center"
                  style={{ height: '200px', width: '100%' }}
                >
                  <p className="text-gray-400">Image not available</p>
                </div>
              )}
              <p className="text-sm text-gray-300 text-center">{educationContent?.description}</p>
            </div>
            <Button
              className="mt-8 px-6 py-3 bg-[#F7931A] text-black"
              onClick={() => setStep(2)}
            >
              Continue
            </Button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-[#F7931A] to-black">
      <main className="flex-grow px-4 sm:px-6 lg:px-8 text-white">{renderStep()}</main>
    </div>
  );
}
