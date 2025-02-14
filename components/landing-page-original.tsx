'use client'

import { useState, useRef } from 'react'
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Bitcoin, ArrowRight, ChevronRight, Gift, BarChart3, Gamepad2, Zap, Layers, AlertCircle, CheckCircle2, Lightbulb, MessageSquare, RefreshCcw, BoxIcon as Bottle, QrCode, Scan, LineChart, Menu, X, LogIn, UserPlus } from 'lucide-react'
import { Star, Trophy, TrendingUp } from 'lucide-react';
import { UserX, BarChart2, Package, Users, PackageCheck } from 'lucide-react';
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import ContactForm from './ContactForm';



// Header Component
const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const router = useRouter()

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <header className="bg-gradient-to-b from-[#000000] via-[#58575c]/10 via-[#58575c]/60 to-[#000000] text-white p-4 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto flex items-center justify-between relative">
        <div className="flex-1 flex justify-center md:justify-start">
            <img src="/images/BeyondTC.png" alt="Company Logo" className="h-8" />
         </div> 

        <button onClick={toggleMenu} className="md:hidden z-20">
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <nav className={`${isMenuOpen ? 'flex' : 'hidden'} md:flex flex-col md:flex-row absolute md:relative top-full left-0 right-0 md:bg-transparent p-4 md:p-0 md:space-x-4 md:top-auto`}>
          
          
        </nav>
      </div>
    </header>
  )
}

