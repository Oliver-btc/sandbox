"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import HeaderCustomer from './HeaderCustomer';
import { MarbleGameComponent } from './marble-game';

export default function BitcoinEducation() {
  const [showGame, setShowGame] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-[#F7931A] to-black">
      <HeaderCustomer />

      <main className="flex-grow px-4 sm:px-6 lg:px-8 text-white">
        <div className="pt-4"> 
          <div className="flex items-center justify-center">
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
              <TabsContent value="about" className="mt-4">
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
        </div>

        <div className="mt-8 text-center">
          <Button 
            onClick={() => setShowGame(!showGame)} 
            className="bg-gradient-to-b from-[#F7931A] to-[#000000] text-white px-6 py-3 rounded-full text-lg font-semibold hover:bg-orange-600 transition-colors"
          >
            {showGame ? "Hide Game: Sats Plunge" : "Play Sats Plunge"}
          </Button>
        </div>

        {showGame && (
          <div className="mt-8 flex justify-center">
            <MarbleGameComponent />
          </div>
        )}
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