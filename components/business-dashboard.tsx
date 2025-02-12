'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { QrCode, Bitcoin, PieChart as PieChartIcon } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import { mockQRCodeLocations, cumulativeData, Location, CumulativeDataPoint } from './mockQRCodeLocations';
import HeaderComponent from './Header';
import ProjectionChart from './ProjectionChart';
import Header from './Header';
import CustomerInventoryDashboard from './CustomerInventoryDashboard';
import ExpertGuidanceSection from './ExpertGuidanceSection';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Dynamically import the map component
const QRCodeScanMapComponent = dynamic(
  () => import('./QRCodeScanMap'),
  { 
    ssr: false,
    loading: () => <div className="h-full w-full flex items-center justify-center">Loading map...</div>
  }
);

const COLORS = ['#808080', '#F7931A', '#00C49F', '#FFBB28', '#FF8042'];

const cardStyle = {
  background: 'linear-gradient(to bottom, #000000, #58575c)',
};

interface DataItem {
  name: string;
  value: number;
}

interface PieChartCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  data: DataItem[];
  showTotal?: boolean;
  unit?: string;
}

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name, value, fill }: any) => {
  const radius = outerRadius + 10;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  const sin = Math.sin(-midAngle * RADIAN);
  const cos = Math.cos(-midAngle * RADIAN);
  const sx = cx + outerRadius * cos;
  const sy = cy + outerRadius * sin;
  const mx = cx + (outerRadius + 10) * cos;
  const my = cy + (outerRadius + 10) * sin;
  const ex = x;
  const ey = y;
  const textAnchor = x > cx ? 'start' : 'end';

  return (
    <g>
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#FFFFFF" fontSize="11" fontWeight="bold">
        {name}
      </text>
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={14} textAnchor={textAnchor} fill="#CCCCCC" fontSize="9">
        {`${(percent * 100).toFixed(0)}%, ${value.toLocaleString()}`}
      </text>
    </g>
  );
};