export function LandingPageOriginal() {
  const contactFormRef = useRef<HTMLDivElement>(null);

  const scrollToContact = () => {
    contactFormRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      
      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center w-full">
        <div className="min-h-[0vh] w-full flex items-center justify-center px-4 py-12 md:py-16">
          <div className="text-center text-white w-full max-w-4xl mx-auto">
            <div className="w-full max-w-[280px] md:max-w-[400px] mx-auto mb-8">
              <img 
                src="/images/BeyondTC.png" 
                alt="Beyond The Checkout" 
                className="w-full h-auto"
              />
            </div>
            
            <h1 className="text-2xl md:text-4xl font-bold mb-6">
              Your Product
              <span className="text-orange-400">. </span>
              Our Rewards
              <span className="text-orange-400">. </span>
              New Opportunities
              <span className="text-orange-400">.</span>
            </h1>
            <p className="text-lg md:text-2xl text-gray-400 mb-8 max-w-4xl mx-auto">
            Integrating Rewards into Your Products, Services & Marketing
              <span className="text-orange-400">.</span>
            </p>
            
            <div className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-6">
              <Button 
                onClick={scrollToContact}
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 md:px-8 py-4 md:py-6 text-base md:text-lg rounded-full w-full md:w-auto"
              >
                Get Started <ArrowRight className="ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Customer View... */}

    <section className="py-16 bg-gradient-to-b from-neutral-950 to-neutral-900">
      <div className="container mx-auto px-4">
      <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto text-center mb-4">
          As a customer...
        </p>

        <h2 className="text-4xl md:text-5xl font-bold text-orange-400 text-center mb-8">
          Which Product Would You Choose?
        </h2>

        
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Product A */}
          <Card className="bg-black/40 border-orange-400/20 border backdrop-blur-sm overflow-hidden relative">
            <CardContent className="p-0">
              <div className="grid grid-cols-5 h-full">
                {/* Image Section */}
                <div className="col-span-2 bg-gradient-to-br from-orange-500/10 to-black/40 h-full flex items-center justify-center relative">
                  <div className="absolute inset-0 bg-orange-400/5 mix-blend-overlay"></div>
                  <img 
                    src="/images/OrgangeBottle_A.png"
                    alt="Product Option A"
                    className="h-48 w-auto object-contain relative z-10"
                  />
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-orange-400 text-black text-xs font-bold px-2 py-1 rounded">
                    ENOY
                  </div>
                </div>
                
                {/* Content Section */}
                <div className="col-span-3 p-8 relative">

                  <h3 className="text-2xl font-bold mb-6 text-orange-400 pr-32">
                    Your Product
                  </h3>
                 <ul className="space-y-6">
                    <li className="flex items-start gap-3">
                      <Star className="w-5 h-5 text-orange-400 flex-shrink-0 mt-1" />
                      <span className="text-white text-sm">Great Product</span>
                    </li>
                    
                    <li className="flex items-start gap-3 opacity-50">
                      <Gift className="w-5 h-5 text-orange-400 flex-shrink-0 mt-1" />
                      <span className="text-white text-sm">No Rewards</span>
                    </li>
                    
                    <li className="flex items-start gap-3 opacity-50">
                      <Trophy className="w-5 h-5 text-orange-400 flex-shrink-0 mt-1" />
                      <span className="text-white text-sm">No Post-Purchase Engagement</span>
                    </li>
                    
                    <li className="flex items-start gap-3 opacity-50">
                      <TrendingUp className="w-5 h-5 text-orange-400 flex-shrink-0 mt-1" />
                      <span className="text-white text-sm">Missed Opportunities for Loyalty</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Product B */}
          <Card className="bg-black/40 border-orange-400/20 border backdrop-blur-sm overflow-hidden relative">
          <div className="absolute top-4 left-12 bg-orange-400/10 text-orange-400 text-sm font-bold px-3 py-1 rounded-full border border-orange-400/20">
              RECOMMENDED
            </div>
            <CardContent className="p-0">
              <div className="grid grid-cols-5 h-full">
                {/* Image Section */}
                <div className="col-span-2 bg-gradient-to-br from-orange-500/10 to-black/40 h-full flex items-center justify-center relative">
                  <div className="absolute inset-0 bg-orange-400/5 mix-blend-overlay"></div>
                  <img 
                    src="/images/OrgangeBottle_B.png"
                    alt="Product Option B"
                    className="h-48 w-auto object-contain relative z-10"
                  />
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-orange-400 text-black text-xs font-bold px-2 py-1 rounded">
                    ENJOY & EARN
                  </div>
                </div>
                
                {/* Content Section */}
                <div className="col-span-3 p-8 relative">

                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <div className="text-2xl font-bold text-orange-400">Your</div>
                            <div className="text-2xl font-bold text-orange-400">Product</div>
                        </div>
                        <div className="text-5xl font-bold text-white mx-4">+</div>
                        <div className="text-right">
                            <div className="text-2xl font-bold text-white">Built-In</div>
                            <div className="text-2xl font-bold text-white">Rewards</div>
                        </div>
                    </div>
                  <ul className="space-y-6">
                    <li className="flex items-start gap-3">
                      <Star className="w-5 h-5 text-orange-400 flex-shrink-0 mt-1" />
                      <span className="text-white text-sm">Great Product</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Gift className="w-5 h-5 text-orange-400 flex-shrink-0 mt-1" />
                      <span className="text-white text-sm">Built-in Rewards Program</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Trophy className="w-5 h-5 text-orange-400 flex-shrink-0 mt-1" />
                      <span className="text-white text-sm">Post-Purchase Engagement</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <TrendingUp className="w-5 h-5 text-orange-400 flex-shrink-0 mt-1" />
                      <span className="text-white text-sm">Boosts Loyalty & Repeat Purchases</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="text-center mt-16 max-w-4xl mx-auto">
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Why sell just a product when you can sell an{' '}
            <span className="text-orange-400">experience</span>?
          </h3>
          <p className="text-xl text-white/90 mb-4">
            Add built-in rewards today!
          </p>
          <Button 
                onClick={scrollToContact}
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 md:px-8 py-4 md:py-6 text-base md:text-lg rounded-full w-full md:w-auto"
              >
                Get Started <ArrowRight className="ml-2" />
              </Button>
        </div>
      </div>
    </section>

     {/* Business View */}
     <section className="py-16 bg-black from-neutral-950 to-neutral-900">
      <div className="container mx-auto px-4">
        <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto text-center mb-4">
          As a Business Owner...
        </p>

        <h2 className="text-4xl md:text-5xl font-bold text-orange-400 text-center mb-8">
          Would You Rather?
        </h2>

        <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto text-center mb-4">
          sell a product and lose visibility after purchase, or have a direct connection with your customers, gaining valuable insights and engagement?
        </p>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Product A */}
          <Card className="bg-black/40 border-orange-400/20 border backdrop-blur-sm overflow-hidden relative">
            <CardContent className="p-0">
              <div className="grid grid-cols-5 h-full">
                {/* Image Section */}
                <div className="col-span-2 bg-gradient-to-br from-orange-500/10 to-black/40 h-full flex items-center justify-center relative">
                  <div className="absolute inset-0 bg-orange-400/5 mix-blend-overlay"></div>
                  <img 
                    src="/images/BusinessAnalytics_A.png"
                    alt="Business Analytics A"
                    className="h-48 w-auto object-contain relative z-10"
                  />
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-orange-400 text-black text-xs font-bold px-4 py-2 rounded whitespace-nowrap">
                    Product
                  </div>
                </div>
                
                {/* Content Section */}
                <div className="col-span-3 p-8 relative">
                  <h3 className="text-2xl font-bold mb-6 text-orange-400 pr-32">
                    Your Product
                  </h3>
                  <ul className="space-y-6">
                    <li className="flex items-start gap-3">
                      <Star className="w-5 h-5 text-orange-400 flex-shrink-0 mt-1" />
                      <span className="text-white text-sm">Great Product</span>
                    </li>
                    
                    <li className="flex items-start gap-3 opacity-50">
                      <UserX className="w-5 h-5 text-orange-400 flex-shrink-0 mt-1" />
                      <span className="text-white text-sm">No Customer Connection</span>
                    </li>
                    
                    <li className="flex items-start gap-3 opacity-50">
                      <BarChart2 className="w-5 h-5 text-orange-400 flex-shrink-0 mt-1" />
                      <span className="text-white text-sm">No Usage Data</span>
                    </li>
                    
                    <li className="flex items-start gap-3 opacity-50">
                      <Package className="w-5 h-5 text-orange-400 flex-shrink-0 mt-1" />
                      <span className="text-white text-sm">No Inventory Tracking</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Product B */}
          <Card className="bg-black/40 border-orange-400/20 border backdrop-blur-sm overflow-hidden relative">
            <div className="absolute top-4 left-12 bg-orange-400/10 text-orange-400 text-sm font-bold px-3 py-1 rounded-full border border-orange-400/20">
              RECOMMENDED
            </div>
            <CardContent className="p-0">
              <div className="grid grid-cols-5 h-full">
                {/* Image Section */}
                <div className="col-span-2 bg-gradient-to-br from-orange-500/10 to-black/40 h-full flex items-center justify-center relative">
                  <div className="absolute inset-0 bg-orange-400/5 mix-blend-overlay"></div>
                  <img 
                    src="/images/BusinessAnalytics_B.png"
                    alt="Business Analytics B"
                    className="h-48 w-auto object-contain relative z-10"
                  />
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-orange-400 text-black text-xs font-bold px-4 py-2 rounded whitespace-nowrap">
                    Product & Analytics
                  </div>
                </div>
                
                {/* Content Section */}
                <div className="col-span-3 p-8 relative">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <div className="text-2xl font-bold text-orange-400">Your</div>
                      <div className="text-2xl font-bold text-orange-400">Product</div>
                    </div>
                    <div className="text-5xl font-bold text-white mx-4">+</div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-white">Built-In</div>
                      <div className="text-2xl font-bold text-white">Analytics</div>
                    </div>
                  </div>
                  <ul className="space-y-6">
                    <li className="flex items-start gap-3">
                      <Star className="w-5 h-5 text-orange-400 flex-shrink-0 mt-1" />
                      <span className="text-white text-sm">Great Product</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Users className="w-5 h-5 text-orange-400 flex-shrink-0 mt-1" />
                      <span className="text-white text-sm">Post Purchase Engagement</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <LineChart className="w-5 h-5 text-orange-400 flex-shrink-0 mt-1" />
                      <span className="text-white text-sm">Consumption Analytics</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <PackageCheck className="w-5 h-5 text-orange-400 flex-shrink-0 mt-1" />
                      <span className="text-white text-sm">Real-time Inventory Insights</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-16 max-w-4xl mx-auto">
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Why stop at the checkout? Gain{' '}
            <span className="text-orange-400">post-purchase insights and drive customer engagement</span> effortlessly.
          </h3>
          <p className="text-xl text-white/90 mb-4">
            Add built-in analytics today!
          </p>
          <Button 
            onClick={scrollToContact}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 md:px-8 py-4 md:py-6 text-base md:text-lg rounded-full w-full md:w-auto"
          >
            Get Started <ArrowRight className="ml-2" />
          </Button>
        </div>
      </div>
    </section>

      
      {/* Underlying Magic Section */}
      <section className="py-20 bg-neutral-900">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-orange-400 text-center mb-8">
            How does it work?
          </h2>
          <div className="text-center mb-8">
            <p className="text-2xl md:text-3xl text-white max-w-5xl mx-auto">
            What are the steps & features of integrating Rewards & Analytcis<span className="text-orange-400">.</span>
            </p>
          </div>

          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-black border-orange-400/20 border">
              <CardContent className="p-6">
              <div className="w-full h-[180px] flex items-center justify-center mb-4">
                <img 
                  src="/images/Serialize.png" 
                  alt="Serialize" 
                  className="w-auto h-full object-contain"
                />
              </div>
                <h3 className="text-4xl font-bold mb-2 text-orange-400 text-center">1. Serialize</h3>
                <p className="text-gray-400 text-center">
                  Individual products by creating individualized QR Codes
                </p>
              </CardContent>
            </Card>
            <Card className="bg-black border-orange-400/20 border">
              <CardContent className="p-6">
              <div className="w-full h-[180px] flex items-center justify-center mb-4">
                <img 
                  src="/images/Incentivize.png" 
                  alt="Incentivize" 
                  className="w-auto h-full object-contain"
                />
              </div>
              
                <h3 className="text-4xl font-bold mb-2 text-orange-400 text-center">2. Incentivize</h3>
                <p className="text-gray-400 text-center">
                  Customers to scan QR codes by integrating Bitcoin incentives & gamifying the product through a Web based app
                </p>
              </CardContent>
            </Card>
            <Card className="bg-black border-orange-400/20 border">
              <CardContent className="p-6">
              <div className="w-full h-[180px] flex items-center justify-center mb-4">
                <img 
                  src="/images/Analyze.png" 
                  alt="Analyze" 
                  className="w-auto h-full object-contain"
                />
              </div>
            
                <h3 className="text-4xl font-bold mb-2 text-orange-400 text-center">3. Analyze</h3>
                <p className="text-gray-400 text-center">
                  Product Consumption & Consumer Behavior by providing enriched data to the Business Owner
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Product Integration */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-orange-400 text-center mb-8">
            Product Integration
          </h2>
          <div className="text-center mb-16">
            <p className="text-2xl md:text-3xl text-white max-w-4xl mx-auto">
            See how we can integrate Rewards & Analytcis 
            <br />into your Product, Service or Marketing Material<span className="text-orange-400">.</span>
            </p>
          </div>

          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-neutral-900 border-orange-400/20 border">
              <CardContent className="p-6">
              <h3 className="text-4xl font-bold mb-2 text-orange-400 text-center">Sticker</h3>
              <div className="w-full h-[330px] flex items-center justify-center mb-4">
                <img 
                  src="/images/ProductIntegration_1.png" 
                  alt="Product Integration" 
                  className="w-auto h-full object-contain"
                />
              </div>
              <p className="text-2xl text-white text-center">
                  Complexity: Low 
                </p>
                <p className="text-gray-400 text-center">
                Place the QR Code to your Product sticker, 
                  and place it inside your product packaging
                </p>
              </CardContent>
            </Card>
            <Card className="bg-neutral-900 border-orange-400/20 border">
              <CardContent className="p-6">
              <h3 className="text-4xl font-bold mb-2 text-orange-400 text-center">Scratch Off</h3>
              <div className="w-full h-[330px] flex items-center justify-center mb-4">
                <img 
                  src="/images/ProductIntegration_2.png" 
                  alt="Product Integration" 
                  className="w-auto h-full object-contain"
                />
              </div>
              
                
              <p className="text-2xl text-white text-center">
                  Complexity: Mid 
                </p>
                <p className="text-gray-400 text-center">
                Place the Scratch-Off covered QR Code on your Product, 
                  and hand it to your customers
                </p>
              </CardContent>
            </Card>
            <Card className="bg-neutral-900 border-orange-400/20 border">
              <CardContent className="p-6">
              <h3 className="text-4xl font-bold mb-2 text-orange-400 text-center">Shrink Sleave</h3>
              <div className="w-full h-[330px] flex items-center justify-center mb-4">
                <img 
                  src="/images/ProductIntegration_3.png" 
                  alt="Product Integration" 
                  className="w-auto h-full object-contain"
                />
              </div>
              <p className="text-2xl text-white text-center">
                  Complexity: High 
                </p>
                <p className="text-gray-400 text-center">
                  Place the QR Code on your Product, 
                and cover it with a removable shrink sleave
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-neutral-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            Why Choose Beyond The Checkout?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-black border-orange-400/20 border">
              <CardContent className="p-6">
                <Gift className="w-12 h-12 text-orange-400 mb-4" />
                <h3 className="text-2xl font-bold text-orange-400 mb-2">Bitcoin Incentives</h3>
                <p className="text-gray-400">
                  Incentivize customer engagement with Bitcoin, creating a unique value proposition.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-black border-orange-400/20 border">
              <CardContent className="p-6">
                <Gamepad2 className="w-12 h-12 text-orange-400 mb-4" />
                <h3 className="text-2xl font-bold text-orange-400 mb-2">Product Gamification</h3>
                <p className="text-gray-400">
                  Transform routine purchases into engaging experiences that keep customers coming back.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-black border-orange-400/20 border">
              <CardContent className="p-6">
                <BarChart3 className="w-12 h-12 text-orange-400 mb-4" />
                <h3 className="text-2xl font-bold text-orange-400 mb-2">Real-time Consumer Analytics</h3>
                <p className="text-gray-400">
                  Gain valuable data on post-purchase customer behavior and product usage.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <div ref={contactFormRef}>
        <ContactForm />
      </div>
      
      {/* Footer */}
      <footer className="border-t border-neutral-800 py-8">
        <div className="container mx-auto px-4 text-center text-gray-400">
          <p>© 2024 Beyond The Checkout. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}