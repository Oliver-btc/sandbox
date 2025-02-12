import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

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
}

interface ImpactScores {
  rewardImpact: number;
  hypeMeter: number;
  valuePerception: number;
  engagementPotential: number;
  riskRewardBalance: number;
  sustainability: number;
}

interface RewardImpactDashboardProps {
  formData: FormData;
}

const RewardImpactDashboard: React.FC<RewardImpactDashboardProps> = ({ formData }) => {
  const [impactScores, setImpactScores] = useState<ImpactScores>({
    rewardImpact: 0,
    hypeMeter: 0,
    valuePerception: 0,
    engagementPotential: 0,
    riskRewardBalance: 0,
    sustainability: 0
  });

  useEffect(() => {
    calculateImpactScores();
  }, [formData]);

  const calculateImpactScores = () => {
    const retailPrice = parseFloat(formData.productRetailPrice);
    const allRewards = [...formData.baseRewards, ...formData.midRewards, ...formData.topRewards];
    const totalRewardValue = allRewards.reduce((sum, reward) => sum + reward.amount * reward.count, 0);
    const averageRewardValue = totalRewardValue / formData.qrCodeCount;
    const maxReward = Math.max(...allRewards.map(r => r.amount));

    const rewardImpact = Math.min((totalRewardValue / (retailPrice * formData.qrCodeCount)) * 50, 100);
    const hypeMeter = Math.min((maxReward / retailPrice) * 20, 100);
    const valuePerception = Math.min((averageRewardValue / retailPrice) * 100, 100);
    const engagementPotential = Math.min((formData.baseRewards.reduce((sum: number, r: Reward) => sum + r.count, 0) / formData.qrCodeCount) * 100, 100);
    const riskRewardBalance = 100 - Math.min((maxReward / averageRewardValue) * 10, 100);
    const sustainability = Math.max(100 - (totalRewardValue / (retailPrice * formData.qrCodeCount)) * 100, 0);

    setImpactScores({
      rewardImpact,
      hypeMeter,
      valuePerception,
      engagementPotential,
      riskRewardBalance,
      sustainability
    });
  };

  const renderProgressBar = (label: string, value: number) => (
    <div className="mb-4">
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-sm font-medium text-gray-700">{value.toFixed(1)}%</span>
      </div>
      <Progress value={value} className="w-full" />
    </div>
  );

  const chartData = Object.entries(impactScores).map(([key, value]) => ({
    name: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1'),
    value
  }));

  return (
    <Card className="w-full max-w-3xl mx-auto bg-white">
      <CardHeader className="bg-white">
        <h2 className="text-2xl font-bold text-center text-gray-800">Reward Impact Dashboard</h2>
      </CardHeader>
      <CardContent className="bg-white">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-lg font-semibold mb-2 text-gray-700">Impact Scores</h3>
            {renderProgressBar("Reward Impact", impactScores.rewardImpact)}
            {renderProgressBar("Hype Meter", impactScores.hypeMeter)}
            {renderProgressBar("Value Perception", impactScores.valuePerception)}
            {renderProgressBar("Engagement Potential", impactScores.engagementPotential)}
            {renderProgressBar("Risk-Reward Balance", impactScores.riskRewardBalance)}
            {renderProgressBar("Sustainability", impactScores.sustainability)}
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2 text-gray-700">Impact Visualization</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#F7931A" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RewardImpactDashboard;