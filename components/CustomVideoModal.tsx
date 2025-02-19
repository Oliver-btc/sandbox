import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface CustomVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string;
  title?: string;
}

const CustomVideoModal: React.FC<CustomVideoModalProps> = ({ 
  isOpen, 
  onClose, 
  videoUrl, 
  title = "Product Demo" 
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal - adjusted for mobile video format */}
      <div className="relative bg-neutral-900 rounded-lg w-full max-w-[400px] mx-4 overflow-hidden border border-orange-500/20">
        {/* Header */}
        <div className="p-4 flex items-center justify-between border-b border-orange-500/20">
          <h2 className="text-xl font-bold text-white">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-1"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        {/* Content - adjusted aspect ratio for mobile video */}
        <div className="p-4">
          <div className="aspect-[9/16] w-full">
            <iframe
              className="w-full h-full rounded-lg"
              src={videoUrl}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomVideoModal;