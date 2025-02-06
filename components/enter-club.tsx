"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function EnterClub() {
  const handleCopyClick = () => {
    const lnAddress = "LN address here"; // Replace with your actual Lightning Network address
    navigator.clipboard.writeText(lnAddress)
      .then(() => {
        alert("LN address copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy LN address: ", err);
      });
  };

  return (
    <div className="flex flex-col items-center justify-start bg-gradient-to-b from-[#F7931A] to-black px-4 pt-4 sm:pt-6 sm:px-6 lg:px-8 text-white min-h-screen">
      <div className="mx-auto max-w-md text-center">
        <img
          src="/images/Bullish Beef_White.png"
          alt="Bitcoin Logo"
          className="h-20 w-20 mx-auto"
          style={{ objectFit: 'contain' }}
        />
        <h1 className="mt-2 text-3xl font-bold">Welcome to Bitcoin Club</h1>
      </div>
      <div className="flex flex-col items-center mt-2">
        <img
          src="/images/Bitcoin Club.png"
          alt="Bitcoin Club"
          width="400"
          height="400"
          className="mb-4 rounded-lg"
          style={{ aspectRatio: "1 / 1", objectFit: "cover" }}
        />
        
        {/* Disclaimer Text */}
        <p className="text-3xl font-bold mt-4">Disclaimer!</p>
        <p className="text-xl font-bold mt-2">Entering the Bitcoin Club grants you Laser Eyes!</p>

        {/* Text wrapped within a container with the same width as the image */}
        <div className="max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg text-center mt-2">
          <p>
            Your views on the financial world, health, nutrition… even sunscreen will change forever! 👀
          </p>
        </div>

        <div className="max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg text-center mt-6">
          <p>
            If you are ready to go down the Bitcoin Rabbit hole, take the{" "}
          </p>
        </div>

        {/* Orange Pill Image and Link */}
        <div className="mt-2 text-center">
          <Link href="https://www.bullish-btc.com/" target="_blank" rel="noopener noreferrer">
            <img
              src="/images/OrangePill.png"
              alt="Orange Pill"
              className="w-20 h-20 mx-auto"
              style={{ objectFit: 'contain' }}
            />
            <p className="text-[#F7931A] hover:underline mt-2">Orange Pill</p>
          </Link>
        </div>
      
        <div className="max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg text-center mt-6">
          <p>
            If you are not interested in the truth & want to keep living in a bubble, take the{" "}
          </p>
        </div>

        {/* Blue Pill Image and Link */}
        <div className="mt-2 text-center">
          <Link href="https://www.federalreserve.gov/" target="_blank" rel="noopener noreferrer">
            <img
              src="/images/Blue Pill.png"
              alt="Blue Pill"
              className="w-19 h-19 mx-auto"
              style={{ objectFit: 'contain' }}
            />
            <p className="text-[#2388e6] hover:underline mt-2">Blue Pill</p>
          </Link>
        </div>
      </div>

      {/* New "Your personal Dashboard" Button */}
      <div className="flex flex-col items-center mt-6">
        <Link href="/history-claim" prefetch={false}>
          <Button className="px-6 py-3 rounded-lg bg-[#F7931A] text-black hover:bg-[#e68b15]">
            Your personal Dashboard
          </Button>
        </Link>
      </div>

      {/* Powered by Section */}
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
