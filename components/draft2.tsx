"use client"

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function QRLandingPage() {
  const router = useRouter();
  const [bitcoinPrice, setBitcoinPrice] = useState<number | null>(null);
  const [usdEquivalent, setUsdEquivalent] = useState<string>("0.00");
  const [showOverlay, setShowOverlay] = useState(true);
  const [step, setStep] = useState(1);

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
    router.push("/withdrawl");
  };

  const handleDismissOverlay = () => {
    if (step === 1) {
      setStep(2);
    } else {
      setShowOverlay(false);
    }
  };

  return (
    <div className="relative flex flex-col min-h-screen bg-gradient-to-b from-[#F7931A] to-black">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-gradient-to-b from-[#F7931A] to-black z-50 shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center h-16">
            <div className="flex items-center">
              <img
                src="/images/Bullish Beef_White.png"
                alt="Bullish Beef Logo"
                className="h-8 w-8"
                style={{ objectFit: 'contain' }}
              />
              <h1 className="text-2xl font-bold text-white ml-3">Free Bitcoin!</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Overlay */}
      {showOverlay && (
        <div className="fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={handleDismissOverlay} />
          
          {step === 1 ? (
            // Step 1: Initial greeting
            <div className="relative flex flex-col items-center justify-center w-full max-w-2xl px-4 space-y-8 pt-16">
              <div className="relative z-50 bg-white rounded-2xl p-6 shadow-lg max-w-md mb-4">
                <div className="relative">
                  <p className="text-black text-2xl font-bold mb-4">Hi, I&apos;m Bitzy the Bull!</p>

                  <p className="text-black text-xl">I&apos;m here to help you around my Cyber Turf & show you how to claim your Bitcoin.</p>
                  <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-white rotate-45" />
                </div>
              </div>
              
              <div className="relative z-40">
                <img
                  src="/images/02_Bitzy/Bitzy.png"
                  alt="Bitzy the Bull"
                  className="w-64 h-64 object-contain"
                />
              </div>
              
              <button
                onClick={handleDismissOverlay}
                className="z-50 mt-8 text-white bg-[#F7931A] px-8 py-3 text-xl rounded-lg hover:bg-[#E8B749] transition-colors"
              >
                Let&apos;s Go!
              </button>
            </div>
          ) : (
            // Step 2: Highlighting claim button
            <div className="fixed inset-0 z-40 pointer-events-none">
              {/* Dark overlay with increased transparency */}
              <div className="absolute inset-0 bg-black bg-opacity-10" /> {/* Changed from bg-opacity-70 to bg-opacity-50 */}
              
              {/* Content container - moved up further */}
              <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ marginTop: '-320px' }}> {/* Adjusted from -100px to -180px */}
                {/* Text bubble and Bitzy container */}
                <div className="relative flex flex-col items-center">
                  {/* Text bubble */}
                  <div className="relative mb-4">
                    <div className="bg-white rounded-2xl p-4 shadow-lg text-center relative max-w-xs">
                      <p className="text-black text-xl font-medium">
                        Click the button below to claim your FREE Bitcoin!
                      </p>
                      {/* Pointer triangle */}
                      <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-white rotate-45" />
                    </div>
                  </div>

                  {/* Bitzy */}
                  <div className="mb-4">
                    <img
                      src="/images/02_Bitzy/Bitzy.png"
                      alt="Bitzy the Bull"
                      className="w-40 h-40 object-contain"
                    />
                  </div>

                  {/* Button highlight container */}
                  <div className="relative -mt-4">
                    <div className="absolute left-1/2 transform -translate-x-1/2 w-40 h-14">
                      <div className="w-full h-full bg-[#F7931A] opacity-10 rounded-lg animate-pulse" />
                    </div>
                  </div>
                </div>

                {/* Got it button */}
                <button
                  onClick={() => setShowOverlay(false)}
                  className="pointer-events-auto fixed bottom-20 text-white bg-[#F7931A] px-8 py-3 text-xl rounded-lg hover:bg-[#E8B749] transition-colors"
                >
                  Got it!
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Main content */}
      <main className="flex-grow pt-20 px-4 sm:px-6 lg:px-8 text-white">
        <div className="mx-auto max-w-md text-center">
          <h2 className="mt-2 text-4xl font-bold tracking-tight text-white sm:text-5xl">Congratulations!</h2>

          <div className="mt-4">
            <img
              src="/images/Bitcoin Logo.png"
              alt="Bitcoin Logo"
              className="h-20 w-20 mx-auto"
              style={{ objectFit: 'contain' }}
            />
          </div>

          <p className="mt-4 text-2xl font-bold text-white">You won 10,000 Sats</p>
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
              className="rounded-md bg-[#F7931A] px-4 py-2 text-white shadow-sm transition-colors hover:bg-[#E8B749] focus:outline-none focus:ring-2 focus:ring-[#F7931A] focus:ring-offset-2"
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