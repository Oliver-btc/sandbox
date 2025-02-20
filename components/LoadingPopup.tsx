import React from 'react';
import { Loader2, QrCode, Scan, LineChart } from 'lucide-react';

interface LoadingPopupProps {
  isOpen: boolean;
}

const LoadingPopup: React.FC<LoadingPopupProps> = ({ isOpen }) => {
  const [currentStep, setCurrentStep] = React.useState(0);
  const steps = [
    { icon: Scan, text: "Analyzing your product URL..." },
    { icon: QrCode, text: "Creating your custom QR code..." },
    { icon: LineChart, text: "Generating analytics preview..." }
  ];

  React.useEffect(() => {
    if (isOpen) {
      const interval = setInterval(() => {
        setCurrentStep(prev => (prev + 1) % steps.length);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-black/95 border border-orange-500/20 rounded-lg max-w-md w-full mx-4">
        <div className="p-6">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">
              🚀 Hang tight! We're preparing your personalized preview...
            </h2>
            <p className="text-gray-400">
              This will take just a few seconds (up to 20 seconds). Thanks for your patience!
            </p>
          </div>

          {/* Progress Animation */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
            </div>
          </div>

          {/* Steps */}
          <div className="space-y-4">
            {steps.map((step, index) => {
              const StepIcon = step.icon;
              return (
                <div 
                  key={index}
                  className={`flex items-center gap-3 transition-all duration-300 ${
                    index === currentStep ? 'text-orange-500' : 'text-gray-500'
                  }`}
                >
                  <StepIcon className={`w-5 h-5 ${
                    index === currentStep ? 'animate-pulse' : ''
                  }`} />
                  <span className={`${
                    index === currentStep ? 'text-white' : 'text-gray-500'
                  }`}>
                    {step.text}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingPopup;