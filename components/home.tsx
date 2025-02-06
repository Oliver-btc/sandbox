"use client";
import React, { useState } from 'react';
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { JSX, SVGProps } from "react";
import { House, Trophy, ShoppingBag, Users, Menu, X, LogIn, UserPlus, Star } from "lucide-react";

// Header component
const Header: React.FC = () => {
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
      <header className="bg-gradient-to-b from-[#000000] via-[#58575c]/10 via-[#58575c]/60 to-[#000000] text-white p-4 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between relative">
          <div className="flex-1 flex justify-center md:justify-start">
            <Link href="/dashboard" passHref>
              <img src="/images/BeyondTC.png" alt="Company Logo" className="h-8" />
            </Link>
          </div>
  
          {/* Mobile Menu Button */}
          <button onClick={toggleMenu} className="md:hidden z-20">
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
  
          {/* Navigation Items */}
          <nav className={`${isMenuOpen ? 'flex' : 'hidden'} md:flex flex-col md:flex-row absolute md:relative top-full left-0 right-0 md:bg-transparent p-4 md:p-0 md:space-x-4 md:top-auto`}>
            <div className="md:hidden w-full bg-gradient-to-b from-[#7e7c83] to-[#000000] rounded-lg p-4 space-y-4">
              <Button variant="ghost" className="text-white hover:text-black hover:bg-gradient-to-b from-[#7e7c83] to-[#000000] w-full justify-start">
                <LogIn className="w-4 h-4 mr-2" />
                Log in
              </Button>
            </div>
            <div className="hidden md:flex md:space-x-4">
              <Link href="/home" passHref>
                <Button variant="ghost" className="text-white hover:text-black hover:bg-gradient-to-b from-[#7e7c83] to-[#000000]">
                    <LogIn className="w-4 h-4 mr-2" />
                    Log in
                </Button>
              </Link>
            </div>
          </nav>
        </div>
      </header>
    );
  };

  interface TestimonialProps {
    name: string;
    company: string;
    text: string;
  }
  
  const Testimonial: React.FC<TestimonialProps> = ({ name, company, text }) => (
    <Card className="bg-gradient-to-b from-[#97969c]/20 to-[#000000] text-white p-6 rounded-lg shadow-lg m-4 w-full">
      <CardContent>
        <p className="mb-4 italic">&quot;{text}&quot;</p>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold">{name}</p>
            <p className="text-sm text-gray-300">{company}</p>
          </div>
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
  
  const TestimonialSection: React.FC = () => {
    const testimonials: TestimonialProps[] = [
      {
        name: "Sarah Johnson",
        company: "TechGadgets Inc.",
        text: "Integrating Bitcoin rewards into our product line has been a game-changer. Our customer engagement skyrocketed, and we've seen a 30% increase in repeat purchases. Beyond The Checkout's system is seamless and user-friendly!"
      },
      {
        name: "Michael Chen",
        company: "FitLife Supplements",
        text: "As a health supplement company, we were looking for ways to stand out. The Bitcoin rewards program has not only attracted a new demographic of tech-savvy customers but also significantly boosted our customer loyalty. It's been incredible for our business growth."
      },
      {
        name: "Emily Rodriguez",
        company: "Eco Essentials",
        text: "Our customers love the idea of earning Bitcoin while shopping for eco-friendly products. It's added an exciting element to our brand, and we've seen a notable increase in average order value. Beyond The Checkout has truly revolutionized our customer rewards strategy."
      }
    ];
  
    return (
      <section className="w-full max-w-7xl mx-auto -py-2 px-4">
        <h2 className="text-3xl font-bold text-center mb-8 text-white">What Our Partners Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <Testimonial key={index} {...testimonial} />
          ))}
        </div>
      </section>
    );
  };
  
  const Hero: React.FC = () => {
    return (
      <div className="flex flex-col items-center justify-center w-full">
        <div 
          className="h-[90vh] w-full bg-cover bg-center flex items-center justify-center"
          style={{
            backgroundImage: "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.6) 20%, rgba(0,0,0,0.55) 40%, rgba(0,0,0,0.55) 60%, rgba(0,0,0,0.6) 80%, rgba(0,0,0,1) 100%), url('/images/BitcoinRewards.png')",
          }}
        >
          <div className="text-center text-white px-4 max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Unlock Bitcoin Rewards with Every Purchase
            </h1>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Welcome to Beyond The Checkout, where we revolutionize your shopping experience by integrating Bitcoin rewards into everyday products. Join us in gamifying your purchases and earning rewards effortlessly!
            </p>
            <div className="space-x-4">
              <Link href="/history-claim" passHref>
                <Button className="bg-[#000000]/40 text-white hover:bg-gradient-to-b hover:from-[#7e7c83] hover:to-[#000000] transition-all duration-300 px-6 py-3 min-w-[150px]">
                  <LogIn className="w-4 h-4 mr-2" />
                  Log in
                </Button>
              </Link>
              <Link href="/business-dashboard" passHref>
              <Button className="bg-[#000000]/40 text-white hover:bg-gradient-to-b hover:from-[#7e7c83] hover:to-[#000000] transition-all duration-300 px-6 py-3 min-w-[150px]">
                <UserPlus className="w-4 h-4 mr-2" />
                Sign up
              </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export function Home() {
    return (
      <div className="flex flex-col bg-black text-white min-h-screen w-full">    
        <Header />
        <main className="flex-grow flex flex-col">
          <Hero />
          <TestimonialSection />
          <div className="flex-grow"></div>
          <footer className="mt-auto py-4 flex flex-col items-center justify-center">
            <p className="text-[#58575c] text-sm">Powered by</p>
            <img
              src="/images/BeyondTC.png"
              alt="Beyond The Checkout"
              width="100"
              height="50"
              style={{ aspectRatio: "2.34 / 1", objectFit: "cover" }}
            />
          </footer>
        </main>
      </div>
    );
  }