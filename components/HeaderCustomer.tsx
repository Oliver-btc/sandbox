import React, { useState } from 'react';
import { useRouter } from "next/navigation";
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { X, Menu, Trophy, ShoppingBag, BriefcaseBusiness, BookOpen } from "lucide-react";

const HeaderCustomer: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navigateTo = (path: string) => {
    router.push(path);
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-gradient-to-b from-[#F7931A] to-[#000000] text-white p-4 sticky top-0 z-50 w-full">
      <div className="max-w-7xl mx-auto flex items-center justify-between relative">
        <div className="flex-1 flex justify-center md:justify-start">
          <img src="/images/BeyondTC.png" alt="Company Logo" className="h-8" />
        </div>

        {/* Mobile Menu Button */}
        <button onClick={toggleMenu} className="md:hidden z-20">
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Navigation Items */}
        <nav className={`${isMenuOpen ? 'flex' : 'hidden'} md:flex flex-col md:flex-row absolute md:relative top-full left-0 right-0 md:bg-transparent p-4 md:p-0 md:space-x-4 md:top-auto`}>
          <div className="md:hidden w-full bg-gradient-to-b from-[#F7931A] to-[#000000] rounded-lg p-4 space-y-4">
            <Button variant="ghost" className="text-white hover:text-black hover:bg-[#F7931A]/80 w-full justify-start" onClick={() => navigateTo('/history-claim')}>
              <Trophy className="w-5 h-5 mr-2" />
              My Rewards
            </Button>
            <Button variant="ghost" className="text-white hover:text-black hover:bg-[#F7931A]/80 w-full justify-start" onClick={() => navigateTo('/bitcoin-education')}>
              <BookOpen className="w-5 h-5 mr-2" />
              Learn & Earn
            </Button>
            <Button variant="ghost" className="text-white hover:text-black hover:bg-[#F7931A]/80 w-full justify-start" onClick={() => navigateTo('/btc-ecosystem')}>
              <ShoppingBag className="w-5 h-5 mr-2" />
              Shop & Earn
            </Button>
            <Button variant="ghost" className="text-white hover:text-black hover:bg-[#F7931A]/80 w-full justify-start" onClick={() => navigateTo('/business-dashboard')}>
              <BriefcaseBusiness className="w-5 h-5 mr-2" />
                Switch to Business Account
            </Button>  
          </div>
          <div className="hidden md:flex md:space-x-4">
            <Link href="/history-claim" passHref>
              <Button variant="ghost" className="text-white hover:text-white hover:bg-gradient-to-b from-[#F7931A] to-[#000000]">
                <Trophy className="w-5 h-5 mr-2" />
                My Rewards
              </Button>
            </Link>
            <Link href="/bitcoin-education" passHref>
              <Button variant="ghost" className="text-white hover:text-white hover:bg-gradient-to-b from-[#F7931A] to-[#000000]">
                <BookOpen className="w-5 h-5 mr-2" />
                Learn & Earn
              </Button>
            </Link>
            <Link href="/btc-ecosystem" passHref>
              <Button variant="ghost" className="text-white hover:text-white hover:bg-gradient-to-b from-[#F7931A] to-[#000000]">
                <ShoppingBag className="w-5 h-5 mr-2" />
                Shop & Earn
              </Button>
            </Link>
            <Link href="/business-dashboard" passHref>
              <Button variant="ghost" className="text-white hover:text-white hover:bg-gradient-to-b from-[#F7931A] to-[#000000]">
                <BriefcaseBusiness className="w-5 h-5 mr-2" />
                Switch to Business Account
              </Button>
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default HeaderCustomer;