import React from 'react';
import { Loader2, QrCode, Scan, LineChart, CheckCircle2 } from 'lucide-react';

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

  const getStepStatus = (index: number) => {
    if (index < currentStep) return 'completed';
    if (index === currentStep) return 'current';
    return 'pending';
  };

  const getStepStyles = (status: 'completed' | 'current' | 'pending') => {
    switch (status) {
      case 'completed':
        return 'text-green-400';
      case 'current':
        return 'text-orange-500';
      case 'pending':
        return 'text-gray-500';
    }
  };

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
              const status = getStepStatus(index);
              const stepStyle = getStepStyles(status);
              
              return (
                <div 
                  key={index}
                  className={`flex items-center gap-3 transition-all duration-300 ${stepStyle}`}
                >
                  {status === 'completed' ? (
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-400" />
                    </div>
                  ) : (
                    <StepIcon className={`w-5 h-5 ${
                      status === 'current' ? 'animate-pulse' : ''
                    }`} />
                  )}
                  
                  <span className="flex-1">{step.text}</span>
                  
                  {/* Status indicator */}
                  <span className="text-sm">
                    {status === 'completed' && '✓'}
                    {status === 'current' && (
                      <span className="inline-block animate-pulse">...</span>
                    )}
                  </span>
                </div>
              );
            })}
          </div>
          
          {/* Progress bar */}
          <div className="mt-6 bg-gray-800 rounded-full h-1.5 overflow-hidden">
            <div 
              className="h-full bg-orange-500 transition-all duration-300 ease-out"
              style={{ 
                width: `${((currentStep + 1) / steps.length) * 100}%`
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingPopup;