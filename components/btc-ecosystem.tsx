"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { JSX, SVGProps } from "react";
import React, { useState } from 'react';
import { X, Menu, House, Trophy, ShoppingBag, BriefcaseBusiness } from "lucide-react";
import { useRouter } from 'next/navigation';
import MarketplaceCard from './MarketplaceCard'; // Import the new MarketplaceCard component
import CategoryFilter from './CategoryFilter';
import { Switch } from "@/components/ui/switch";
import HeaderCustomer from './HeaderCustomer';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { Footer } from "@/components/Footer"; 

const handleBooking = (calendlyUrl: string) => {
  window.open(calendlyUrl, '_blank');
};


export function BtcEcosystem() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showOnlyBeyondCheckout, setShowOnlyBeyondCheckout] = useState(false);
  const router = useRouter();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navigateTo = (path: string) => {
    router.push(path);
    setIsMenuOpen(false);
  };

  const featuredProducts = [
    {
      id: 1,
      product: {
        name: 'Bitcoin Trading Cards',
        description: 'BadAss Bitcoin Trading Cards.',
        websiteUrl: 'https://btc-tc.com/',
        image: '/images/BTC-TC/BTC-TC_HEWP.jpg',
        logo: '/images/BTC-TC/BTC-TC_Gold-Black.jpg',
        isLive: true,
        promoCode: 'BTC10OFF',
        discountPercentage: 10,
        poweredByBeyondCheckout: true,
        category: "Art & Collectibles"
      },
      qrBatches: []
    },
    {
      id: 2,
      product: {
        name: 'iiCING Flavor Shots',
        description: 'Your Bevvy...your Way',
        websiteUrl: 'https://www.iicing.ca/',
        image: '/images/iiCING/iiCING group.jpg',
        logo: '/images/iiCING/iiCiNG_logo.png',
        isLive: true,
        promoCode: 'BEYONDiiCING',
        discountPercentage: 10,
        poweredByBeyondCheckout: true,
        category: "Consumable Products"
      },
      qrBatches: []
    },
    {
      id: 3,
      product: {
        name: 'Shamory',
        description: 'Bitcoin Fun for all Ages.',
        websiteUrl: 'https://shamory.com/',
        image: '/images/Shamory/SHAmoryProducts.webp',
        logo: '/images/Shamory/ShamoryLogo.jpg',
        isLive: true,
        promoCode: 'P4B20OFF',
        discountPercentage: 20,
        category: "Games & Education"
      },
      qrBatches: []
    },
    {
      id: 4,
      product: {
        name: 'Satoshi Coffee',
        description: 'BadAss Bitcoin Coffee',
        websiteUrl: 'https://sats.coffee/',
        image: '/images/SatoshiCoffee/SatoshiCoffeeProducts.webp',
        logo: '/images/SatoshiCoffee/SatoshiCoffeeLogo.png',
        isLive: true,
        promoCode: 'P4B20OFF',
        discountPercentage: 20,
        poweredByBeyondCheckout: true,
        category: "Consumable Products"
      },
      qrBatches: []
    },
    {
      id: 5,
      product: {
        name: 'BitAxe',
        description: 'Bitcoin Mining for Everyone',
        websiteUrl: 'https://www.solosatoshi.com/',
        image: '/images/BitAxe/BitAxeProduct.jpg',
        logo: '/images/BitAxe/BitAxeLogo.png',
        isLive: true,
        promoCode: 'Beyond10',
        discountPercentage: 10,
        category: "Mining & Hardware"
      },
      qrBatches: []
    },
    {
      id: 6,
      product: {
        name: 'Bullish Beef',
        description: 'Tasty Beef Jerky with Bitcoin Rewards',
        websiteUrl: 'https://www.bullish-btc.com/',
        image: '/images/BullishBeef/BullishBeefPackage.jpg',
        logo: '/images/BullishBeef/BullishBeefLogo.jpg',
        isLive: true,
        promoCode: 'Beyond10',
        discountPercentage: 10,
        poweredByBeyondCheckout: true,
        category: "Consumable Products"
      },
      qrBatches: []
    },
    {
      id: 7,
      product: {
        name: 'Panties for Bitcoin',
        description: 'BadAss Bitcoin Panties.',
        websiteUrl: 'https://btc-tc.com/',
        image: '/images/P4B/P4B_Broad.png',
        logo: '/images/P4B/P4B.jpg',
        isLive: true,
        promoCode: 'P4B20OFF',
        discountPercentage: 20,
        category: "Merchandise & Apparel"
      },
      qrBatches: []
    },
    {
      id: 8,
      product: {
        name: 'Peony Lane',
        description: 'Naked Wine, Elevated',
        websiteUrl: 'https://www.peonylanewine.com/',
        image: '/images/PeonyLane/PeonyLaneProduct.png',
        logo: '/images/PeonyLane/PeonyLaneLogo.jpg',
        isLive: true,
        promoCode: 'Beyond10',
        discountPercentage: 10,
        category: "Consumable Products"
      },
      
      qrBatches: []
    },
    {
      id: 9,
      product: {
        name: 'Free Market Kids',
        description: 'BadAss Bitcoin Game.',
        websiteUrl: 'https://www.freemarketkids.com/',
        image: '/images/FMK/HODL_UP_Product.webp',
        logo: '/images/FMK/FMK_Logo.webp',
        isLive: true,
        promoCode: 'P4B20OFF',
        discountPercentage: 20,
        poweredByBeyondCheckout: true,
        category: "Games & Education"
      },
      qrBatches: []
    }
  ];

  const categories = Array.from(new Set(featuredProducts.map(product => product.product.category)));

  const filteredProducts = featuredProducts.filter(product => 
    (!selectedCategory || product.product.category === selectedCategory) &&
    (!showOnlyBeyondCheckout || product.product.poweredByBeyondCheckout)
  );

  // <header className="bg-gradient-to-b from-[#F7931A] to-[#000000] text-white p-4 sticky top-0 z-50 w-full">

  return (
    <div className="flex flex-col items-center justify-start bg-black px-2 pt-2 sm:pt-0 sm:px-2 lg:px-2 text-white min-h-screen">  
      <HeaderCustomer /> {/* Use the HeaderCustomer component here */}
      <div className="w-full max-w-7xl mt-4 space-y-4">
        <div className="flex flex-col items-center space-y-4">
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onCategorySelect={setSelectedCategory}
          />
          <div className="flex items-center space-x-2">
            <Switch
              checked={showOnlyBeyondCheckout}
              onCheckedChange={setShowOnlyBeyondCheckout}
              className={`${showOnlyBeyondCheckout ? 'bg-[#F7931A]' : 'bg-gray-600'}`}
            />
            {showOnlyBeyondCheckout ? (
              <div className="flex items-center">
                <span className="text-sm text-[#F7931A] font-semibold mr-2">
                  Powered by
                </span>
                <img
                  src="/images/BeyondTC.png"
                  alt="Beyond The Checkout"
                  className="h-6"
                />
              </div>
            ) : (
              <span className="text-sm text-gray-400">
                All Products
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredProducts.map((product) => (
            <MarketplaceCard key={product.id} productUnit={product} />
          ))}
        </div>
      </div>

      <Footer onBooking={handleBooking} />
    </div>
  );
}
