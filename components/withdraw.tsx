"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { JSX } from "react";

export default function Withdraw() {
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
        <h1 className="mt-2 text-3xl font-bold">Withdraw Bitcoin</h1>
      </div>
      <div className="flex flex-col items-center mt-2">
        <img
          src="/placeholder.svg"
          alt="Bitcoin QR Code"
          width="300"
          height="300"
          className="mb-4 rounded-lg"
          style={{ aspectRatio: "1 / 1", objectFit: "cover" }}
        />
        <p>Scan with your Lightning Wallet</p>
        <div className="flex flex-col items-center justify-center mt-4">
          <Button asChild>
            <button
              className="px-4 py-2 rounded-lg bg-black text-[#F7931A] border-2 border-[#F7931A] hover:bg-[#F7931A] hover:text-black"
              onClick={handleCopyClick}
            >
              Copy LN address
            </button>
          </Button>
          <p className="text-sm mt-4" style={{ color: 'gray' }}>
            No Lightning Wallet? click {" "}
            <Link href="/support" className="text-[#F7931A] hover:underline" prefetch={false}>
              support
            </Link>
          </p>
        </div>
      </div>

      {/* Done Button */}
      <div className="flex flex-col items-center mt-6">
        <Link href="/enter-club" prefetch={false}>
          <Button className="px-6 py-3 rounded-lg bg-[#F7931A] text-black hover:bg-[#e68b15]">
            Done
          </Button>
        </Link>
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
