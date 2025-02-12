"use client"

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { QrCode, Upload, Edit2, Check, Plus, ExternalLink, Tag } from 'lucide-react'
import { Switch } from "@/components/ui/switch"
import Header from './Header'; // Make sure the path is correct

interface ProductUnit {
  id: number;
  product: {
    name: string;
    description: string;
    websiteUrl: string;
    promoCode: string;
    discountPercentage?: number;
    image: string | null;
    logo: string | null;
    isLive: boolean;
    poweredByBeyondCheckout?: boolean;
  };
  qrBatches: Array<{
    id: number;
    date: string;
    quantity: number;
  }>;
}

function ProductUnitComponent({ productUnit, updateProductUnit }: { productUnit: ProductUnit; updateProductUnit: (updatedUnit: ProductUnit) => void }) {
  const [isEditing, setIsEditing] = useState(true)
  const [showPreview, setShowPreview] = useState(false)
  const [isCardActive, setIsCardActive] = useState(false)

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>, imageType: 'product' | 'logo') => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const updatedUnit = {
          ...productUnit,
          product: { 
            ...productUnit.product, 
            [imageType === 'product' ? 'image' : 'logo']: e.target?.result as string 
          }
        }
        updateProductUnit(updatedUnit)
      }
      reader.readAsDataURL(file)
    }
  }

  const generateQRBatch = () => {
    const newBatch = {
      id: productUnit.qrBatches.length + 1,
      date: new Date().toLocaleDateString(),
      quantity: Math.floor(Math.random() * 1000) + 1
    }
    const updatedUnit = {
      ...productUnit,
      qrBatches: [...productUnit.qrBatches, newBatch]
    }
    updateProductUnit(updatedUnit)
  }

  const toggleEdit = () => {
    setIsEditing(!isEditing)
  }

  const togglePreview = () => {
    setShowPreview(!showPreview)
    setIsCardActive(false) // Reset to inactive state when toggling preview
  }

  const toggleCardState = () => {
    setIsCardActive(!isCardActive)
  }

  const cardBackgroundClass = productUnit.product.isLive
    ? "bg-gradient-to-b from-[#F7931A] to-black"
    : "bg-gray-100";

  const MarketplacePreview = () => (
    <div className="w-full">
      <h5 className="text-sm font-semibold mb-2 text-gray-700">
        {isCardActive ? "Active Card View" : "Inactive Card View"}
      </h5>
      <div 
        className="w-full h-[400px] overflow-hidden relative rounded-lg shadow-md cursor-pointer"
        onClick={toggleCardState}
      >
        <img 
          src={productUnit.product.image || '/placeholder.svg'} 
          alt={productUnit.product.name || 'Product image'} 
          className="w-full h-full object-cover"
        />
        {!isCardActive && (
          <>
            <div className="absolute top-4 left-4 w-16 h-16">
              <img 
                src={productUnit.product.logo || '/placeholder.svg'} 
                alt="Company logo" 
                className="w-full h-full object-cover rounded-full border-2 border-white"
              />
            </div>
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
          </>
        )}
        {isCardActive && (
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
      <p className="text-sm text-gray-500 mt-2 text-center">
        {isCardActive ? "Click to see inactive view" : "Click to see active view"}
      </p>
    </div>
  )

  const BitcoinRewardsSwitch = () => (
    <div className="flex items-center justify-between mt-4 bg-gray-100 p-3 rounded-lg">
      <div className="flex items-center space-x-2">
        <Switch
          checked={productUnit.product.poweredByBeyondCheckout || false}
          onCheckedChange={(checked) => {
            const updatedUnit = {
              ...productUnit,
              product: { ...productUnit.product, poweredByBeyondCheckout: checked }
            }
            updateProductUnit(updatedUnit)
          }}
        />
        {productUnit.product.poweredByBeyondCheckout ? (
          <div className="flex items-center">
            <span className="text-sm text-gray-700 mr-2">Bitcoin Rewards powered by</span>
            <img src="/images/BeyondTC_b.png" alt="Beyond The Checkout" className="h-6" />
          </div>
        ) : (
          <span className="text-sm text-gray-700">No Bitcoin rewards in the physical product</span>
        )}
      </div>
    </div>
  )

  return (
    <Card className={`w-full max-w-2xl mx-auto mb-4 shadow-md overflow-hidden`}>
      <div className={`${cardBackgroundClass} transition-colors duration-300`}>
        <CardHeader className="pb-2">
          <div className="flex flex-col">
            <CardTitle className={`text-2xl mb-1 ${productUnit.product.isLive ? "text-white" : "text-black"}`}>
              Featured Product
            </CardTitle>
            <CardDescription className={`mb-2 ${productUnit.product.isLive ? "text-gray-300" : "text-gray-600"}`}>
              Manage your product details and marketplace visibility
            </CardDescription>
            <div className="flex items-center space-x-2 mt-2">
              <Switch
                checked={productUnit.product.isLive}
                onCheckedChange={(checked) => {
                  const updatedUnit = {
                    ...productUnit,
                    product: { ...productUnit.product, isLive: checked }
                  }
                  updateProductUnit(updatedUnit)
                }}
                className={`${productUnit.product.isLive ? 'bg-green-500' : 'bg-gray-200'}`}
              />
              <span className={`text-sm font-medium ${productUnit.product.isLive ? "text-white" : "text-black"}`}>
                {productUnit.product.isLive ? 'Live on Marketplace' : 'Not Live'}
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="space-y-4">
            <div className="bg-white border-2 border-gray-200 rounded-lg p-4 shadow-sm">
              <div className="flex flex-col mb-4">
                <h3 className="text-lg font-semibold text-black mb-2">Product Details</h3>
                <div className="flex space-x-2">
                <Button 
                  type="button" 
                  onClick={togglePreview}
                  className={`flex-1 ${
                    showPreview 
                      ? 'bg-[#F7931A] text-white border-[#F7931A]' 
                      : 'bg-white text-black border border-gray-300'
                  } hover:bg-[#F7931A] hover:text-white hover:border-[#F7931A] transition-colors duration-200`}
                >
                  Preview
                </Button>
                  <Button 
                    type="button" 
                    onClick={toggleEdit}
                    className="flex-1 bg-white text-black border border-gray-300 hover:bg-[#F7931A] hover:text-white hover:border-[#F7931A] transition-colors duration-200"
                  >
                    {isEditing ? <Check className="h-4 w-4 mr-2" /> : <Edit2 className="h-4 w-4 mr-2" />}
                    {isEditing ? 'Save' : 'Edit'}
                  </Button>
                </div>
              </div>
              {showPreview ? (
              <MarketplacePreview />
              ) : (
                <>
                  <div className="relative w-full h-48 mb-4">
                    {productUnit.product.image ? (
                      <img 
                        src={productUnit.product.image} 
                        alt={productUnit.product.name || 'Product image'} 
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded-lg">
                        <img
                          src="/placeholder.svg"
                          alt="Default Product Image"
                          className="w-full h-full object-cover rounded-lg"
                        />
                        <Button
                          type="button"
                          onClick={() => document.getElementById(`productImage-${productUnit.id}`)?.click()}
                          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#F7931A] text-[#FFFFFF] hover:bg-[#E87D0D] transition-colors duration-200"
                        >
                          <Upload className="mr-2 h-5 w-5" /> Product Image
                        </Button>
                      </div>
                    )}
                    <div className="absolute top-2 left-2 w-20 h-20">
                      {productUnit.product.logo ? (
                        <img 
                          src={productUnit.product.logo} 
                          alt="Company logo" 
                          className="w-full h-full object-cover rounded-full border-2 border-white"
                        />
                      ) : (
                        <div className="w-full h-full bg-white flex flex-col items-center justify-center rounded-full border-2 border-gray-200 overflow-hidden">
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            className="w-full h-full rounded-full flex flex-col items-center justify-center p-0"
                            onClick={() => document.getElementById(`logoImage-${productUnit.id}`)?.click()}
                          >
                            <Upload className="h-5 w-5 mb-1 text-black" />
                            <span className="text-xs text-center px-1 text-black">Logo</span>
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                  <Input
                    id={`productImage-${productUnit.id}`}
                    type="file"
                    onChange={(e) => handleImageUpload(e, 'product')}
                    className="hidden"
                    accept="image/*"
                  />
                  <Input
                    id={`logoImage-${productUnit.id}`}
                    type="file"
                    onChange={(e) => handleImageUpload(e, 'logo')}
                    className="hidden"
                    accept="image/*"
                  />
                  <div className="space-y-2">
                    {isEditing ? (
                      <Input
                        value={productUnit.product.name}
                        onChange={(e) => {
                          const updatedUnit = {
                            ...productUnit,
                            product: { ...productUnit.product, name: e.target.value }
                          }
                          updateProductUnit(updatedUnit)
                        }}
                        placeholder="Enter your product name"
                        required
                        aria-label="Product name"
                        className="bg-white font-semibold text-lg"
                      />
                    ) : (
                      <h4 className="text-lg font-semibold text-black">{productUnit.product.name || 'Product Name'}</h4>
                    )}
                  </div>
                  <div className="space-y-2 mt-2">
                    {isEditing ? (
                      <Textarea
                        value={productUnit.product.description}
                        onChange={(e) => {
                          const updatedUnit = {
                            ...productUnit,
                            product: { ...productUnit.product, description: e.target.value }
                          }
                          updateProductUnit(updatedUnit)
                        }}
                        placeholder="Describe your product (features, benefits, etc.)"
                        required
                        aria-label="Product description"
                        className="bg-white text-sm"
                        rows={3}
                      />
                    ) : (
                      <p className="text-sm text-gray-600">{productUnit.product.description || 'Product description'}</p>
                    )}
                  </div>
                  <div className="space-y-2 mt-2">
                    {isEditing ? (
                      <div className="flex items-center space-x-2">
                        <ExternalLink className="h-4 w-4 text-gray-400" />
                        <Input
                          value={productUnit.product.websiteUrl}
                          onChange={(e) => {
                            const updatedUnit = {
                              ...productUnit,
                              product: { ...productUnit.product, websiteUrl: e.target.value }
                            }
                            updateProductUnit(updatedUnit)
                          }}
                          placeholder="Enter product website URL"
                          type="url"
                          aria-label="Product website URL"
                          className="bg-white text-sm"
                        />
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <ExternalLink className="h-4 w-4 text-gray-400" />
                        <a href={productUnit.product.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                          {productUnit.product.websiteUrl || 'Product website'}
                        </a>
                      </div>
                    )}
                  </div>
                  <div className="space-y-2 mt-2">
                    {isEditing ? (
                      <div className="flex items-center space-x-2">
                        <Tag className="h-4 w-4 text-gray-400" />
                        <Input
                          value={productUnit.product.promoCode}
                          onChange={(e) => {
                            const updatedUnit = {
                              ...productUnit,
                              product: { ...productUnit.product, promoCode: e.target.value }
                            }
                            updateProductUnit(updatedUnit)
                          }}
                          placeholder="Enter promotional code"
                          aria-label="Promotional code"
                          className="bg-white text-sm"
                        />
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Tag className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {productUnit.product.promoCode || 'No promotional code'}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="space-y-2 mt-2">
                    {isEditing ? (
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">Discount Percentage:</span>
                        <Input
                          type="number"
                          value={productUnit.product.discountPercentage || ''}
                          onChange={(e) => {
                            const updatedUnit = {
                              ...productUnit,
                              product: { ...productUnit.product, discountPercentage: Number(e.target.value) }
                            }
                            updateProductUnit(updatedUnit)
                          }}
                          placeholder="Enter discount percentage"
                          aria-label="Discount percentage"
                          className="bg-white text-sm w-20"
                          min="0"
                          max="100"
                        />
                        <span className="text-sm text-gray-600">%</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">Discount:</span>
                        <span className="text-sm text-gray-600">
                          {productUnit.product.discountPercentage ? `${productUnit.product.discountPercentage}%` : 'No discount'}
                        </span>
                      </div>
                    )}
                  </div>
                  <BitcoinRewardsSwitch />
                </>
              )}
            </div>
          </div>
        </CardContent>
      </div>
      <div className="bg-white">
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Batch ID</TableHead>
                <TableHead>Date Generated</TableHead>
                <TableHead>Quantity</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {productUnit.qrBatches.map((batch) => (
                <TableRow key={batch.id}>
                  <TableCell>{batch.id}</TableCell>
                  <TableCell>{batch.date}</TableCell>
                  <TableCell>{batch.quantity}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="flex flex-col items-stretch gap-4">
          <p className="text-sm text-muted-foreground">
            Total Batches: {productUnit.qrBatches.length}
          </p>
          <Button onClick={generateQRBatch} className="w-full bg-[#F7931A] hover:bg-[#E87D0D] text-white">
            <QrCode className="mr-2 h-4 w-4" /> Generate QR Code Batch
          </Button>
        </CardFooter>
      </div>
    </Card>
  )
}

export function ProductManagementComponent() {
  const [productUnits, setProductUnits] = useState<ProductUnit[]>([
    {
      id: 1,
      product: {
        name: '',
        description: '',
        websiteUrl: '',
        promoCode: '',
        discountPercentage: 0,
        image: null,
        logo: null,
        isLive: false,
        poweredByBeyondCheckout: false
      },
      qrBatches: []
    }
  ])

  const addNewProduct = () => {
    const newProductUnit: ProductUnit = {
      id: productUnits.length + 1,
      product: {
        name: '',
        description: '',
        websiteUrl: '',
        promoCode: '',
        discountPercentage: 0,
        image: null,
        logo: null,
        isLive: false,
        poweredByBeyondCheckout: false
      },
      qrBatches: []
    }
    setProductUnits([...productUnits, newProductUnit])
  }

  const updateProductUnit = (updatedUnit: ProductUnit) => {
    setProductUnits(productUnits.map(unit => 
      unit.id === updatedUnit.id ? updatedUnit : unit
    ))
  }

  return (
    <div className="flex flex-col bg-gradient-to-b from-[#000000] via-[#000000] to-[#7e7c83] text-white min-h-screen">
      <Header />
      <div className="container mx-auto p-4">
        {productUnits.map(productUnit => (
          <ProductUnitComponent 
            key={productUnit.id} 
            productUnit={productUnit} 
            updateProductUnit={updateProductUnit}
          />
        ))}
        <div className="flex justify-center mt-8">
          <Button onClick={addNewProduct} className="w-full max-w-2xl bg-[#F7931A] hover:bg-[#E87D0D] text-white">
            <Plus className="mr-2 h-4 w-4" /> Add New Product
          </Button>
        </div>
      </div>
    </div>
  )
}