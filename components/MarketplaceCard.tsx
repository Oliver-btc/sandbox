import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { ExternalLink, Tag } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface ProductUnit {
  id: number;
  product: {
    name: string;
    description: string;
    websiteUrl: string;
    image: string | null;
    logo: string | null;
    isLive: boolean;
    promoCode?: string;
    discountPercentage?: number;
    poweredByBeyondCheckout?: boolean;
  };
  qrBatches: Array<{
    id: number;
    date: string;
    quantity: number;
  }>;
}

interface MarketplaceCardProps {
  productUnit: ProductUnit;
}

const MarketplaceCard: React.FC<MarketplaceCardProps> = ({ productUnit }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setIsExpanded(false);
  };

  const handleClick = () => {
    setIsExpanded(!isExpanded);
  };

  const handleVisitWebsite = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(productUnit.product.websiteUrl, '_blank');
  };

  return (
    <Card 
      className={`w-full h-[400px] overflow-hidden cursor-pointer transition-all duration-300 ease-in-out ${isHovered ? 'scale-105' : ''}`}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="relative w-full h-full">
        {/* Product Image */}
        <img 
          src={productUnit.product.image || '/placeholder.svg'} 
          alt={productUnit.product.name || 'Product image'} 
          className="w-full h-full object-cover"
        />

        {/* Logo */}
        <div className="absolute top-4 left-4 w-16 h-16">
          <img 
            src={productUnit.product.logo || '/placeholder.svg'} 
            alt="Company logo" 
            className="w-full h-full object-cover rounded-full border-2 border-white"
          />
        </div>

        {/* Product Name and Beyond The Checkout Logo (Always Visible) */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
          <div className="flex justify-between items-center">
            <h4 className="text-lg font-semibold text-white">{productUnit.product.name || 'Product Name'}</h4>
            {productUnit.product.poweredByBeyondCheckout && (
              <div className="flex items-center">
                <span className="text-xs text-white mr-2">powered by</span>
                <img src="/images/BeyondTC.png" alt="Beyond The Checkout" className="h-6" />
              </div>
            )}
          </div>
        </div>

        {/* Expanded Info */}
        {isExpanded && (
          <div className="absolute inset-0 bg-black bg-opacity-90 p-4 flex flex-col justify-center items-center text-center">
            <div className="flex items-center mb-2">
              <img 
                src={productUnit.product.logo || '/placeholder.svg'} 
                alt="Company logo" 
                className="w-8 h-8 object-cover rounded-full mr-2"
              />
              <h4 className="text-xl font-semibold text-white">{productUnit.product.name || 'Product Name'}</h4>
            </div>
            <p className="text-sm text-gray-300 mb-4">{productUnit.product.description || 'Product description'}</p>
            
            <Button 
              onClick={handleVisitWebsite}
              className="mb-4 bg-[#F7931A] hover:bg-[#F7931A]/80 text-white"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Visit Website
            </Button>
            
            {productUnit.product.promoCode && (
              <div className="bg-white/10 rounded-lg p-3 mb-4">
                <Tag className="h-4 w-4 inline mr-2 text-[#F7931A]" />
                <span className="text-sm text-gray-300">
                  Use Code <span className="font-bold text-white">{productUnit.product.promoCode}</span>
                  {productUnit.product.discountPercentage && (
                    <> and get <span className="font-bold text-white">{productUnit.product.discountPercentage}%</span> off</>
                  )}
                </span>
              </div>
            )}
            {productUnit.product.poweredByBeyondCheckout && (
              <div className="mt-4">
                <div className="flex flex-col items-center justify-center">
                  <span className="text-sm text-gray-300 mb-2">Bitcoin Rewards Powered by</span>
                  <img src="/images/BeyondTC.png" alt="Beyond The Checkout" className="h-8" />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};

export default MarketplaceCard;