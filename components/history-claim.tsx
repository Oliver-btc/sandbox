"use client";

import Link from 'next/link';
import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MessageCircleIcon, Edit3, Facebook, Twitter, Linkedin, X, Share, Menu, Gift, House, ShoppingBag, Users } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { parse, format, getTime } from 'date-fns';
import { ShoppingCart, Share2, Trophy, Eye, EyeOff, BriefcaseBusiness } from "lucide-react";
import React from 'react';
import Image from 'next/image';
import { Switch } from "@/components/ui/switch";
import HeaderCustomer from './HeaderCustomer'; // Import the new HeaderCustomer component

// Define types for our components
type DialogProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

type ShareModalProps = {
  isOpen: boolean;
  onClose: () => void;
  product: {
    avatarSrc: string;
    businessName: string;
    shopUrl: string;
    sats: number;
  };
};

type CardType = {
  id: number;
  avatarSrc: string;
  businessName: string;
  status: string;
  statusColor: string;
  borderColor: string;
  created: string;
  logoSrc: string;
  amount: string;
  sats: number;
  rewardMessage: string;
  rewardTime: string;
  rewardLocation: string;
  shopUrl: string;
  homepageUrl: string;
};

// Simple Dialog component
const Dialog: React.FC<DialogProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#000000] bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-gradient-to-b from-[#000000] to-[#F7931A] text-white rounded-lg p-6 max-w-sm w-full shadow-lg">
        <button onClick={onClose} className="float-right text-white hover:text-gray-200">
          <X size={24} />
        </button>
        {children}
      </div>
    </div>
  );
};

