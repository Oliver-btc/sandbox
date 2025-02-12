'use client';

import React, { useState } from 'react'
import { Package, ShoppingCart, UserCircle, ChevronUp, ChevronDown, Menu, Bitcoin } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface Customer {
  id: number;
  name: string;
  purchases: number;
  inventoryLevel: number;
}

type SortKey = keyof Omit<Customer, 'id'>;

// Simulated data for demonstration (expanded to 150 customers)
const initialCustomers: Customer[] = Array.from({ length: 150 }, (_, i) => ({
  id: i + 1,
  name: `Customer ${i + 1}`,
  purchases: Math.floor(Math.random() * 300) + 50,
  inventoryLevel: Math.floor(Math.random() * 100) + 1,
}))

const InventoryStatus = ({ level }: { level: number }) => {
    const getColor = (level: number) => {
      if (level > 50) return 'bg-green-500'
      if (level > 20) return 'bg-yellow-500'
      return 'bg-red-500'
    }
  
    return (
      <div className="flex items-center space-x-2 w-full">
        <div className="flex-grow bg-white rounded-full h-2.5 dark:bg-gray-700">
          <div
            className={`h-2.5 rounded-full ${getColor(level)}`}
            style={{ width: `${level}%` }}
          ></div>
        </div>
        <span className="text-sm font-medium w-12 text-right">{level}%</span>
      </div>
    )
  }
  
  const ReOrderButton = ({ inventoryLevel }: { inventoryLevel: number }) => {
    const buttonClass = inventoryLevel <= 20
      ? "bg-red-500 hover:bg-red-600 text-white"
      : "bg-gray-300 hover:bg-gray-400 text-gray-800";
  
    return (
      <Button size="sm" className={`${buttonClass} transition-colors duration-300 w-24`}>
        10% discount
      </Button>
    );
  }
  
  const ZapButton = () => {
    return (
      <Button size="sm" className="bg-[#F7931A] hover:bg-[#F7931A]/80 text-white w-24 flex items-center justify-center">
        Ping <Bitcoin className="h-4 w-4 ml-2" />
      </Button>
    );
  }
  
  const CustomerRow = ({ customer }: { customer: Customer }) => (
    <div className="bg-[#e5e5e6] text-black rounded-lg mb-2 p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2 flex-grow">
          <UserCircle className="h-6 w-6 flex-shrink-0" />
          <span className="font-medium truncate">{customer.name}</span>
        </div>
        <ReOrderButton inventoryLevel={customer.inventoryLevel} />
      </div>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <ShoppingCart className="h-5 w-5 text-black mr-2" />
          <Badge variant="secondary">{customer.purchases}</Badge>
        </div>
        <ZapButton />
      </div>
      <div className="flex items-center">
        <Package className="h-5 w-5 text-black mr-2 flex-shrink-0" />
        <InventoryStatus level={customer.inventoryLevel} />
      </div>
    </div>
  )

const SortableHeader = ({ title, icon, sortKey, currentSort, onSort }: { 
  title: string;
  icon: React.ReactNode;
  sortKey: SortKey; 
  currentSort: { key: SortKey | null; direction: 'ascending' | 'descending' }; 
  onSort: (key: SortKey) => void;
}) => {
  const isSelected = currentSort.key === sortKey;
  return (
    <div 
      className={`cursor-pointer flex items-center justify-between transition-all duration-200 ease-in-out py-2 px-3 rounded ${
        isSelected ? 'bg-black' : 'hover:bg-[#4B5563]'
      }`}
      onClick={() => onSort(sortKey)}
    >
      <div className="flex items-center space-x-2">
        {icon}
        <span>{title}</span>
      </div>
      {isSelected && (
        currentSort.direction === 'ascending' ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />
      )}
    </div>
  );
};

export default function CustomerInventoryDashboard() {
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers)
  const [sortConfig, setSortConfig] = useState<{ key: SortKey | null; direction: 'ascending' | 'descending' }>({ key: null, direction: 'ascending' })
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const sortBy = (key: SortKey) => {
    let direction: 'ascending' | 'descending' = 'ascending'
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending'
    }
    setSortConfig({ key, direction })

    const sortedCustomers = [...customers].sort((a, b) => {
      if (key === 'name') {
        // Extract numbers from customer names and compare
        const aNum = parseInt(a.name.match(/\d+/)?.[0] || '0', 10);
        const bNum = parseInt(b.name.match(/\d+/)?.[0] || '0', 10);
        return direction === 'ascending' ? aNum - bNum : bNum - aNum;
      } else {
        if (a[key] < b[key]) return direction === 'ascending' ? -1 : 1
        if (a[key] > b[key]) return direction === 'ascending' ? 1 : -1
        return 0
      }
    })

    setCustomers(sortedCustomers)
  }

  return (
    <div className="bg-black p-4 rounded-lg">
      <button 
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
        className="w-full flex justify-between items-center mb-4 bg-gradient-to-b from-[#7e7c83] to-[#000000] hover:bg-[#000000] text-white py-2 px-4 rounded transition-colors duration-200"
      >
        <span>Menu</span>
        <Menu className="h-5 w-5" />
      </button>
      
      {mobileMenuOpen && (
        <div className="bg-gradient-to-b from-[#7e7c83] to-[#000000] text-white rounded-lg mb-4 p-4">
          <SortableHeader 
            title="Customer" 
            icon={<UserCircle className="h-5 w-5" />}
            sortKey="name" 
            currentSort={sortConfig} 
            onSort={sortBy} 
          />
          <SortableHeader 
            title="Purchases" 
            icon={<ShoppingCart className="h-5 w-5" />}
            sortKey="purchases" 
            currentSort={sortConfig} 
            onSort={sortBy} 
          />
          <SortableHeader 
            title="Inventory Status" 
            icon={<Package className="h-5 w-5" />}
            sortKey="inventoryLevel" 
            currentSort={sortConfig} 
            onSort={sortBy} 
          />
        </div>
      )}
      
      <div className="h-[calc(100vh-250px)] overflow-y-auto">
        {customers.map((customer) => (
          <CustomerRow key={customer.id} customer={customer} />
        ))}
      </div>
    </div>
  )
}