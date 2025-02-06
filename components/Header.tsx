import React, { useState } from 'react';
import { useRouter } from "next/navigation";
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { House, Trophy, BriefcaseBusiness, Menu, X, Package } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navigateTo = (path: string) => {
    router.push(path);
    setIsMenuOpen(false);
  };

  const menuItemStyle = "text-white hover:text-white hover:bg-gradient-to-b from-[#7e7c83] to-[#000000] w-full justify-start";

  return (
    <header className="bg-gradient-to-b from-[#000000] via-[#58575c]/10 via-[#58575c]/60 to-[#000000] text-white p-4 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto flex items-center justify-between relative">
        <div className="flex-1 flex justify-center md:justify-start">
          <Link href="/home">
            <img src="/images/BeyondTC.png" alt="Company Logo" className="h-8 cursor-pointer" />
          </Link>
        </div>

        <button onClick={toggleMenu} className="md:hidden z-20">
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <nav className={`${isMenuOpen ? 'flex' : 'hidden'} md:flex flex-col md:flex-row absolute md:relative top-full left-0 right-0 md:bg-transparent p-4 md:p-0 md:space-x-4 md:top-auto`}>
          <div className="md:hidden w-full bg-gradient-to-b from-[#7e7c83] to-[#000000] rounded-lg p-4 space-y-4">
            <Button variant="ghost" className={menuItemStyle} onClick={() => navigateTo('/business-dashboard')}>
              <House className="w-4 h-4 mr-2" />
              Home
            </Button>
            <Button variant="ghost" className={menuItemStyle} onClick={() => navigateTo('/qr-code-generator')}>
              <Trophy className="w-4 h-4 mr-2" />
              Create Rewards
            </Button>
            <Button variant="ghost" className={menuItemStyle} onClick={() => navigateTo('/product-management')}>
              <Package className="w-4 h-4 mr-2" />
              My Products
            </Button>
            <Button variant="ghost" className={menuItemStyle} onClick={() => navigateTo('/history-claim')}>
              <BriefcaseBusiness className="w-4 h-4 mr-2" />
              Switch to Personal Account
            </Button>
          </div>
          <div className="hidden md:flex md:space-x-4">
            <Link href="/business-dashboard" passHref>
              <Button variant="ghost" className={menuItemStyle}>
                <House className="w-4 h-4 mr-2" />
                Home
              </Button>
            </Link>
            <Link href="/qr-code-generator" passHref>
              <Button variant="ghost" className={menuItemStyle}>
                <Trophy className="w-4 h-4 mr-2" />
                Create Rewards
              </Button>
            </Link>
            <Link href="/product-management" passHref>
              <Button variant="ghost" className={menuItemStyle}>
                <Package className="w-4 h-4 mr-2" />
                My Products
              </Button>
            </Link>
            <Link href="/history-claim" passHref>
              <Button variant="ghost" className={menuItemStyle}>
                <BriefcaseBusiness className="w-4 h-4 mr-2" />
                Switch to Personal Account
              </Button>
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;