import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string | null;
  onCategorySelect: (category: string | null) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ categories, selectedCategory, onCategorySelect }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (category: string | null) => {
    onCategorySelect(category);
    setIsOpen(false);
  };

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="bg-black rounded-lg shadow-lg p-2">
        {/* Desktop version */}
        <div className="hidden md:flex flex-wrap justify-center gap-2">
          <FilterButton
            isSelected={selectedCategory === null}
            onClick={() => onCategorySelect(null)}
          >
            All
          </FilterButton>
          {categories.map((category) => (
            <FilterButton
              key={category}
              isSelected={selectedCategory === category}
              onClick={() => onCategorySelect(category)}
            >
              {category}
            </FilterButton>
          ))}
        </div>

        {/* Mobile dropdown */}
        <div className="md:hidden relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-full py-2 px-4 text-left bg-black text-white rounded-md flex justify-between items-center border border-gray-700"
          >
            <span>{selectedCategory || 'All'}</span>
            <ChevronDown className={`transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`} />
          </button>
          {isOpen && (
            <div className="absolute z-10 w-full mt-1 bg-black rounded-md shadow-lg border border-gray-700">
              <button
                className={`w-full py-2 px-4 text-left ${selectedCategory === null ? 'text-[#F7931A] font-bold' : 'text-white'} hover:bg-gray-900`}
                onClick={() => handleSelect(null)}
              >
                All
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  className={`w-full py-2 px-4 text-left ${selectedCategory === category ? 'text-[#F7931A] font-bold' : 'text-white'} hover:bg-gray-900`}
                  onClick={() => handleSelect(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const FilterButton: React.FC<{ children: React.ReactNode; isSelected: boolean; onClick: () => void }> = ({ children, isSelected, onClick }) => (
  <button
    onClick={onClick}
    
    className={`px-4 py-2 rounded-full text-sm transition-all duration-200 transform hover:scale-105 ${
      isSelected 
        ? 'text-[#F7931A] font-bold' 
        : 'text-gray-400 hover:text-[#F7931A] font-medium'
    }`}
  >
    {children}
  </button>
);

export default CategoryFilter;