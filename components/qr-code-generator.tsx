"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { BitcoinSlider } from './BitcoinSlider';
import { Info, House, Trophy, BriefcaseBusiness, Menu, X, Plus, Minus, Download, CreditCard, Bitcoin, FileText } from 'lucide-react';
import { Package, DollarSign, Tag, QrCode, Award, ChevronRight } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import Header from './Header'; // Make sure the path is correct
import TrustLoyaltyRating from './TrustLoyaltyRating';
import ExcitementRating from './ExcitementRating';
import StarRating from './StarRating';

interface Reward {
  amount: number;
  count: number;
  color: string;
  maxSliderValue: number;
}

interface FormData {
  productName: string;
  productRetailPrice: string;
  qrCodeCount: number;
  baseRewards: Reward[];
  midRewards: Reward[];
  topRewards: Reward[];
  paymentMethod: 'creditCard' | 'bitcoin';
  selectedProduct: string;
}

interface RewardInputProps {
  value: number;
  onChange: (newValue: number) => void;
  formatCurrency: (amount: number) => string;
  showBitcoin: boolean;
  satsPerDollar: number;
}

type CalculationResult = {
  totalCost: number;
  averagePrice: number;
  totalQRCodes: number;
  originalRetailPrice: number;
  newRetailPrice: number;
  newRetailPriceWithMargin: number;
};

const MAX_QR_CODES = 100000;
const SATS_PER_BTC = 100000000;