// ShareModal component
const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, product }) => {
  const [showSats, setShowSats] = useState(true);
  const shareUrl = product.shopUrl;
  const shareText = showSats
    ? `I won ${product.sats} sats of free Bitcoin from ${product.businessName}!`
    : `I won free Bitcoin from ${product.businessName}!`;

  const shareFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
  };

  const shareTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`, '_blank');
  };

  const shareLinkedIn = () => {
    window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(shareText)}`, '_blank');
  };

  const shareVia = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "I won free Bitcoin!",
          text: shareText,
          url: shareUrl,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      alert('Web Share API is not supported in your browser. Please use the other share options.');
    }
  };

  const toggleSatsVisibility = () => {
    setShowSats(!showSats);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-gradient-to-b from-[#000000] to-[#F7931A] text-white rounded-lg p-6 max-w-sm w-full shadow-lg max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="float-right text-white hover:text-gray-200">
          <X size={24} />
        </button>
        <div className="flex items-center justify-center mb-4">
          <img src="/images/Bitcoin Logo.png" alt="Bitcoin Logo" className="w-6 h-6 mr-2" />
          <h2 className="text-2xl font-bold">Bitcoin Rewards!</h2>
        </div>
        <div className="grid gap-4 py-4">
          <img 
            src={product.avatarSrc} 
            alt={product.businessName} 
            className="w-full h-auto max-h-[30vh] object-contain rounded-lg"
          />
          <div className="flex items-center justify-between relative">
            <div className="w-full flex justify-center items-center">
              <div className="flex items-center">
                {/* <img src="/images/Bitcoin Logo.png" alt="Bitcoin Logo" className="w-6 h-6 mr-2" /> */}
                <p className="text-2xl font-bold">
                  {showSats ? (
                    <>
                      I won <span className="text-white font-under">{product.sats}</span> sats
                    </>
                  ) : (
                    'I won Free Bitcoin!'
                  )}
                </p>
              </div>
            </div>
            <button 
              onClick={toggleSatsVisibility} 
              className="text-white hover:text-gray-200 absolute right-0"
            >
              {showSats ? <Eye size={24} /> : <EyeOff size={24} />}
            </button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <Button onClick={shareVia} className="col-span-3 bg-[#F7931A] hover:bg-gradient-to-b from-[#F7931A] to-[#000000] text-white">
              <Share className="mr-2 h-4 w-4" /> Share via...
            </Button>            
            <Button onClick={shareFacebook} className="bg-[#1b66de] hover:bg-gradient-to-b from-[#F7931A] to-[#000000] text-white">
              <Facebook className="mr-2 h-4 w-4" /> Facebook
            </Button>
            <Button onClick={shareTwitter} className="bg-[#1b66de] hover:bg-gradient-to-b from-[#F7931A] to-[#000000] text-white">
              <Twitter className="mr-2 h-4 w-4" /> Twitter
            </Button>
            <Button onClick={shareLinkedIn} className="bg-[#1b66de] hover:bg-gradient-to-b from-[#F7931A] to-[#000000] text-white">
              <Linkedin className="mr-2 h-4 w-4" /> LinkedIn
            </Button>
          </div>
          <div className="flex flex-col items-center">
            <p className="text-gray-400 text-sm">Powered by</p>
            <img
              src="/images/BeyondTC_w.png"
              alt="Beyond The Checkout"
              width="100"
              height="50"
              style={{ aspectRatio: "2.34 / 1", objectFit: "cover" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;

// Main ShareTest component
export function HistoryClaim() {
  const searchParams = useSearchParams();
  const filterFromQuery = searchParams.get("filter") || "All";
  const router = useRouter();

  const [filter, setFilter] = useState<string>(filterFromQuery);
  const [businessFilter, setBusinessFilter] = useState<string>("All");
  const [customerName, setCustomerName] = useState("Anon");
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(customerName);
  const [bitcoinPrice, setBitcoinPrice] = useState<number | null>(null);
  const [satsPerDollar, setSatsPerDollar] = useState<number | null>(null);
  const [showSatsPerDollar, setShowSatsPerDollar] = useState(false);
  const [expandedCardId, setExpandedCardId] = useState<number | null>(null); 
  const [displayUnit, setDisplayUnit] = useState<'sats' | 'dollars'>('sats'); // State to track the display unit
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<CardType | null>(null);

  
  
  useEffect(() => {
    setFilter(filterFromQuery);
  }, [filterFromQuery]);

  useEffect(() => {
    async function fetchBitcoinPrice() {
      try {
        const response = await fetch(
          'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd',
          {
            headers: {
              'accept': 'application/json',
              // Add your API key if you have one
              // 'x-cg-demo-api-key': process.env.NEXT_PUBLIC_COINGECKO_API_KEY || ''
            }
          }
        );
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        const price = data.bitcoin.usd;
        setBitcoinPrice(price);
        setSatsPerDollar(Math.round(100000000 / price));
      } catch (error) {
        console.error("Error fetching Bitcoin price:", error);
      }
    }
  
    fetchBitcoinPrice();
    const intervalId = setInterval(fetchBitcoinPrice, 60000); // Fetch every minute
    return () => clearInterval(intervalId);
  }, []);

  const handleNameChange = () => {
    setIsEditing(false);
    setCustomerName(newName);
  };

  const togglePriceDisplay = () => {
    setShowSatsPerDollar((prev) => !prev);
  };

  const toggleCardExpansion = (id: number) => {
    setExpandedCardId(expandedCardId === id ? null : id);
  };

  const handleReOrder = (shopUrl: string) => {
    window.open(shopUrl, "_blank");
  };
  

  const handleShareReward = (product: CardType) => {
    setSelectedProduct(product);
    setIsShareModalOpen(true);
  };

  const toggleDisplayUnit = () => {
    setDisplayUnit((prev) => (prev === 'sats' ? 'dollars' : 'sats'));
  };

const cards: CardType[] = [
    {
      id: 1,
      avatarSrc: "/images/Bullish Beef_White.png",
      businessName: "Bullish Beef",
      status: "Claimed",
      statusColor: "#F7931A",
      borderColor: "#F7931A",
      created: "Claimed 3 weeks ago",
      logoSrc: "/images/Bitcoin Logo.png",
      amount: "$1.00",
      sats: 1000,
      rewardMessage: "Scanned on Jul. 17th, 2024",
      rewardTime: "10:00 AM, Jul 17, 2024",
      rewardLocation: "Los Angeles, CA",
      shopUrl: "https://www.bullish-btc.com/shop",
      homepageUrl: "https://www.bullish-btc.com/",
    },  
    {
      id: 2,
      avatarSrc: "/images/Bullish Beef_White.png",
      businessName: "Bullish Beef",
      status: "Claimed",
      statusColor: "#F7931A",
      borderColor: "#F7931A",
      created: "Claimed 3 weeks ago",
      logoSrc: "/images/Bitcoin Logo.png",
      amount: "$1.00",
      sats: 2000,
      rewardMessage: "Scanned on Jul. 27th, 2024",
      rewardTime: "10:00 AM, Jul 27, 2024",
      rewardLocation: "Los Angeles, CA",
      shopUrl: "https://www.bullish-btc.com/shop",
      homepageUrl: "https://www.bullish-btc.com/",
    },  
    { 
      id: 3,
      avatarSrc: "/images/Satoshi-Coffee.webp",
      businessName: "Satoshi-Coffee",
      status: "Claimed",
      statusColor: "#F7931A",
      borderColor: "#F7931A",
      created: "Scanned 2 weeks ago",
      logoSrc: "/images/Bitcoin Logo.png",
      amount: "$0.90",
      sats: 1500,
      rewardMessage: "Claimed on Aug. 7th, 2024",
      rewardTime: "4:30 PM, Aug 7, 2024",
      rewardLocation: "Los Angeles, CA",
      shopUrl: "https://sats.coffee/product/el-salvador-coffee/",
      homepageUrl: "https://sats.coffee/",
    },
    {
      id: 4,
      avatarSrc: "/images/Satoshi-Coffee.webp",
      businessName: "Satoshi-Coffee",
      status: "Claimed",
      statusColor: "#F7931A",
      borderColor: "#F7931A",
      created: "Claimed 2 weeks ago",
      logoSrc: "/images/Bitcoin Logo.png",
      amount: "$1.00",
      sats: 2000,
      rewardMessage: "Scanned on Aug. 10th, 2024",
      rewardTime: "12:30 PM, Aug 10, 2024",
      rewardLocation: "Los Angeles, CA",
      shopUrl: "https://sats.coffee/product/el-salvador-coffee/",
      homepageUrl: "https://sats.coffee/",
    },
    {
      id: 5,
      avatarSrc: "/images/Kreamsicle.png",
      businessName: "iicing Flavor Shot",
      status: "Withdrawn",
      statusColor: "#22c55e",
      borderColor: "#22c55e",
      created: "Withdrawn 7 days ago",
      logoSrc: "/images/Kreamsicle.png",
      amount: "$0.75",
      sats: 1200,
      rewardMessage: "Withdrawn on Aug. 12th, 2024",
      rewardTime: "2:30 PM, Aug 12, 2024",
      rewardLocation: "Los Angeles, CA",
      shopUrl: "https://www.iicing.ca/buy-iicing-online/p/kreamsicle",
      homepageUrl: "https://www.iicing.ca/",
    },
    {
      id: 6,
      avatarSrc: "/images/Kreamsicle.png",
      businessName: "iicing Flavor Shot",
      status: "Withdrawn",
      statusColor: "#22c55e",
      borderColor: "#22c55e",
      created: "Withdrawn 7 days ago",
      logoSrc: "/images/Kreamsicle.png",
      amount: "$0.75",
      sats: 1200,
      rewardMessage: "Withdrawn on Aug. 14th, 2024",
      rewardTime: "2:30 PM, Aug 14, 2024",
      rewardLocation: "Los Angeles, CA",
      shopUrl: "https://www.iicing.ca/buy-iicing-online/p/kreamsicle",
      homepageUrl: "https://www.iicing.ca/",
    },
    {
      id: 7,
      avatarSrc: "/images/Bullish Beef_White.png",
      businessName: "Bullish Beef",
      status: "Claimed",
      statusColor: "#F7931A",
      borderColor: "#F7931A",
      created: "Claimed 3 weeks ago",
      logoSrc: "/images/Bitcoin Logo.png",
      amount: "$1.00",
      sats: 2000,
      rewardMessage: "Scanned on Jul. 27th, 2024",
      rewardTime: "10:00 AM, Aug 17, 2024",
      rewardLocation: "Los Angeles, CA",
      shopUrl: "https://www.bullish-btc.com/shop",
      homepageUrl: "https://www.bullish-btc.com/",
    },
    {
      id: 8,
      avatarSrc: "/images/Bullish Beef_White.png",
      businessName: "Bullish Beef",
      status: "Withdrawn",
      statusColor: "#22c55e",
      borderColor: "#22c55e",
      created: "Withdrawn 8 days ago",
      logoSrc: "/images/Bitcoin Logo.png",
      amount: "$0.75",
      sats: 1200,
      rewardMessage: "Withdrawn on Aug. 11th, 2024",
      rewardTime: "3:30 PM, Aug 20, 2024",
      rewardLocation: "Los Angeles, CA",
      shopUrl: "https://www.bullish-btc.com/shop",
      homepageUrl: "https://www.bullish-btc.com/",
    },
  ];

    // Prepare data for the cumulative rewards graph
    let cumulativeSats = 0;
    const graphData = cards.map((card) => {
      cumulativeSats += card.sats;
      return {
        time: getTime(parse(card.rewardTime, 'hh:mm a, MMM d, yyyy', new Date())), // Convert to timestamp
        cumulativeSats, // y-axis
      };
    });

  // Calculate sums of sats based on status
  const sumSats = (status: string) => {
    return cards
      .filter(
        (card) =>
          (status === "All" || card.status === status) &&
          (businessFilter === "All" || card.businessName === businessFilter)
      )
      .reduce((total, card) => total + card.sats, 0);
  };

  const filteredCards = cards.filter(
    (card) =>
      (filter === "All" || card.status === filter) &&
      (businessFilter === "All" || card.businessName === businessFilter)
  );

  const unclaimedCount = cards.filter((card) => card.status === "UnClaimed").length;
  const claimedCount = cards.filter((card) => card.status === "Claimed").length;
  const withdrawnCount = cards.filter((card) => card.status === "Withdrawn").length;

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="flex flex-col bg-gradient-to-b from-[#F7931A] to-[#000000] text-white min-h-screen">
      <HeaderCustomer />      
        <div className="flex flex-col items-center justify-start px-4 pt-4 sm:pt-6 sm:px-6 lg:px-8">
        {/* Customer Card with Back to Dashboard Button */}
      <Card className="w-full max-w-lg mb-2 bg-[#000000] text-white rounded-lg">
        <CardHeader className="p-4 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="w-24 h-24">
                <AvatarImage src="/images/BTCAvatar.webp" alt="Customer Icon" />
                <AvatarFallback>{customerName}</AvatarFallback>
              </Avatar>
              <div>
                {isEditing ? (
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    onBlur={handleNameChange}
                    className="text-2xl font-bold bg-[#000000] border-b border-white focus:outline-none"
                  />
                ) : (
                  <p className="text-4xl font-bold">{customerName}</p>
                )}
                <p className="text-sm">Joined Aug. 20, 2024</p>
              </div>
            </div>
            <button
              onClick={() => setIsEditing(true)}
              className="text-gray-400 hover:text-white"
            >
              <Edit3 className="w-6 h-6" />
            </button>
          </div>
          
          {/* Bitcoin Price inside Customer Card */}
          <div
            className="absolute top-2 right-2 flex items-center space-x-1 cursor-pointer"
            onClick={togglePriceDisplay}
          >
            <img
              src="/images/Bitcoin Logo.png"
              alt="Bitcoin Logo"
              className="w-4 h-4"
            />
            <p className="text-xs text-white">
              {showSatsPerDollar && satsPerDollar
                ? `${satsPerDollar} sats/$`
                : bitcoinPrice
                ? `$${bitcoinPrice.toLocaleString()}`
                : "Loading..."}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-2">
              

              <div className="flex flex-col items-center w-full">
                <Button
                  variant={filter === "All" ? "default" : "outline"}
                  className="w-full px-6 py-2 sm:py-3 rounded-lg bg-[#000000] text-white border border-[#FFFFFF] transition-transform duration-300 hover:bg-[#e68b15] hover:text-white transform hover:scale-105 text-xs sm:text-base"
                  onClick={() => setFilter("All")}
                >
                  All
                </Button>
                <p className="font-bold mt-2 sm:mt-2">
                  ${satsPerDollar !== null ? (sumSats("All") / satsPerDollar).toFixed(2) : "N/A"}
                </p>
                <p className="text-xs text-muted-foreground mt-2 sm:mt-0">
                  {sumSats("All")} sats
                </p>
                <p className="text-xs text-muted-foreground mt-2 sm:mt-0">
                  {cards.length} reward(s)
                </p>
              </div>

              

              <div className="flex flex-col items-center w-full">
                <Button
                  variant={filter === "Claimed" ? "default" : "outline"}
                  className="w-full px-6 py-2 sm:py-3 rounded-lg bg-[#F7931A] text-black border border-[#FFFFFF] transition-transform duration-300 hover:bg-[#e68b15] hover:text-white transform hover:scale-105 text-xs sm:text-base"
                  onClick={() => setFilter("Claimed")}
                >
                  Claimed
                </Button>
                <p className="font-bold mt-2 sm:mt-2">
                  ${satsPerDollar !== null ? (sumSats("Claimed") / satsPerDollar).toFixed(2) : "N/A"}
                </p>
                <p className="text-xs text-muted-foreground mt-2 sm:mt-0">
                  {sumSats("Claimed")} sats
                </p>
                <p className="text-xs text-muted-foreground mt-2 sm:mt-0">
                  {claimedCount} reward(s)
                </p>
              </div>

              <div className="flex flex-col items-center w-full">
                <Button
                  variant={filter === "Withdrawn" ? "default" : "outline"}
                  className="w-full px-6 py-2 sm:py-3 rounded-lg bg-[#22c55e] text-black border border-[#FFFFFF] transition-transform duration-300 hover:bg-[#e68b15] hover:text-white transform hover:scale-105 text-xs sm:text-base"
                  onClick={() => setFilter("Withdrawn")}
                >
                  Withdrawn
                </Button>
                <p className="font-bold mt-2 sm:mt-2">
                  ${satsPerDollar !== null ? (sumSats("Withdrawn") / satsPerDollar).toFixed(2) : "N/A"}
                </p>
                <p className="text-xs text-muted-foreground mt-2 sm:mt-0">
                  {sumSats("Withdrawn")} sats
                </p>
                <p className="text-xs text-muted-foreground mt-2 sm:mt-0">
                  {withdrawnCount} reward(s)
                </p>
              </div>
            </div>


          {/* Centered and Smaller Back to Dashboard Button */}
          <div className="flex justify-center mt-2 space-x-4"> {/* Add space-x-4 for spacing */}
              <div className="relative">
                <select
                  value={businessFilter}
                  onChange={(e) => setBusinessFilter(e.target.value)}
                  className="px-3 py-1 text-xs rounded-md bg-gradient-to-b from-[#F7931A] to-black text-white border border-white transition-transform duration-300 hover:bg-[#e68b15] hover:text-white transform hover:scale-105 appearance-none pr-8"
                  style={{
                    minHeight: "auto",
                    height: "24px",
                    lineHeight: "1",
                    backgroundColor: "transparent",
                    backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 20 20\' fill=\'%23ffffff\'%3E%3Cpath d=\'M5.5 7l4.5 4 4.5-4\'/%3E%3C/svg%3E")',
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right 8px center",
                  }}
                >
                  <option value="All">All Products</option>
                  <option value="Bullish Beef">Bullish Beef</option>
                  <option value="Satoshi-Coffee">Satoshi-Caffee</option>
                </select>
              </div>
              
              <div className="relative">
                <Button
                  variant="outline"
                  className="px-3 py-2 text-xs rounded-md bg-gradient-to-b from-[#F7931A] to-black text-white border border-white transition-transform duration-300 hover:bg-[#e68b15] hover:text-white transform hover:scale-105"
                  style={{ minHeight: "auto", height: "24px", lineHeight: "1" }}
                  onClick={() => router.push('/dashboard')}
                >
                  Back to Dashboard
                </Button>
              </div>
        </div>

        </CardHeader>
        </Card>

        {/* Reward History Graph inside a Card */}
        <Card className="w-full max-w-lg mb-2 bg-[#000000] text-white rounded-lg p-2">
            <div className="flex items-center justify-center space-x-2">
              <Button variant="outline" size="sm" onClick={toggleDisplayUnit} className="flex items-center space-x-2">
                <Trophy className="w-4 h-4" />
                <span>Reward History - Toggle to {displayUnit === 'sats' ? '$' : 'sats'}</span>
              </Button>
            </div>

            <ResponsiveContainer width="100%" height={150}>
              <LineChart data={graphData}>
                <CartesianGrid strokeDasharray="3 3" />

                {/* X Axis */}
                <XAxis 
                  dataKey="time" 
                  scale="time" 
                  type="number" 
                  domain={['dataMin', 'dataMax']} 
                  tickFormatter={(time) => format(time, 'MMM d, yyyy')} 
                  tick={{ fontSize: 10, fill: '#ffffff' }} // Set font size and color for X axis
                />

                {/* Y Axis for sats or dollars */}
                <YAxis 
                  yAxisId="left" 
                  domain={['auto', 'auto']} 
                  tickFormatter={(value) => 
                    displayUnit === 'sats' ? `${value} sats` : satsPerDollar ? `$${(value / satsPerDollar!).toFixed(2)}` : 'N/A'}
                  tick={{ fontSize: 10, fill: '#ffffff' }} // Set font size and color for Y axis
                />

                {/* Tooltip with custom styles */}
                <Tooltip
                  labelFormatter={(time) => format(time, 'MMM d, yyyy, hh:mm a')}
                  formatter={(value) => {
                    const numericValue = Number(value); // Explicitly cast value to a number
                    return displayUnit === 'sats'
                      ? `${numericValue} sats`
                      : satsPerDollar
                      ? `$${(numericValue / satsPerDollar).toFixed(2)}`
                      : 'N/A';
                  }}
                  contentStyle={{
                    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Transparent black background
                    borderColor: 'rgba(0, 0, 0, 0.6)', // Same color for border to make it invisible
                    borderRadius: '8px', // Rounded corners
                  }}
                  labelStyle={{
                    color: '#ffffff', // White color for the label
                    fontSize: '12px', // Smaller font size
                    fontWeight: 'bold', // Bold text
                  }}
                  itemStyle={{
                    color: '#ffffff', // White color for the value text
                    fontSize: '12px', // Smaller font size
                    fontWeight: 'bold', // Bold text
                  }}
                  cursor={{ stroke: '#F7931A', strokeWidth: 3 }} // Optional: highlight the hovered line with a custom cursor
                />

                {/* Line for cumulative sats */}
                <Line yAxisId="left" type="monotone" dataKey="cumulativeSats" stroke="#F7931A" />
              </LineChart>
            </ResponsiveContainer>
          </Card>
   
          <div className="w-full max-w-lg">
            {filteredCards.map((card, index) => (
              <Card
                key={card.id}
                className={`bg-[#000000] text-white w-full transform transition-transform duration-300 hover:scale-105 hover:shadow-lg ${
                  index !== 0 ? "-mt-px" : ""
                }`}
              >
              <CardHeader 
                 className="grid grid-cols-3 gap-0 items-center cursor-pointer p-2" /* Reduced padding */
                 onClick={() => toggleCardExpansion(card.id)}
               >
                 <div className="flex items-center col-span-2">
                   <div className="mr-2"> {/* Reduced margin */}
                     <img
                       src={card.avatarSrc}
                       alt={card.businessName} // Updated to reflect business name
                       className="w-16 h-16" /* Reduced image size */
                       style={{ objectFit: "contain" }}
                     />
                   </div>
                   <div>
                    <p className="text-lg font-bold leading-tight">{card.businessName}</p> {/* Displaying business name */}
                    <p className="text-xs text-muted-foreground leading-tight">{card.rewardTime}</p>
                   </div>
                 </div>
                 <div className="flex flex-col justify-end items-end col-span-1">
                   <p className="font-bold text-sm">${satsPerDollar !== null ? (card.sats / satsPerDollar).toFixed(2) : "N/A"}</p>
                   <p className="text-xs">{card.sats} sats</p>
                   <Badge
                     variant="default"
                     style={{
                       backgroundColor: card.statusColor,
                       color: "black",
                       borderColor: card.borderColor,
                     }}
                     className="mt-1 rounded-lg border-2"
                   >
                     {card.status}
                  </Badge>
                  
                </div>
              </CardHeader>
              
              {expandedCardId === card.id && (
                <CardContent className="bg-gradient-to-b from-[#F7931A] via-[#000000]/10 to-black p-2">
                <div className="flex items-center space-x-1">
                  <MessageCircleIcon className="w-4 h-4" />
                  <p className="text-sm leading-tight">{card.rewardMessage}</p>
                </div>
               
                  <div className="mt-2 space-y-1 text-xs">
                  <p><strong>Reward Time:</strong> {card.rewardTime}</p>
                  <p><strong>Reward Location:</strong> {card.rewardLocation}</p>
                  <div className="flex space-x-2">
                  <Button 
                      variant="outline"
                      className="w-full space-x-2 bg-black text-white border border-white hover:bg-[#F7931A] hover:border-[#F7931A] hover:text-black transition-colors"
                      onClick={() => handleReOrder(card.shopUrl!)}
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span>Re-order</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full space-x-2 bg-black text-white border border-white hover:bg-[#F7931A] hover:border-[#F7931A] hover:text-black transition-colors"
                      onClick={() => handleShareReward(card)}>
                      <Share2 className="w-4 h-4" />
                      <span>Share product</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
              )}
            </Card>
          ))}
        </div>

        {selectedProduct && (
            <ShareModal
              isOpen={isShareModalOpen}
              onClose={() => setIsShareModalOpen(false)}
              product={selectedProduct}
            />
          )}

          <div className="flex flex-col items-center mt-4 mb-4">
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
      </div>
    </Suspense>
  );
}
