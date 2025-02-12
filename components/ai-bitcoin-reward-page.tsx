"use client"

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function BitcoinRewardPage() {
  const router = useRouter();
  const [bitcoinPrice, setBitcoinPrice] = useState<number | null>(null);
  const [usdEquivalent, setUsdEquivalent] = useState<string>("0.00");

  useEffect(() => {
    const fetchBitcoinPrice = async () => {
      try {
        const response = await fetch("https://api.coindesk.com/v1/bpi/currentprice/USD.json");
        const data = await response.json();
        const price = Math.round(data.bpi.USD.rate_float);
        setBitcoinPrice(price);
        
        const satsToUsd = (10000 / 100000000) * price;
        setUsdEquivalent(satsToUsd.toFixed(2));
      } catch (error) {
        console.error("Error fetching Bitcoin price:", error);
      }
    };

    fetchBitcoinPrice();
    const intervalId = setInterval(fetchBitcoinPrice, 60000);

    return () => clearInterval(intervalId);
  }, []);

  const handleClaim = () => {
    router.push("/ai-product-analysis");  // Updated to match your URL structure
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-[#F7931A] to-black">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-gradient-to-b from-[#F7931A] to-black z-50 shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-white ml-3 px-2">Bitcoin by </h1>
              <img
                src="/images/BeyondTC.png"
                alt="Beyond The Checkout Logo"
                className="h-16 w-16"
                style={{ objectFit: 'contain' }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-grow pt-20 px-4 sm:px-6 lg:px-8 text-white">
        <div className="mx-auto max-w-md text-center">
          <h2 className="mt-2 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Congratulations!
          </h2>

          <div className="mt-4">
            <img
              src="/images/Bitcoin Logo.png"
              alt="Bitcoin Logo"
              className="h-20 w-20 mx-auto"
              style={{ objectFit: 'contain' }}
            />
          </div>

          <p className="mt-4 text-2xl font-bold text-white">
            You won 10,000 Sats
          </p>
          
          <div className="mt-2 text-lg font-medium text-white">
            <p>approximately ${usdEquivalent} USD</p>
            <div className="flex items-center justify-center mt-1 text-sm text-gray-300">
              <img
                src="/images/Bitcoin Logo.png"
                alt="Bitcoin Logo"
                className="h-4 w-4 mr-1"
              />
              <span>Current BTC Price: </span>
              <span className="ml-1">
                {bitcoinPrice ? `$${bitcoinPrice.toLocaleString()}` : 'Loading...'}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-center mt-8">
            <Button
              onClick={handleClaim}
              className="rounded-md bg-[#F7931A] px-6 py-3 text-lg text-white shadow-sm transition-colors hover:bg-[#E8B749] focus:outline-none focus:ring-2 focus:ring-[#F7931A] focus:ring-offset-2"
            >
              Claim Bitcoin
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