export function QRCodeGeneratorPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    productName: '',
    productRetailPrice: '',
    qrCodeCount: 100,
    baseRewards: [],
    midRewards: [],
    topRewards: [],
    paymentMethod: 'creditCard',
    selectedProduct: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [activePopup, setActivePopup] = useState<string | null>(null);
  const [showBitcoin, setShowBitcoin] = useState(false);
  const [bitcoinPrice, setBitcoinPrice] = useState(0);
  const [satsPerDollar, setSatsPerDollar] = useState(0);
  const [isNewProduct, setIsNewProduct] = useState(false);

  // Mock product list - replace with your actual product data
  const productList = [
    { name: "Product A", price: "19.99" },
    { name: "Product B", price: "29.99" },
    { name: "Product C", price: "39.99" },
    { name: "New Product", price: "" },
  ];

  useEffect(() => {
    async function fetchBitcoinPrice() {
      try {
        const response = await fetch(
          "https://api.coindesk.com/v1/bpi/currentprice/BTC.json"
        );
        const data = await response.json();
        const price = parseFloat(data.bpi.USD.rate.replace(',', ''));
        setBitcoinPrice(price);
        setSatsPerDollar(Math.round(SATS_PER_BTC / price));
      } catch (error) {
        console.error("Error fetching Bitcoin price:", error);
      }
    }

    fetchBitcoinPrice();
    const intervalId = setInterval(fetchBitcoinPrice, 1 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, []);

  const handleProductSelect = (value: string) => {
    if (value === "New Product") {
      setIsNewProduct(true);
      setFormData(prev => ({ ...prev, selectedProduct: value, productName: '', productRetailPrice: '' }));
    } else {
      setIsNewProduct(false);
      const selectedProduct = productList.find(p => p.name === value);
      if (selectedProduct) {
        setFormData(prev => ({
          ...prev,
          selectedProduct: value,
          productName: selectedProduct.name,
          productRetailPrice: selectedProduct.price
        }));
      }
    }
  };

  const calculateRewardDistribution = (data: FormData): FormData => {
    const retailPrice = parseFloat(data.productRetailPrice);
    const totalQRCodes = data.qrCodeCount;
    
    let baseRewards: Reward[] = [];
    let midRewards: Reward[] = [];
    let topRewards: Reward[] = [];
    
    const calculateBaseDistribution = (baseCount: number) => {
      const unit = Math.floor(baseCount / 6);
      return [
        { amount: retailPrice * 0.01, count: unit * 3, color: '#3B82F6', maxSliderValue: baseCount },
        { amount: retailPrice * 0.05, count: unit * 2, color: '#10B981', maxSliderValue: baseCount },
        { amount: retailPrice * 0.10, count: unit, color: '#FBBF24', maxSliderValue: baseCount },
      ];
    };

    if (totalQRCodes <= 300) {
      const baseCount = Math.floor(totalQRCodes * 0.95);
      const midCount = totalQRCodes - baseCount - 1;
      baseRewards = calculateBaseDistribution(baseCount);
      midRewards = [
        { amount: retailPrice * 0.50, count: Math.floor(midCount * 2/3), color: '#F97316', maxSliderValue: midCount },
        { amount: retailPrice, count: Math.ceil(midCount * 1/3), color: '#EF4444', maxSliderValue: midCount },
      ];
      topRewards = [
        { amount: retailPrice * 3, count: 1, color: '#8B5CF6', maxSliderValue: 5 },
      ];
    } else if (totalQRCodes <= 1000) {
      const baseCount = Math.floor(totalQRCodes * 0.96);
      const midCount = totalQRCodes - baseCount - 3;
      baseRewards = calculateBaseDistribution(baseCount);
      midRewards = [
        { amount: retailPrice * 0.50, count: Math.floor(midCount * 2/3), color: '#F97316', maxSliderValue: midCount },
        { amount: retailPrice, count: Math.ceil(midCount * 1/3), color: '#EF4444', maxSliderValue: midCount },
      ];
      topRewards = [
        { amount: retailPrice * 5, count: 2, color: '#8B5CF6', maxSliderValue: 5 },
        { amount: retailPrice * 20, count: 1, color: '#EC4899', maxSliderValue: 5 },
      ];
    } else if (totalQRCodes <= 10000) {
      const baseCount = Math.floor(totalQRCodes * 0.97);
      const midCount = totalQRCodes - baseCount - 6;
      baseRewards = calculateBaseDistribution(baseCount);
      midRewards = [
        { amount: retailPrice * 0.50, count: Math.floor(midCount * 2/3), color: '#F97316', maxSliderValue: midCount },
        { amount: retailPrice, count: Math.ceil(midCount * 1/3), color: '#EF4444', maxSliderValue: midCount },
      ];
      topRewards = [
        { amount: retailPrice * 5, count: 3, color: '#8B5CF6', maxSliderValue: 5 },
        { amount: retailPrice * 20, count: 2, color: '#EC4899', maxSliderValue: 5 },
        { amount: retailPrice * 50, count: 1, color: '#14B8A6', maxSliderValue: 5 },
      ];
    } else {
      const baseCount = Math.floor(totalQRCodes * 0.98);
      const midCount = totalQRCodes - baseCount - 6;
      baseRewards = calculateBaseDistribution(baseCount);
      midRewards = [
        { amount: retailPrice * 0.50, count: Math.floor(midCount * 3/6), color: '#F97316', maxSliderValue: midCount },
        { amount: retailPrice, count: Math.floor(midCount * 2/6), color: '#EF4444', maxSliderValue: midCount },
        { amount: retailPrice * 2, count: Math.ceil(midCount * 1/6), color: '#06B6D4', maxSliderValue: midCount },
      ];
      topRewards = [
        { amount: retailPrice * 10, count: 3, color: '#8B5CF6', maxSliderValue: 5 },
        { amount: retailPrice * 30, count: 2, color: '#EC4899', maxSliderValue: 5 },
        { amount: retailPrice * 100, count: 1, color: '#14B8A6', maxSliderValue: 5 },
      ];
    }
    
    const totalAssigned = baseRewards.reduce((sum, reward) => sum + reward.count, 0) +
                          midRewards.reduce((sum, reward) => sum + reward.count, 0) +
                          topRewards.reduce((sum, reward) => sum + reward.count, 0);
    const remaining = totalQRCodes - totalAssigned;
    if (remaining > 0) {
      baseRewards[0].count += remaining;
    }

    return {
      ...data,
      baseRewards,
      midRewards,
      topRewards,
    };
  };

  // Calculation functions for the scores
  const calculateTrustAndLoyaltyScore = (baseRewards: Reward[], totalQRCodes: number) => {
    const totalBaseRewardValue = baseRewards.reduce((sum, reward) => sum + (reward.amount * reward.count), 0);
    const baseRewardFrequency = baseRewards.reduce((sum, reward) => sum + reward.count, 0);
    return (baseRewardFrequency * totalBaseRewardValue) / totalQRCodes;
  };

  const calculateExcitementScore = (midRewards: Reward[], totalQRCodes: number) => {
    const totalMidRewardValue = midRewards.reduce((sum, reward) => sum + (reward.amount * reward.count), 0);
    return (totalMidRewardValue) / totalQRCodes;
  };

  const calculateHypeScore = (topRewards: Reward[], productPrice: number, totalQRCodes: number) => {
    const maxReward = Math.max(...topRewards.map(reward => reward.amount));
    const rewardToProductRatio = maxReward / productPrice;
    const scarcityFactor = Math.min(1, topRewards.reduce((sum, reward) => sum + reward.count, 0) / totalQRCodes);
  
    let baseScore;
    if (rewardToProductRatio <= 5) {
      baseScore = 20 * (rewardToProductRatio / 5); // 0-20
    } else if (rewardToProductRatio <= 20) {
      baseScore = 20 + 30 * ((rewardToProductRatio - 5) / 15); // 20-50
    } else if (rewardToProductRatio <= 50) {
      baseScore = 50 + 30 * ((rewardToProductRatio - 20) / 30); // 50-80
    } else if (rewardToProductRatio <= 300) {
      baseScore = 80 + 15 * ((rewardToProductRatio - 50) / 250); // 80-95
    } else {
      baseScore = 95 + 5 * (Math.min(rewardToProductRatio, 1000) - 300) / 700; // 95-100
    }
  
    // Apply scarcity factor
    const finalScore = baseScore * (1 - scarcityFactor) + (baseScore * 0.5 * scarcityFactor);
  
    return Math.min(100, finalScore);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'qrCodeCount' ? parseInt(value) || 0 : value 
    }));
    validateField(name, value);
  };

  const validateField = (name: string, value: string) => {
    let error = '';
    if (name === 'productName' && !value.trim()) {
      error = 'Product name is required';
    } else if (name === 'productRetailPrice' && (isNaN(parseFloat(value)) || parseFloat(value) <= 0)) {
      error = 'Please enter a valid price';
    } else if (name === 'qrCodeCount') {
      const count = parseInt(value);
      if (isNaN(count) || count <= 0) {
        error = 'Please enter a valid number of QR codes';
      } else if (count > MAX_QR_CODES) {
        error = `Maximum ${MAX_QR_CODES} QR codes allowed`;
      }
    }
    setErrors(prev => ({ ...prev, [name]: error }));
    return error;
  };

  const handleNext = () => {
    if (step === 1) {
      const newErrors = {
        productName: validateField('productName', formData.productName),
        productRetailPrice: validateField('productRetailPrice', formData.productRetailPrice),
        qrCodeCount: validateField('qrCodeCount', formData.qrCodeCount.toString()),
      };
      if (Object.values(newErrors).some(error => error)) {
        return;
      }
      const updatedFormData = calculateRewardDistribution(formData);
      setFormData(updatedFormData);
    }
    if (step < 4) {
      setStep(prev => prev + 1);
    } else {
      console.log("Form submitted:", formData);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(prev => prev - 1);
  };

  const handleRewardCountChange = (type: 'baseRewards' | 'midRewards' | 'topRewards', index: number, value: number) => {
    setFormData(prev => {
      const newFormData = { ...prev };
      const oldCount = prev[type][index].count;
      const diff = value - oldCount;
      
      newFormData[type] = [...prev[type]];
      newFormData[type][index].count = value;
  
      const totalRewards = newFormData[type].reduce((sum, reward) => sum + reward.count, 0);
      const otherRewards = newFormData[type].filter((_, i) => i !== index);
      const remainingCount = totalRewards - value;
      
      otherRewards.forEach((reward, i) => {
        if (i === otherRewards.length - 1) {
          reward.count = Math.max(0, remainingCount - otherRewards.slice(0, -1).reduce((sum, r) => sum + r.count, 0));
        } else {
          reward.count = Math.max(0, Math.round(remainingCount * (reward.count / (totalRewards - oldCount))));
        }
      });
  
      newFormData[type] = [
        ...newFormData[type].slice(0, index),
        newFormData[type][index],
        ...otherRewards.slice(index)
      ];
  
      const totalQRCodes = newFormData.qrCodeCount;
      const baseTotal = newFormData.baseRewards.reduce((sum, reward) => sum + reward.count, 0);
      const midTotal = newFormData.midRewards.reduce((sum, reward) => sum + reward.count, 0);
      const topTotal = newFormData.topRewards.reduce((sum, reward) => sum + reward.count, 0);
  
      if (baseTotal + midTotal + topTotal !== totalQRCodes) {
        const difference = totalQRCodes - (baseTotal + midTotal + topTotal);
        
        if (type === 'midRewards' || type === 'topRewards') {
          if (newFormData.baseRewards.length > 0) {
            newFormData.baseRewards[0].count += difference;
          }
        } else if (type === 'baseRewards') {
          const lastBaseRewardIndex = newFormData.baseRewards.length - 1;
          if (index !== lastBaseRewardIndex) {
            newFormData.baseRewards[lastBaseRewardIndex].count += difference;
          } else if (newFormData.baseRewards.length > 1) {
            newFormData.baseRewards[lastBaseRewardIndex - 1].count += difference;
          }
        }
      }
  
      newFormData[type].forEach(reward => {
        reward.count = Math.max(0, reward.count);
      });
  
      return newFormData;
    });
  };

  const handleRewardAmountChange = (type: 'baseRewards' | 'midRewards' | 'topRewards', index: number, newAmount: number) => {
    setFormData(prev => {
      const newFormData = { ...prev };
      newFormData[type] = [...prev[type]];
      newFormData[type][index].amount = Math.max(0, newAmount);
      return newFormData;
    });
  };

  const togglePopup = (popupId: string) => {
    setActivePopup(activePopup === popupId ? null : popupId);
  };

  const RewardInput: React.FC<RewardInputProps> = ({ value, onChange, formatCurrency, showBitcoin, satsPerDollar }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [inputValue, setInputValue] = useState(value.toString());
  
    useEffect(() => {
      if (showBitcoin) {
        setInputValue(Math.round(value * satsPerDollar).toString());
      } else {
        setInputValue(value.toFixed(2));
      }
    }, [value, showBitcoin, satsPerDollar]);
  
    const handleClick = () => {
      setIsEditing(true);
    };
  
    const handleBlur = () => {
      setIsEditing(false);
      let newValue: number;
      if (showBitcoin) {
        newValue = parseInt(inputValue) / satsPerDollar;
      } else {
        newValue = parseFloat(parseFloat(inputValue).toFixed(2));
      }
      onChange(newValue || value);
    };
  
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(e.target.value);
    };
  
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        e.preventDefault();
        const increment = e.key === 'ArrowUp' ? 1 : -1;
        let newValue: number;
        
        if (showBitcoin) {
          newValue = Math.max(0, parseInt(inputValue) + increment);
          setInputValue(newValue.toString());
          onChange(newValue / satsPerDollar);
        } else {
          newValue = Math.max(0, parseFloat((parseFloat(inputValue) + increment * 0.01).toFixed(2)));
          setInputValue(newValue.toFixed(2));
          onChange(newValue);
        }
      }
    };
  
    return (
      <div
        style={{
          cursor: 'pointer',
          transition: 'all 0.2s ease-in-out',
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        {isEditing ? (
          <input
            type="number"
            value={inputValue}
            onChange={handleChange}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            autoFocus
            step={showBitcoin ? "1" : "0.01"}
            style={{
              width: '80px',
              padding: '2px 4px',
              fontSize: '0.875rem',
              border: '1px solid #D1D5DB',
              borderRadius: '4px',
            }}
          />
        ) : (
          <span onClick={handleClick}>{formatCurrency(value)}</span>
        )}
      </div>
    );
  };

  const renderRewardSection = (title: string, rewards: Reward[], type: 'baseRewards' | 'midRewards' | 'topRewards', description: string) => {
    let score = 0;
    if (type === 'baseRewards') {
      score = calculateTrustAndLoyaltyScore(rewards, formData.qrCodeCount);
    } else if (type === 'midRewards') {
      score = calculateExcitementScore(rewards, formData.qrCodeCount);
    } else if (type === 'topRewards') {
      score = calculateHypeScore(rewards, parseFloat(formData.productRetailPrice), formData.qrCodeCount);
    }
  
    return (
      <div style={{ backgroundColor: '#FFFFFF', color: '#000000', padding: '1rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600 }}>{title}</h3>
            <div style={{ position: 'relative' }}>
              <Info
                size={20}
                style={{ color: '#6B7280', cursor: 'pointer' }}
                onClick={() => togglePopup(type)}
              />
              {activePopup === type && (
                <div style={{ 
                  position: 'absolute',
                  left: '100%',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '16rem',
                  padding: '0.5rem',
                  marginLeft: '0.5rem',
                  fontSize: '0.875rem',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '0.375rem',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                  color: '#374151',
                  zIndex: 10
                }}>
                  {description}
                </div>
              )}
            </div>
          </div>
          {type === 'baseRewards' && (
            <TrustLoyaltyRating
            baseRewards={formData.baseRewards}
            productPrice={parseFloat(formData.productRetailPrice)}
            totalQRCodes={formData.qrCodeCount}
            maxScore={100}
            starCount={5}
          />
          )}
          {type === 'midRewards' && (
            <ExcitementRating
            midRewards={formData.midRewards}
            productPrice={parseFloat(formData.productRetailPrice)}
            totalQRCodes={formData.qrCodeCount}
            maxScore={100}
            starCount={5}
          />
          )}
          {type === 'topRewards' && (
            <StarRating score={score} maxScore={100} starCount={5} />
          )}
        </div>
        {rewards.map((reward, index) => (
          <div key={index} style={{ marginTop: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '1rem', height: '1rem', backgroundColor: reward.color, borderRadius: '9999px' }}></div>
              <div style={{ flexGrow: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.875rem', color: '#374151' }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <RewardInput
                      value={reward.amount}
                      onChange={(newValue: number) => handleRewardAmountChange(type, index, newValue)}
                      formatCurrency={formatCurrency}
                      showBitcoin={showBitcoin}
                      satsPerDollar={satsPerDollar}
                    />
                  </div>
                  <span>{reward.count} QR codes</span>
                </div>
              </div>
            </div>
            <BitcoinSlider
              value={[reward.count]}
              min={0}
              max={reward.maxSliderValue}
              step={1}
              onValueChange={(value) => handleRewardCountChange(type, index, value[0])}
              showBitcoin={showBitcoin}
              className="w-full"
            />
          </div>
        ))}
      </div>
    );
  };

  const calculateTotalAndAverage = (): CalculationResult => {
    const allRewards = [...formData.baseRewards, ...formData.midRewards, ...formData.topRewards];
    const totalCost = allRewards.reduce((sum, reward) => sum + reward.amount * reward.count, 0);
    const averagePrice = totalCost / formData.qrCodeCount;
    const originalRetailPrice = parseFloat(formData.productRetailPrice);
    const newRetailPrice = originalRetailPrice + averagePrice;
    const newRetailPriceWithMargin = originalRetailPrice + averagePrice * 1.1; // Add 10% margin
    return { 
      totalCost, 
      averagePrice, 
      totalQRCodes: formData.qrCodeCount, 
      originalRetailPrice, 
      newRetailPrice,
      newRetailPriceWithMargin
    };
  };

  const convertToSats = (usdAmount: number) => {
    return Math.round(usdAmount * satsPerDollar);
  };

  const formatCurrency = (amount: number) => {
    if (showBitcoin) {
      const sats = convertToSats(amount);
      return `${sats.toLocaleString('en-US')} sats`;
    } else {
      return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
  };

  const handleDownload = () => {
    console.log("Downloading QR Codes...");
  };

  const CurrencyToggle = () => (
    <div className="flex items-center space-x-2 bg-gray-100 p-1 rounded-full">
      <div className={`flex items-center justify-center w-8 h-8 rounded-full transition-colors duration-200 ${!showBitcoin ? 'bg-white shadow' : 'bg-transparent'}`}>
        <div className="bg-green-500 rounded-full w-6 h-6 flex items-center justify-center">
          <DollarSign size={14} color="white" />
        </div>
      </div>
      <Switch
          checked={showBitcoin}
          onCheckedChange={setShowBitcoin}
          className="data-[state=checked]:bg-bitcoin data-[state=unchecked]:bg-dollar"
        />
      <div className={`flex items-center justify-center w-8 h-8 rounded-full transition-colors duration-200 ${showBitcoin ? 'bg-white shadow' : 'bg-transparent'}`}>
        <div className="bg-[#F7931A] rounded-full w-6 h-6 flex items-center justify-center">
          <Bitcoin size={14} color="white" />
        </div>
      </div>
    </div>
  );

  const steps = [
    { name: "Product", icon: FileText },
    { name: "Rewards", icon: Bitcoin },
    { name: "Payment", icon: CreditCard },
    { name: "Download", icon: Download }
  ];

  const renderSummary = () => {
    const calculateTotalAndAverage = () => {
      const allRewards = [...formData.baseRewards, ...formData.midRewards, ...formData.topRewards];
      const totalCost = allRewards.reduce((sum, reward) => sum + reward.amount * reward.count, 0);
      const averagePrice = totalCost / formData.qrCodeCount;
      const originalRetailPrice = parseFloat(formData.productRetailPrice);
      const newRetailPrice = originalRetailPrice + averagePrice;
      const newRetailPriceWithMargin = newRetailPrice * 1.1; // Add 10% margin
      return { 
        totalCost, 
        averagePrice, 
        totalQRCodes: formData.qrCodeCount, 
        originalRetailPrice, 
        newRetailPrice,
        newRetailPriceWithMargin
      };
    };
  
    const { totalCost, averagePrice, totalQRCodes, newRetailPrice } = calculateTotalAndAverage();

    const renderRewardTierDetails = (tierName: string, rewards: Reward[], icon: React.ReactNode) => (
      <div className="bg-white rounded-lg p-4 shadow-md">
        <div className="flex items-center mb-2">
          {icon}
          <h4 className="font-semibold ml-2">{tierName}</h4>
        </div>
        {rewards.map((reward: Reward, index: number) => (
          <div key={index} className="flex justify-between items-center py-1 text-sm">
            <span>{reward.count.toLocaleString()} QR codes</span>
            <span className="font-medium">{formatCurrency(reward.amount)}</span>
          </div>
        ))}
      </div>
    );
  
    return (
      <div className="bg-gray-100 p-6 rounded-lg mb-6">
        <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-md flex items-center">
            <Package className="text-blue-500 mr-3" size={24} />
            <div>
              <p className="text-sm text-gray-500">Product</p>
              <p className="font-medium">{formData.productName}</p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md flex items-center">
            <Tag className="text-blue-500 mr-3" size={24} />
            <div>
              <p className="text-sm text-gray-500">NEW Retail Price</p>
              <p className="font-medium">{formatCurrency(newRetailPrice)}</p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md flex items-center">
            <QrCode className="text-blue-500 mr-3" size={24} />
            <div>
              <p className="text-sm text-gray-500">Total QR Codes</p>
              <p className="font-medium">{totalQRCodes.toLocaleString()}</p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md flex items-center">
            {showBitcoin ? (
              <Bitcoin className="text-[#F7931A] mr-3" size={24} />
            ) : (
              <DollarSign className="text-green-500 mr-3" size={24} />
            )}
            <div>
              <p className="text-sm text-gray-500">Avg. QR Code Price</p>
              <p className="font-medium">{formatCurrency(averagePrice)}</p>
            </div>
          </div>
        </div>
        
        <div className="space-y-4 mb-6">
          <h4 className="font-semibold text-lg mb-2">Reward Tier Details:</h4>
          {renderRewardTierDetails("Base Rewards", formData.baseRewards, <Award size={20} className="text-blue-500" />)}
          {renderRewardTierDetails("Mid Rewards", formData.midRewards, <Award size={20} className="text-green-500" />)}
          {renderRewardTierDetails("Top Rewards", formData.topRewards, <Award size={20} className="text-yellow-500" />)}
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center">
          <span className="text-lg font-semibold flex items-center">   
            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${showBitcoin ? 'bg-[#F7931A]' : 'bg-green-500'} mr-1`}>
              {showBitcoin ? (
                <Bitcoin size={14} color="white" />
              ) : (
                <DollarSign size={14} color="white" />
              )}
            </div>
            <span className="ml-1">Total:</span>
          </span>
          <span className={`text-xl font-bold ${showBitcoin ? 'text-[#F7931A]' : 'text-green-600'}`}>
            {formatCurrency(totalCost)}
          </span>
        </div>
      </div>
    );
  };

  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [generationTime, setGenerationTime] = useState(3000); // 3 seconds by default

  const simulateQRCodeGeneration = () => {
    setIsGenerating(true);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(interval);
          setIsGenerating(false);
          return 100;
        }
        return prevProgress + 5;
      });
    }, generationTime / 20);
  };

  useEffect(() => {
    if (step === 4) {
      simulateQRCodeGeneration();
    }
  }, [step]);

  const renderDownloadStep = () => {
    if (isGenerating) {
      return (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-center">Generating QR Codes</h2>
          <p className="text-center text-gray-600">Please wait while we generate your QR codes...</p>
          <Progress value={progress} className="w-full" />
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-center">Your QR Codes are Ready!</h2>
        <p className="text-center text-gray-600">Click the button below to download your QR codes.</p>
        <div className="flex justify-center mt-8">
          <Button 
            onClick={handleDownload}
            className="bg-[#F7931A] text-white px-6 py-3 rounded-lg text-lg flex items-center space-x-2 hover:bg-[#E87D0D] transition-colors"
          >
            <Download size={24} />
            <span>Download QR Codes</span>
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-[#000000] via-[#000000] to-[#7e7c83]">
      <Header />
      <div className="flex-grow flex justify-center items-start pt-8 px-4">
        <Card className="w-full max-w-[750px] overflow-hidden">
          <CardHeader style={{ backgroundColor: '#F3F4F6' }}>
            <CardTitle style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#000000' }}>Generate QR Codes with Bitcoin Rewards</CardTitle>
            <CardDescription style={{ color: '#4B5563' }}>Create QR codes for your products in 4 easy steps</CardDescription>
            
            {/* Step indicator */}
            <div className="mt-6">
              <div className="flex justify-between items-center">
                {steps.map((s, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      step > index + 1 ? 'bg-[#F7931A]' : 
                      step === index + 1 ? 'bg-[#F7931A]' : 'bg-gray-300'
                    }`}>
                      <s.icon size={24} color={step >= index + 1 ? 'white' : 'gray'} />
                    </div>
                    <p className={`mt-2 text-xs font-medium ${
                      step >= index + 1 ? 'text-[#F7931A]' : 'text-gray-500'
                    }`}>
                      {s.name}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-4 h-2 flex">
                {[1, 2, 3].map((_, index) => (
                  <div 
                    key={index} 
                    className={`flex-1 ${index === 0 ? 'rounded-l-full' : ''} ${index === 2 ? 'rounded-r-full' : ''} ${
                      step > index + 1 ? 'bg-[#F7931A]' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          </CardHeader>

          <CardContent className="bg-[#FFFFFF] text-[#000000] p-4 sm:p-6">
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="productSelect" style={{ color: '#374151' }}>Select Product</Label>
                <Select onValueChange={handleProductSelect} value={formData.selectedProduct}>
                  <SelectTrigger className="w-full bg-white text-black border border-gray-300">
                    <SelectValue placeholder="Select a product" />
                  </SelectTrigger>
                  <SelectContent className="bg-white text-black">
                    {productList.map((product, index) => (
                      <SelectItem key={index} value={product.name} className="text-black hover:bg-gray-100">
                        {product.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

                {isNewProduct && (
                  <>
                    <div>
                      <Label htmlFor="productName" style={{ color: '#374151' }}>New Product Name</Label>
                  <Input
                    id="productName"
                    name="productName"
                        placeholder="Enter new product name"
                    value={formData.productName}
                    onChange={handleInputChange}
                    required
                    style={{ backgroundColor: '#FFFFFF', color: '#000000', border: '1px solid #D1D5DB' }}
                  />
                  {errors.productName && <p style={{ color: '#EF4444', fontSize: '0.875rem' }}>{errors.productName}</p>}
                </div>
                  </>
                )}

                <div>
                  <Label htmlFor="productRetailPrice" style={{ color: '#374151' }}>Product Retail Price ($)</Label>
                  <Input
                    id="productRetailPrice"
                    name="productRetailPrice"
                    type="number"
                    placeholder="Enter product retail price"
                    value={formData.productRetailPrice}
                    onChange={handleInputChange}
                    required
                    style={{ backgroundColor: '#FFFFFF', color: '#000000', border: '1px solid #D1D5DB' }}
                  />
                  {errors.productRetailPrice && <p style={{ color: '#EF4444', fontSize: '0.875rem' }}>{errors.productRetailPrice}</p>}
                </div>
                <div>
                  <Label htmlFor="qrCodeCount" style={{ color: '#374151' }}>Number of QR Codes</Label>
                  <Input
                    id="qrCodeCount"
                    name="qrCodeCount"
                    type="number"
                    placeholder="Enter number of QR codes"
                    value={formData.qrCodeCount}
                    onChange={handleInputChange}
                    required
                    style={{ backgroundColor: '#FFFFFF', color: '#000000', border: '1px solid #D1D5DB' }}
                  />
                  {errors.qrCodeCount && <p style={{ color: '#EF4444', fontSize: '0.875rem' }}>{errors.qrCodeCount}</p>}
                </div>
              </div>
            )}
            {step === 2 && (
              <div className="flex flex-col gap-4">
                <div className="flex flex-col items-center gap-2">
                  <h2 className="text-2xl font-semibold text-center">Reward Distribution</h2>
                  <CurrencyToggle />
                </div>                  
                <div className="h-4 w-full bg-gray-200 rounded-full overflow-hidden">
                  {[...formData.baseRewards, ...formData.midRewards, ...formData.topRewards].map((reward, index) => (
                    <div 
                      key={index} 
                      style={{
                        width: `${(reward.count / formData.qrCodeCount) * 100}%`,
                        height: '100%',
                        backgroundColor: reward.color,
                        float: 'left'
                    }}                         
                    ></div>
                  ))}
                  </div>
                  
                {renderRewardSection("Base Rewards", formData.baseRewards, 'baseRewards', "These rewards ensure frequent wins, motivating repeat purchases.")}
                {renderRewardSection("Mid Rewards", formData.midRewards, 'midRewards', "These rewards are rare enough to be exciting, incentivizing more purchases.")}
                {renderRewardSection("Top Rewards", formData.topRewards, 'topRewards', "The highest tier of rewards, creating significant buzz and anticipation.")}

                <div style={{ 
                  marginTop: '1.5rem', 
                  padding: '1rem', 
                  backgroundColor: '#F3F4F6', 
                  borderRadius: '0.5rem',
                  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
                }}>
                  <h3 style={{ 
                    fontSize: '1.125rem', 
                    fontWeight: 600, 
                    marginBottom: '0.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                   <div className={`w-6 h-6 rounded-full flex items-center justify-center ${showBitcoin ? 'bg-[#F7931A]' : 'bg-green-500'}`}>
                      {showBitcoin ? (
                        <Bitcoin size={14} color="white" />
                      ) : (
                        <DollarSign size={14} color="white" />
                      )}
                    </div>
                    Summary for your {formData.qrCodeCount.toLocaleString()} QR Codes
                  </h3>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: '#374151' }}>
                    <span>Total Cost of Rewards:</span>
                    <span>{formatCurrency(calculateTotalAndAverage().totalCost)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: '#374151', marginTop: '0.25rem' }}>
                    <span>Average QR Code Price:</span>
                    <span>{formatCurrency(calculateTotalAndAverage().averagePrice)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: '#374151', marginTop: '0.25rem' }}>
                    <span>Current Bitcoin Price:</span>
                    <span>${bitcoinPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                  <div style={{ 
                    width: 'calc(100% - 0rem)', 
                    height: '1px', 
                    backgroundColor: '#D1D5DB', 
                    margin: '0.5rem 0rem 0.5rem'
                  }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: '#374151' }}>
                    <span>Original Retail Price:</span>
                    <span>{formatCurrency(calculateTotalAndAverage().originalRetailPrice)}</span>
                  </div>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    fontSize: '0.875rem',
                    color: '#000000',
                    fontWeight: 'bold',
                    marginTop: '0.25rem'
                  }}>
                    <span>NEW Retail Price Recommendation for Bitcoin Enhanced Product:</span>
                    <span>{formatCurrency(calculateTotalAndAverage().newRetailPrice)}</span>
                  </div> 
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    fontSize: '0.875rem',
                    color: '#374151',
                    fontWeight: '',
                    marginTop: '0.25rem'
                  }}>
                    <span>NEW Retail Price with 10% QR Code Margin:</span>
                    <span>{formatCurrency(calculateTotalAndAverage().newRetailPriceWithMargin)}</span>
                  </div>
                </div>
              </div>
            )}
          {step === 3 && (
              <div className="space-y-4 sm:space-y-6">
                <div className="flex flex-col items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-semibold text-center">Review Your Order</h2>
                  <CurrencyToggle />
                </div>
                
                {renderSummary()}
                
                <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-4">
                  Choose Payment Method
                </h3>
                
                  <div className="space-y-2 sm:space-y-4">
                    <div className="flex items-center space-x-2 sm:space-x-4 bg-white p-3 sm:p-4 rounded-lg shadow-md cursor-pointer hover:bg-gray-50 transition-colors">
                      <input
                        type="radio"
                        id="creditCard"
                        name="paymentMethod"
                        value="creditCard"
                        checked={formData.paymentMethod === 'creditCard'}
                        onChange={() => setFormData(prev => ({ ...prev, paymentMethod: 'creditCard' }))}
                        className="form-radio h-4 w-4 sm:h-5 sm:w-5 text-blue-600"
                      />
                      <label htmlFor="creditCard" className="flex items-center flex-grow cursor-pointer">
                        <CreditCard className="text-blue-500 mr-2 sm:mr-3" size={20} />
                        <span className="text-base sm:text-lg">Credit Card</span>
                      </label>
                      <ChevronRight className="text-gray-400" size={16} />
                    </div>
                    
                    <div className="flex items-center space-x-2 sm:space-x-4 bg-white p-3 sm:p-4 rounded-lg shadow-md cursor-pointer hover:bg-gray-50 transition-colors">
                      <input
                        type="radio"
                        id="bitcoin"
                        name="paymentMethod"
                        value="bitcoin"
                        checked={formData.paymentMethod === 'bitcoin'}
                        onChange={() => setFormData(prev => ({ ...prev, paymentMethod: 'bitcoin' }))}
                        className="form-radio h-4 w-4 sm:h-5 sm:w-5 text-orange-600"
                      />
                      <label htmlFor="bitcoin" className="flex items-center flex-grow cursor-pointer">
                        <Bitcoin className="text-orange-500 mr-2 sm:mr-3" size={20} />
                        <span className="text-base sm:text-lg">Bitcoin (Lightning Network)</span>
                      </label>
                      <ChevronRight className="text-gray-400" size={16} />
                    </div>
                  </div>
                {formData.paymentMethod === 'creditCard' && (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="cardholderName">Cardholder Name</Label>
                      <Input 
                        id="cardholderName" 
                        placeholder="Enter cardholder name" 
                        style={{ backgroundColor: '#FFFFFF', color: '#000000', border: '1px solid #D1D5DB' }}
                      />
                    </div>
                    <div>
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input 
                        id="cardNumber" 
                        placeholder="Enter card number" 
                        style={{ backgroundColor: '#FFFFFF', color: '#000000', border: '1px solid #D1D5DB' }}
                      />
                    </div>
                    <div className="flex space-x-4">
                      <div className="w-1/2">
                        <Label htmlFor="expiryDate">Expiry Date</Label>
                        <Input 
                          id="expiryDate" 
                          placeholder="MM/YY" 
                          style={{ backgroundColor: '#FFFFFF', color: '#000000', border: '1px solid #D1D5DB' }}
                        />
                      </div>
                      <div className="w-1/2">
                        <Label htmlFor="cvv">CVV</Label>
                        <Input 
                          id="cvv" 
                          type="password" 
                          placeholder="CVV" 
                          maxLength={4}
                          style={{ backgroundColor: '#FFFFFF', color: '#000000', border: '1px solid #D1D5DB' }}
                        />
                      </div>
                    </div>
                  </div>
                )}
                {formData.paymentMethod === 'bitcoin' && (
                  <div className="flex justify-center items-center h-full">
                    <Button 
                      onClick={() => {
                        console.log("Generating Lightning invoice...");
                      }}
                      className="bg-[#F7931A] text-white px-4 py-2 rounded hover:bg-[#E87D0D] transition-colors"
                    >
                      Generate Lightning Invoice
                    </Button>
                  </div>
                )}
              </div>
            )}

          {step === 4 && renderDownloadStep()}
          </CardContent>

          <CardFooter style={{ display: 'flex', justifyContent: 'space-between', backgroundColor: '#F3F4F6', padding: '1rem' }}>
            {step > 1 && (
              <Button 
                variant="outline" 
                onClick={handleBack} 
                className="bg-[#FFFFFF] text-[#000000] border border-[#D1D5DB] hover:bg-[#F7931A] hover:text-[#FFFFFF] hover:border-[#F7931A] transition-colors duration-200"
              >
                Back
              </Button>
            )}
            {step < 4 && (
              <Button 
                onClick={handleNext} 
                className={`${step === 1 ? 'ml-auto' : ''} bg-[#F7931A] text-[#FFFFFF] hover:bg-[#E87D0D] transition-colors duration-200`}
              > 
                Next
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

export default QRCodeGeneratorPage;