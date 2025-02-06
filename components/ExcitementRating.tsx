import React from 'react';
import { Info, Star } from 'lucide-react';
import * as Tooltip from '@radix-ui/react-tooltip';

interface ExcitementRatingProps {
  midRewards: Array<{ amount: number; count: number }>;
  productPrice: number;
  totalQRCodes: number;
  maxScore: number;
  starCount: number;
}

const ExcitementRating: React.FC<ExcitementRatingProps> = ({
  midRewards,
  productPrice,
  totalQRCodes,
  maxScore,
  starCount
}) => {
  // Calculate the average reward percentage for mid rewards
  const calculateAverageRewardPercentage = (): number => {
    const totalMidRewardValue = midRewards.reduce((sum, reward) => sum + reward.amount * reward.count, 0);
    const totalMidRewardCount = midRewards.reduce((sum, reward) => sum + reward.count, 0);
    const averageMidReward = totalMidRewardValue / totalMidRewardCount;
    return (averageMidReward / productPrice) * 100;
  };

  const averageRewardPercentage = calculateAverageRewardPercentage();

  // Calculate Excitement Score based on average reward percentage
  const calculateExcitementScore = (): number => {
    if (averageRewardPercentage <= 30) return (averageRewardPercentage / 30) * 20;
    if (averageRewardPercentage <= 60) return 20 + ((averageRewardPercentage - 30) / 30) * 20;
    if (averageRewardPercentage <= 90) return 40 + ((averageRewardPercentage - 60) / 30) * 20;
    if (averageRewardPercentage <= 150) return 60 + ((averageRewardPercentage - 90) / 60) * 20;
    return Math.min(80 + ((averageRewardPercentage - 150) / 150) * 20, 100); // Cap at 100
  };

  const score = calculateExcitementScore();

  // Calculate the percentage for the star fill
  const percentage = (score / maxScore) * 100;

  // Determine star fill percentage for each star
  const getStarFill = (starIndex: number): number => {
    const starPercentage = (percentage / 100) * starCount;
    const fullStars = Math.floor(starPercentage);
    const partialFill = starPercentage - fullStars;

    if (starIndex < fullStars) return 100; // Full star
    if (starIndex === fullStars) return partialFill * 100; // Partially filled star
    return 0; // Empty star
  };

  // Excitement levels based on score
    const getExcitementLevel = () => {
    if (score <= 20) return "Initial Interest";
    if (score <= 40) return "Building Excitement";
    if (score <= 60) return "Buzzing Anticipation";
    if (score <= 80) return "Elevated Thrill";
    return "Peak Thrill";
    };
  
  // Tooltip explanations for different excitement levels
    const getTooltipContent = () => {
    const level = getExcitementLevel();
    return `${level}: Average mid reward is ${averageRewardPercentage.toFixed(2)}% of the product price. 
    Excitement Score: ${score.toFixed(2)}. ${
      level === "Initial Interest" ? "Modest rewards (≤30%) that generate foundational interest." :
      level === "Building Excitement" ? "Noteworthy rewards (30-60%) that create growing anticipation." :
      level === "Buzzing Anticipation" ? "High rewards (60-90%) building substantial excitement." :
      level === "Elevated Thrill" ? "Very high rewards (90-150%) generating elevated thrill and strong engagement." :
      "Exceptional rewards (>150%) creating peak excitement and driving maximum anticipation."
    }`;
    };
  

  return (
    <Tooltip.Provider delayDuration={0}>
      <div className="flex flex-col items-end">
        {/* Display the Excitement Score */}
        <div className="text-md font-semibold mb-1">Excitement Score: {score.toFixed(2)}</div>
        
        {/* Star rating display */}
        <div className="flex">
          {[...Array(starCount)].map((_, index) => (
            <div key={index} className="relative w-6 h-6">
              <Star size={22} className="absolute top-0 left-0 text-gray-300" />
              <div className="absolute top-0 left-0 overflow-hidden" style={{ width: `${getStarFill(index)}%` }}>
                <Star size={22} className="text-orange-500" />
              </div>
            </div>
          ))}
        </div>

        {/* Excitement level with tooltip */}
        <div className="flex items-center mb-1">
          <div className="text-xs text-gray-500 mr-1">{getExcitementLevel()}</div>
          <Tooltip.Root>
            <Tooltip.Trigger asChild>
              <button className="focus:outline-none" aria-label="Excitement Score Info">
                <Info size={16} className="text-gray-500 hover:text-gray-700" />
              </button>
            </Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Content className="bg-gray-800 text-white p-2 rounded shadow-lg max-w-[250px] text-xs z-50" sideOffset={5}>
                {getTooltipContent()}
                <Tooltip.Arrow className="fill-gray-800" />
              </Tooltip.Content>
            </Tooltip.Portal>
          </Tooltip.Root>
        </div>
      </div>
    </Tooltip.Provider>
  );
};

export default ExcitementRating;