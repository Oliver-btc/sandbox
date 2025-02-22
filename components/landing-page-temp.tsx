'use client'

import { useState, useRef } from 'react'
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Bitcoin, ArrowRight, ChevronRight, Gift, BarChart3, Gamepad2, Zap, Layers, AlertCircle, CheckCircle2, Lightbulb, MessageSquare, RefreshCcw, BoxIcon as Bottle, QrCode, Scan, LineChart, Menu, X, LogIn, UserPlus } from 'lucide-react'
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

export function LandingPage() {
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
            
            <h1 className="text-3xl md:text-6xl font-bold mb-6">
              Incentive Driven Analytics
              <span className="text-orange-400">.</span>
            </h1>
            <p className="text-lg md:text-2xl text-gray-400 mb-8 max-w-3xl mx-auto">
              Adding a digital layer, to physical products
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

      {/* Problem Statement Section */}
      <section className="py-20 bg-neutral-900">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl md:text-5xl font-bold text-orange-400 text-center mb-8">
          The Engagement Gap
        </h2>
        <div className="text-center mb-16">
          <p className="text-2xl md:text-3xl text-white max-w-4xl mx-auto">
            Post purchase, brands lose connection with consumers, missing behavioral insights and opportunities for loyalty & engagement<span className="text-orange-400">.</span>
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-12">
          <Card className="bg-black border-orange-400/20 border">
            <CardContent className="p-6">
              <h3 className="text-4xl font-bold mb-4 flex items-center text-orange-400">
                {/* <AlertCircle className="w-8 h-8 text-orange-400 mr-2" /> */}
                The Disconnect
              </h3>
              <ul className="space-y-6 text-white">
                <li className="flex items-center text-lg">
                  <span className="bg-orange-400 rounded-full p-1.5 mr-3 flex-shrink-0">
                    <Zap className="w-5 h-5" />
                  </span>
                  <span>No visibility & engagement with the customer</span>
                </li>
                <li className="flex items-center text-lg">
                  <span className="bg-orange-400 rounded-full p-1.5 mr-3 flex-shrink-0">
                    <Zap className="w-5 h-5" />
                  </span>
                  <span>No insights if, when or where the product is consumed</span>
                </li>
                <li className="flex items-center text-lg">
                  <span className="bg-orange-400 rounded-full p-1.5 mr-3 flex-shrink-0">
                    <Zap className="w-5 h-5" />
                  </span>
                  <span>Limited customer connection</span>
                </li>
              </ul>
            </CardContent>
          </Card>
          <Card className="bg-black border-orange-400/20 border">
            <CardContent className="p-6">
              <h3 className="text-4xl font-bold mb-4 flex items-center text-orange-400">
                {/* <CheckCircle2 className="w-10 h-10 text-orange-400 mr-2" /> */}
                Bridging the Gap
              </h3>
              <ul className="space-y-6 text-white">
                <li className="flex items-center text-lg">
                  <span className="bg-orange-400 rounded-full p-1.5 mr-3 flex-shrink-0">
                    <Bitcoin className="w-5 h-5" />
                  </span>
                  <span>Bitcoin incentives for post-purchase excitement</span>
                </li>
                <li className="flex items-center text-lg">
                  <span className="bg-orange-400 rounded-full p-1.5 mr-3 flex-shrink-0">
                    <Layers className="w-5 h-5" />
                  </span>
                  <span>Digital layer on physical products for engagement</span>
                </li>
                <li className="flex items-center text-lg">
                  <span className="bg-orange-400 rounded-full p-1.5 mr-3 flex-shrink-0">
                    <BarChart3 className="w-5 h-5" />
                  </span>
                  <span>Post-Purchase Consumer analytics</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>

      {/* What Makes Us Unique Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-orange-400 text-center mb-8">
            What Makes Us Unique
          </h2>

          <div className="text-center mb-16">
            <p className="text-2xl md:text-3xl text-white max-w-4xl mx-auto">
              We are adding a digital layer to physical products,
              <br />
              expanding their features & capabilities<span className="text-orange-400">.</span>
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Digital Integration */}
            <div className="bg-neutral-900 rounded-3xl p-4 border border-orange-400/20">
              <h3 className="text-3xl font-bold text-orange-400 mb-6 text-center">
                Digital Integration
              </h3>
              <div className="flex items-center justify-center gap-6">
              <div className="w-full max-w-[280px] md:max-w-[410px] mx-auto mb-4">
                <img 
                  src="/images/DigitalLayer.png" 
                  alt="DigitalLayer" 
                  className="w-full h-auto"
                />
              </div>
                
              </div>
            </div>

            {/* New Product Features */}
            <div className="bg-neutral-900 rounded-3xl p-4 border border-orange-400/20">
              <h3 className="text-3xl font-bold text-orange-400 mb-6 text-center">
                New Product Features
              </h3>

              <div className="w-full max-w-[280px] md:max-w-[410px] mx-auto mb-4">
                <img 
                  src="/images/NewFeatures.png" 
                  alt="NewFeatures" 
                  className="w-full h-auto"
                />
              </div>
              
            </div>
          </div>
        </div>
      </section>

      {/* Underlying Magic Section */}
      <section className="py-20 bg-neutral-900">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-orange-400 text-center mb-8">
            Underlying Magic
          </h2>
          <div className="text-center mb-16">
            <p className="text-2xl md:text-3xl text-white max-w-4xl mx-auto">
            Integrating the Digital Layer<span className="text-orange-400">.</span>
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
            See how we can integrate the Digital Layer 
            <br />into your Physical Product<span className="text-orange-400">.</span>
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