const PieChartCard: React.FC<PieChartCardProps> = ({ title, description, icon, data, showTotal = false, unit = "" }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  const sortedData = [...data].sort((a, b) => 
    a.name.toLowerCase() === "unclaimed" ? -1 : b.name.toLowerCase() === "unclaimed" ? 1 : 0
  );

  return (
    <Card className="h-full" style={cardStyle}>
      <CardHeader className="space-y-0 pb-2">
        <div className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg text-[#FFFFFF] font-bold">{title}</CardTitle>
          {icon}
        </div>
        <CardDescription className="text-xs text-muted-foreground mt-1">{description}</CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={sortedData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={70}
                fill="#8884d8"
                dataKey="value"
                startAngle={90}
                endAngle={-270}
              >
                {sortedData.map((entry, index) => {
                  const fill = entry.name.toLowerCase() === "unclaimed" ? "#808080" : COLORS[(index + 1) % COLORS.length];
                  return (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={fill}
                    />
                  );
                })}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        {showTotal && (
          <div className="mt-2 text-center">
            <p className="text-lg text-[#FFFFFF] font-medium">
              {total.toLocaleString()} {unit}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

interface QRCodeData extends Location {
  batchId: string;
}

const batchIds = ['Batch001', 'Batch002', 'Batch003'];

const BatchSelector: React.FC<{ batches: string[], selectedBatch: string, onBatchChange: (batch: string) => void }> = 
  ({ batches, selectedBatch, onBatchChange }) => (
  <Select onValueChange={onBatchChange} value={selectedBatch}>
    <SelectTrigger className="w-full md:w-[180px]">
      <SelectValue placeholder="Select Batch" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="all">All Batches</SelectItem>
      {batches.map((batch) => (
        <SelectItem key={batch} value={batch}>{batch}</SelectItem>
      ))}
    </SelectContent>
  </Select>
);

export function BusinessDashboard() {
  const [mounted, setMounted] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [selectedBatch]);

  // Early return while not mounted
  if (!mounted) {
    return <div className="min-h-screen bg-gradient-to-b from-[#000000] via-[#000000] to-[#7e7c83]">
      <div className="container mx-auto p-4">Loading...</div>
    </div>;
  }

  const filteredQRCodes = useMemo(() => {
    return selectedBatch === 'all' 
      ? mockQRCodeLocations 
      : mockQRCodeLocations.filter(qr => qr.batchId === selectedBatch);
  }, [selectedBatch]);

  const {
    totalQRCodes,
    claimedQRCodes,
    unclaimedQRCodes,
    totalBitcoinRewards,
    claimedBitcoinRewards,
    unclaimedBitcoinRewards,
    combinedQRCodeStatusOverTime,
    today
  } = useMemo(() => {
    if (!filteredQRCodes || filteredQRCodes.length === 0) {
      return {
        totalQRCodes: 0,
        claimedQRCodes: 0,
        unclaimedQRCodes: 0,
        totalBitcoinRewards: 0,
        claimedBitcoinRewards: 0,
        unclaimedBitcoinRewards: 0,
        combinedQRCodeStatusOverTime: [],
        today: new Date().toISOString().split('T')[0]
      };
    }

    const totalQRCodes = filteredQRCodes.length;
    const claimedQRCodes = filteredQRCodes.filter(qr => qr.status === 'Claimed').length;
    const unclaimedQRCodes = totalQRCodes - claimedQRCodes;

    const today = new Date().toISOString().split('T')[0];

    const totalBitcoinRewards = filteredQRCodes.reduce((total, qrCode) => 
      qrCode.status === 'Claimed' ? total + qrCode.reward : total, 0) / 100000000;
    const claimedBitcoinRewards = totalBitcoinRewards;
    const unclaimedBitcoinRewards = 0;

    const lastWeekData = cumulativeData.slice(-7);
    const averageDailyClaimRate = 
      (lastWeekData[lastWeekData.length - 1].Claimed - lastWeekData[0].Claimed) / 7;

    const lastDay = cumulativeData[cumulativeData.length - 1];
    
    const projectedData = [];
    let currentActive = lastDay.Active;
    let currentClaimed = lastDay.Claimed;
    let currentDate = new Date(lastDay.date);

    while (currentActive > 0) {
      currentDate.setDate(currentDate.getDate() + 1);
      const claimedToday = Math.min(currentActive, averageDailyClaimRate);
      currentActive -= claimedToday;
      currentClaimed += claimedToday;

      projectedData.push({
        date: currentDate.toISOString().split('T')[0],
        Active: Math.round(currentActive),
        Claimed: Math.round(currentClaimed),
      });
    }

    const combinedQRCodeStatusOverTime = [
      ...cumulativeData,
      ...projectedData
    ];

    return {
      totalQRCodes,
      claimedQRCodes,
      unclaimedQRCodes,
      totalBitcoinRewards,
      claimedBitcoinRewards,
      unclaimedBitcoinRewards,
      combinedQRCodeStatusOverTime,
      today
    };
  }, [filteredQRCodes]);

  if (totalQRCodes === 0) {
    return <div>Loading or no data available...</div>;
  }

  const businessName = "NiHowdy";

  const scanTimes = [
    { name: '00:00-04:00', scans: 1200 },
    { name: '04:00-08:00', scans: 1800 },
    { name: '08:00-12:00', scans: 3000 },
    { name: '12:00-16:00', scans: 2700 },
    { name: '16:00-20:00', scans: 2100 },
    { name: '20:00-24:00', scans: 1500 },
  ];

  return (
    <div className="flex flex-col bg-gradient-to-b from-[#000000] via-[#000000] to-[#7e7c83] text-white min-h-screen">
      <div className="fixed top-0 left-0 right-0 z-50">
        <HeaderComponent />
      </div>
      <div className="container mx-auto p-4 space-y-4 mt-16">
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between mb-6">
          <div className="flex items-center">
            <img src="/images/Bitcoin Logo.png" alt="Bitcoin Logo" className="w-8 h-8 mr-2" />
            <h2 className="text-2xl font-bold">Welcome, {businessName}!</h2>
            <img src="/images/NiHowdy/NiHowdy.png" alt="NiHowdy" className="w-8 h-8 ml-2" />
          </div>
          <div className="w-full md:w-auto">
            <BatchSelector 
              batches={batchIds} 
              selectedBatch={selectedBatch} 
              onBatchChange={setSelectedBatch} 
            />
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-8">
            <p className="text-xl">Loading batch data...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <PieChartCard
                title={`Total QR Codes: ${new Intl.NumberFormat('en-US').format(totalQRCodes)}`}
                description="Allocation of claimed vs. unclaimed QR Codes"
                icon={<QrCode className="h-4 w-4 text-muted-foreground" />}
                data={[
                  { name: 'Claimed', value: claimedQRCodes },
                  { name: 'Unclaimed', value: unclaimedQRCodes },
                ]}
              />

              <PieChartCard
                title={`Total Bitcoin Rewards: ${totalBitcoinRewards.toFixed(8)} BTC`}
                description="Allocation of claimed vs. unclaimed Rewards"
                icon={<Bitcoin className="h-4 w-4 text-muted-foreground" />}
                data={[
                  { name: 'Claimed', value: claimedBitcoinRewards },
                  { name: 'Unclaimed', value: unclaimedBitcoinRewards },
                ]}
              />

              <PieChartCard
                title={`Claim Rate: ${((claimedQRCodes / totalQRCodes) * 100).toFixed(2)}%`}
                description="Percentage of QR codes that have been claimed"
                icon={<QrCode className="h-4 w-4 text-muted-foreground" />}
                data={[
                  { name: 'Claimed', value: claimedQRCodes },
                  { name: 'Unclaimed', value: unclaimedQRCodes },
                ]}
              />

              <PieChartCard
                title={`Conversion Rate: ${((claimedQRCodes / totalQRCodes) * 100).toFixed(2)}%`}
                description="Percentage of QR codes that have been claimed"
                icon={<PieChartIcon className="h-4 w-4 text-muted-foreground" />}
                data={[
                  { name: 'Claimed', value: claimedQRCodes },
                  { name: 'Unclaimed', value: unclaimedQRCodes },
                ]}
                showTotal={false}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card style={cardStyle}>
                <CardHeader>
                  <CardTitle className="text-[#ffffff]">QR Code Scan Locations</CardTitle>
                  <CardDescription className="text-muted-foreground">Heat map of claimed QR code scans across the USA</CardDescription>
                </CardHeader>
                <CardContent className="h-[400px] overflow-hidden rounded-lg">
                  {mounted && <QRCodeScanMapComponent locations={mockQRCodeLocations.filter(qr => qr.status === 'Claimed')} />}
                </CardContent>
              </Card>
              <Card style={cardStyle}>
                <CardHeader>
                  <CardTitle className="text-[#ffffff]">Scan Times Distribution</CardTitle>
                  <CardDescription>Number of scans during different times of the day</CardDescription>
                </CardHeader>
                <CardContent className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={scanTimes}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Bar dataKey="scans" fill="#F7931A" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {combinedQRCodeStatusOverTime.length > 0 && (
              <Card style={cardStyle}>
                <CardHeader>
                  <CardTitle className="text-[#ffffff]">QR Code Status Over Time (with Projection)</CardTitle>
                  <CardDescription>Number of active and claimed QR codes over time, with future projection</CardDescription>
                </CardHeader>
                <CardContent className="h-[400px]">
                  <ProjectionChart data={combinedQRCodeStatusOverTime} today={today} />
                </CardContent>
              </Card>
            )}

            <Card style={cardStyle}>
              <CardHeader>
                <CardTitle className="text-[#ffffff]">Customer Inventory Tracking</CardTitle>
                <CardDescription>Monitor customer purchases and product consumption</CardDescription>
              </CardHeader>
              <CardContent>
                <CustomerInventoryDashboard />
              </CardContent>
            </Card>
            <ExpertGuidanceSection />
          </>
        )}
      </div>
    </div>
  );
}

export default BusinessDashboard;