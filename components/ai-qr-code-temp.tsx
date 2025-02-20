"use client";

import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Copy } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from '@/components/ui/use-toast';
import { useRouter } from "next/navigation";

export function AIQRCode() {
  const rewardPageUrl = process.env.NEXT_PUBLIC_REWARD_PAGE_URL || 'https://beyondtc-v1.vercel.app/ai-reward';
  
  //Temp button integration to work with Grok
  const router = useRouter();
  const handleClaim = () => {
    router.push("https://beyondtc-v1.vercel.app/ai-reward");  // Updated to match your URL structure
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-[#F7931A] to-black">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-gradient-to-b from-[#F7931A] to-black z-50 shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-white">Beyond The Checkout</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8 text-white pt-16">
        <Card className="w-full max-w-lg bg-black/20 border-2 border-[#F7931A]">
          <CardContent className="p-8">
            <div className="flex flex-col items-center space-y-8">
              <h2 className="text-3xl font-bold text-white text-center">
                Your Bitcoin Reward Awaits!
              </h2>
              
              <p className="text-xl text-gray-200 text-center">
                Scan this QR code or copy the link to claim your Bitcoin reward
              </p>

              {/* QR Code */}
              <div className="bg-white p-6 rounded-lg">
                <QRCodeSVG 
                  value={rewardPageUrl}
                  size={256}
                  level="H"
                  includeMargin={true}
                />
              </div>

              {/* Copy Link Button */}
              <Button
                onClick={() => {
                  navigator.clipboard.writeText(rewardPageUrl);
                  toast({
                    title: "Success! 🎉",
                    description: "The reward page link has been copied to your clipboard. You can now share it with your customers!",
                    duration: 3000,
                    variant: "default",
                    className: "bg-[#F7931A] text-white border-none",
                  });
                }}
                className="flex items-center space-x-2 bg-[#F7931A] text-black hover:bg-[#e68b15] px-6 py-3 text-lg"
              >
                <Copy className="h-5 w-5" />
                <span>Copy Link</span>
              </Button>
            
              {/* Temp button integration to work with Grok */}
              <Button
              onClick={handleClaim}
              className="rounded-md bg-[#F7931A] px-6 py-3 text-sm text-black shadow-sm transition-colors hover:bg-[#E8B749] focus:outline-none focus:ring-2 focus:ring-[#F7931A] focus:ring-offset-2"
            >
              Skip & Claim Bitcoin 
            </Button>

              <p className="text-lg text-center text-gray-300">
                Share this with your customers to let them claim their Bitcoin reward!
              </p>
            </div>
          </CardContent>
        </Card>
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