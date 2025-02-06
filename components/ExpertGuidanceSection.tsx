import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PhoneCall, Users, TrendingUp, FileText } from 'lucide-react';

const ExpertGuidanceSection = () => {
  const cardStyle = {
    background: 'linear-gradient(to bottom, #000000, #58575c)',
  };

  const features = [
    { icon: <PhoneCall className="h-8 w-8 text-[#F7931A]" />, title: "Expert Calls", description: "Schedule one-on-one calls with our analytics experts" },
    { icon: <Users className="h-8 w-8 text-[#F7931A]" />, title: "Personalized Guidance", description: "Receive tailored advice on interpreting your customer data" },
    { icon: <TrendingUp className="h-8 w-8 text-[#F7931A]" />, title: "Trend Analysis", description: "Gain insights on emerging patterns in customer behavior" },
    { icon: <FileText className="h-8 w-8 text-[#F7931A]" />, title: "Custom Reports", description: "Request in-depth analysis reports on specific metrics" },
  ];

  return (
    <Card style={cardStyle}>
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-[#ffffff]">Expert Calls & Analytics Guidance</CardTitle>
        <CardDescription className="text-lg text-muted-foreground">
          Leverage our expertise to unlock the full potential of your customer analytics
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="bg-black bg-opacity-50 border-none">
              <CardContent className="flex flex-col items-center text-center p-4">
                {feature.icon}
                <h3 className="mt-4 text-lg font-semibold text-[#ffffff]">{feature.title}</h3>
                <p className="mt-2 text-sm text-gray-400">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="mt-8 text-center">
          <button className="px-6 py-3 bg-[#F7931A] text-white font-semibold rounded-lg hover:bg-[#E87D0D] transition-colors">
            Schedule an Expert Call
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExpertGuidanceSection;