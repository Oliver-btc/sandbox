"use client";

import React, { useState, useEffect, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Copy, ScanLine, MessageSquare, ArrowDown } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from '@/components/ui/use-toast';
import { useRouter } from "next/navigation";

export function AIQRCode() {
  const rewardPageUrl = process.env.NEXT_PUBLIC_REWARD_PAGE_URL || 'https://beyondtc-v1.vercel.app/ai-reward';
  const router = useRouter();
  const [qrSize, setQrSize] = useState(200);
  const qrContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateQRSize = () => {
      if (qrContainerRef.current) {
        const containerWidth = qrContainerRef.current.offsetWidth;
        setQrSize(Math.floor(containerWidth * 0.95));
      }
    };

    updateQRSize();
    window.addEventListener('resize', updateQRSize);

    return () => window.removeEventListener('resize', updateQRSize);
  }, []);

  const handleClaim = () => {
    router.push("https://beyondtc-v1.vercel.app/ai-reward");
  };

  const handleBooking = (calendlyUrl: string) => {
    window.open(calendlyUrl, '_blank');
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-[#F7931A] to-black">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-gradient-to-b from-[#F7931A] to-black z-50 shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center h-16">
            <img
              src="/images/BeyondTC.png"
              alt="Beyond The Checkout"
              className="h-8 object-contain"
            />
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8 text-white pt-20">
        <Card className="w-full max-w-[90vw] md:max-w-2xl bg-black/20 border-2 border-[#F7931A]">
          <CardContent className="p-4 md:p-8">
            <div className="flex flex-col items-center space-y-4">
              {/* Main Headline */}
              <div className="text-center space-y-2 -mb-2">
                <h1 className="text-3xl md:text-4xl font-bold text-white">
                  🎉 Here's Your Personalized Product Preview!
                </h1>
                <p className="text-lg md:text-xl text-gray-300">
                  Experience customer engagement firsthand
                </p>
                <p className="text-sm md:text-base text-[#F7931A]">
                  Sample QR Code
                </p>
              </div>

              <div className="animate-bounce">
                <ArrowDown className="w-6 h-6 text-[#F7931A] mx-auto -mb-2" />
              </div>

              {/* QR Code Section */}
              <div className="relative w-full max-w-md mx-auto -mt-2">
                {/* Template with Dynamic QR Code */}
                <div className="relative aspect-square w-full max-w-[300px] mx-auto">
                  {/* Template Background */}
                  <img 
                    src="/images/QRCode_Template.png"
                    alt="QR Code Template"
                    className="w-full h-full"
                  />
                  
                  {/* Dynamic QR Code Overlay */}
                  <div 
                    ref={qrContainerRef}
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[45%] h-[45%] bg-white flex items-center justify-center"
                  >
                    <QRCodeSVG 
                      value={rewardPageUrl}
                      size={qrSize}
                      level="H"
                      includeMargin={false}
                    />
                  </div>
                </div>
              </div>

              {/* Feature List */}
              <div className="w-full max-w-md space-y-4 mt-4">
                <h3 className="text-xl font-semibold text-center text-white mb-4">
                  Scan the QR Code to see how customers:
                </h3>
                <div className="space-y-3 text-center">
                  <p className="text-gray-200">🎁 Claim instant Bitcoin rewards</p>
                  <p className="text-gray-200">📘 Discover your product </p>
                  <p className="text-gray-200">📝 Provide valuable feedback </p>
                </div>
              </div>

              {/* Call to Action */}
              <p className="text-[#F7931A] text-sm text-center mt-2">
                Scan the code or use the demo link <br/> to see how your customers engage with your product.
              </p>


              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md mt-4">
                <Button
                  onClick={() => {
                    navigator.clipboard.writeText(rewardPageUrl);
                    toast({
                      title: "Link Copied! 🎉",
                      description: "Share this demo link to showcase your future product experience",
                      duration: 3000,
                      variant: "default",
                      className: "bg-[#F7931A] text-white border-none",
                    });
                  }}
                  className="flex-1 flex items-center justify-center space-x-2 bg-black/30 text-white hover:bg-black/40 px-6 py-4"
                >
                  <Copy className="h-5 w-5" />
                  <span>Copy Demo Link</span>
                </Button>

                <Button
                  onClick={handleClaim}
                  className="flex-1 flex items-center justify-center space-x-2 bg-[#F7931A] text-black hover:bg-[#e68b15] px-6 py-4 text-lg font-semibold transform hover:scale-105 transition-all"
                >
                  <ScanLine className="h-5 w-5" />
                  <span>Preview Now</span>
                </Button>
              </div>

              {/* Contact CTA */}
              <button
                onClick={() => handleBooking('https://calendly.com/oliver-checkout/30min?back=1')}
                className="text-[#F7931A] hover:text-[#e68b15] flex items-center gap-2 text-sm transition-colors mt-4"
              >
                <MessageSquare className="h-4 w-4" />
                Want this on your product? Let's chat!
              </button>

            </div>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="mt-auto py-4 text-center">
        <div className="flex flex-col items-center space-y-2">
          <p className="text-gray-400 text-sm">Integration powered by</p>
          <img
            src="/images/BeyondTC.png"
            alt="Beyond The Checkout"
            className="h-6 object-contain"
          />
        </div>
      </footer>
    </div>
  );
}