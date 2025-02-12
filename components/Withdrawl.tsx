"use client"

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from 'lucide-react';

export default function Withdrawal() {
  const [step, setStep] = useState(0);
  const [tooltipOpen, setTooltipOpen] = useState(false);

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

  const getStepTitle = (step: number) => {
    switch(step) {
      case 0:
        return "Bitcoin Education";
      case 1:
        return "Product Feedback";
      case 2:
        return "Withdraw Bitcoin";
      case 3:
        return "Lightning Wallet";
      default:
        return "";
    }
  };

  const renderStep = () => {
    switch(step) {
      case 0:
        return (
          <div className="pt-20">
            <div className="mt-2 flex items-center justify-center">
              <Tabs defaultValue="about" className="w-full max-w-md">
                <TabsList className="grid grid-cols-3 bg-black/20 rounded-lg p-1">
                  <TabsTrigger value="about" className="text-white">
                    Decentralization
                  </TabsTrigger>
                  <TabsTrigger value="transactions" className="text-white">
                    Blockchain
                  </TabsTrigger>
                  <TabsTrigger value="security" className="text-white">
                    Mining Bitcoin
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="about" className="mt-2">
                  <div className="flex flex-col items-center bg-black p-4 rounded-lg">
                    <img
                      src="/images/Decentralized.png"
                      alt="Bitcoin"
                      width="550"
                      height="550"
                      className="mb-4 rounded-lg"
                      style={{ aspectRatio: "550/550", objectFit: "cover" }}
                    />
                    <p className="text-white">
                      Bitcoin is a decentralized digital currency created in 2009 by an anonymous entity known as Satoshi Nakamoto. It allows peer-to-peer transactions without intermediaries like banks, making it a revolutionary form of money.
                    </p>
                    <Link href="https://www.hope.com/" className="mt-4 text-[#F7931A] hover:underline" target="_blank" rel="noopener noreferrer" prefetch={false}>
                    Learn more
                    </Link>
                  </div>
                </TabsContent>
                <TabsContent value="transactions" className="mt-4">
                  <div className="flex flex-col items-center bg-black p-4 rounded-lg">
                    <img
                      src="/images/Blockchain.png"
                      alt="Bitcoin Transactions"
                      width="550"
                      height="550"
                      className="mb-4 rounded-lg"
                      style={{ aspectRatio: "550/550", objectFit: "cover" }}
                    />
                    <p className="text-white">
                      Bitcoin operates on a technology called blockchain, a public ledger that records all transactions. Each block in the chain contains a list of transactions linked to the previous block, ensuring security and transparency.
                    </p>
                    <Link href="https://www.hope.com/" className="mt-4 text-[#F7931A] hover:underline" target="_blank" rel="noopener noreferrer" prefetch={false}>
                    Learn more
                    </Link>
                  </div>
                </TabsContent>
                <TabsContent value="security" className="mt-4">
                  <div className="flex flex-col items-center bg-black p-4 rounded-lg">
                    <img
                      src="/images/BitcoinMining.png"
                      alt="Bitcoin Security"
                      width="550"
                      height="550"
                      className="mb-4 rounded-lg"
                      style={{ aspectRatio: "550/550", objectFit: "cover" }}
                    />
                    <p className="text-white">
                      Bitcoin mining is the process by which new Bitcoins are created, and transactions are verified. Miners use powerful computers to solve complex mathematical problems, and in return, they earn Bitcoin as a reward.
                    </p>
                    <Link href="https://www.hope.com/" className="mt-4 text-[#F7931A] hover:underline" target="_blank" rel="noopener noreferrer" prefetch={false}>
                    Learn more
                    </Link>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
            <div className="mt-8 text-center">
              <Button 
                className="px-6 py-3 rounded-lg bg-[#F7931A] text-black hover:bg-[#e68b15]"
                onClick={() => setStep(1)}
              >
                Withdraw Bitcoin
              </Button>
            </div>
          </div>
        );
        case 1:
        return (
          <div className="pt-20">
            <div className="mt-2 flex justify-center">
              <div className="w-full max-w-md bg-black rounded-lg p-6">
                <img
                  src="/images/Bullish Beef.png"
                  alt="Bullish Beef"
                  className="w-full h-auto mb-6 rounded-lg"
                  style={{ maxWidth: '300px', margin: '0 auto' }}
                />
                <p className="text-white text-xl font-bold text-center mb-4">What do you think?</p>
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <Button variant="outline" className="w-full">🤩 I LOVE it!</Button>
                  <Button variant="outline" className="w-full">😁 I Like it!</Button>
                  <Button variant="outline" className="w-full">😏 It&apos;s OK</Button>
                </div>
                <Textarea 
                  placeholder="Leave a comment..." 
                  className="w-full rounded-lg bg-[#1a1a1a] text-white p-4"
                  rows={4}
                />
              </div>
            </div>
            <div className="mt-6 text-center">
              <Button 
                className="px-6 py-3 rounded-lg bg-[#F7931A] text-black hover:bg-[#e68b15]"
                onClick={() => setStep(2)}
              >
                Withdraw Bitcoin
              </Button>
            </div>
          </div>
        );
        case 2:
        return (
          <div className="pt-20">
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
                <p className="text-sm mt-4 flex items-center" style={{ color: 'gray' }}>
                  No Lightning Wallet? click
                  <Button
                    className="text-[#F7931A] hover:underline ml-1 p-0 h-auto"
                    onClick={() => setStep(3)}
                    variant="link"
                  >
                    support
                  </Button>
                </p>
              </div>
            </div>
            <div className="flex flex-col items-center mt-6">
              <Link href="/history-claim" prefetch={false}>
                <Button className="px-6 py-3 rounded-lg bg-[#F7931A] text-black hover:bg-[#e68b15]">
                  Your personal Dashboard
                </Button>
              </Link>
            </div>
          </div>
        );
        case 3:
        return (
          <div className="pt-20">
            <div className="mx-auto max-w-md text-center">
              <h1 className="mt-2 text-xl font-bold mb-2">What&apos;s a Lightning Wallet?</h1>
              <p className="relative">
                A Lightning Wallet is a Bitcoin wallet that enables fast, low-cost transactions using the Lightning Network
                <TooltipProvider>
                  <Tooltip open={tooltipOpen} onOpenChange={setTooltipOpen}>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="p-0 h-auto ml-1 align-middle"
                        onClick={(e) => {
                          e.preventDefault();
                          setTooltipOpen(!tooltipOpen);
                        }}
                      >
                        <Info className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent 
                      side="bottom" 
                      align="center"
                      className="w-64 md:w-80 bg-gradient-to-b from-[#F7931A] to-black text-white p-4 rounded-lg shadow-lg"
                    >
                      <p className="text-sm">
                        The Lightning Network is a second-layer solution built on top of the Bitcoin blockchain that enables fast, low-cost transactions by creating off-chain payment channels between users while still maintaining the security of the Bitcoin network.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                .
              </p>
            </div>

            <div className="flex flex-col items-center mt-8">
              <h1 className="text-md font-bold mb-6">Lightning Wallets we recommend</h1>
              <div className="space-y-6">
                <Link href="https://apps.apple.com/us/app/speed-bitcoin-wallet/id6462426281" target="_blank" rel="noopener noreferrer" className="block">
                  <img
                    src="/images/SpeedLogo.png"
                    alt="Speed Logo"
                    width="100"
                    height="100"
                    className="mx-auto mb-2 rounded-lg"
                    style={{ aspectRatio: "1 / 1", objectFit: "cover" }}
                  />
                  <p className="text-[#F7931A] hover:underline">Speed Wallet</p>
                </Link>
                <Link href="https://apps.apple.com/us/app/muun-wallet/id1482037683" target="_blank" rel="noopener noreferrer" className="block">
                  <img
                    src="/images/Muun Logo.png"
                    alt="Muun Logo"
                    width="100"
                    height="100"
                    className="mx-auto mb-2 rounded-lg"
                    style={{ aspectRatio: "1 / 1", objectFit: "cover" }}
                  />
                  <p className="text-[#F7931A] hover:underline">Muun Wallet</p>
                </Link>
              </div>
            </div>

            <div className="flex flex-col items-center mt-8">
              <Button 
                className="px-6 py-3 rounded-lg bg-[#F7931A] text-black hover:bg-[#e68b15]"
                onClick={() => setStep(2)}
              >
                Back to Withdraw Bitcoin
              </Button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-[#F7931A] to-black">
      <header className="fixed top-0 left-0 right-0 bg-gradient-to-b from-[#F7931A] to-black z-50 shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center h-16">
            <div className="flex items-center">
              <img
                src="/images/Bullish Beef_White.png"
                alt="Bullish Beef Logo"
                className="h-10 w-10"
                style={{ objectFit: 'contain' }}
              />
              <h1 className="text-2xl font-bold text-white ml-3">{getStepTitle(step)}</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow px-4 sm:px-6 lg:px-8 text-white">
        {renderStep()}
      </main>

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