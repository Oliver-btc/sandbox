"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function EmailConfirmation() {
  const router = useRouter();

  const handleClaimBitcoin = () => {
    router.push("/withdrawl");
  };

  return (
    <div className="flex flex-col items-center justify-start bg-gradient-to-b from-[#F7931A] to-black px-4 pt-4 sm:pt-6 sm:px-6 lg:px-8 text-white min-h-screen">
      <div className="mx-auto max-w-md text-center">
        <img
          src="/images/Bullish Beef_White.png"
          alt="Bullish Beef Logo"
          className="h-20 w-20 mx-auto"
          style={{ objectFit: 'contain' }}
        />
        <h2 className="mt-6 text-3xl font-bold text-white">Claim Your Bitcoin</h2>
        
        <div className="mt-4">
          <img
            src="/images/Bitcoin Logo.png"
            alt="Bitcoin Logo"
            className="h-20 w-20 mx-auto"
            style={{ objectFit: 'contain' }}
          />
        </div>

        <p className="mt-4 text-lg text-white">Click the button below to claim your bitcoin.</p>
        <Button className="mt-6 bg-[#F7931A] text-white hover:bg-[#e08214] text-lg" onClick={handleClaimBitcoin}>
          Claim Bitcoin
        </Button>
      </div>

      {/* Powered by section */}
      <div className="flex flex-col items-center mt-6">
        <p className="text-gray-400 text-sm">Powered by</p>
        <img
          src="/images/BeyondTC.png"
          alt="Beyond The Checkout"
          width="100"
          height="50"
          style={{ aspectRatio: "2.34 / 1", objectFit: "cover" }}
        />
      </div>
    </div>
  );
}
