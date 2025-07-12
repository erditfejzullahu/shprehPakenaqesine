import React from 'react';

interface CTAButtonProps {
  text: string;
  primary?: boolean;
  onClick?: () => void;
  isLoading?: boolean;
}

const CTAButton: React.FC<CTAButtonProps> = ({ text, primary = false, onClick, isLoading }) => {
  const baseClasses = "px-6 py-3 rounded-lg font-semibold transition-all";
  const primaryClasses = "bg-indigo-600 text-white hover:bg-indigo-700";
  const secondaryClasses = "border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50";
  
  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      className={`${baseClasses} cursor-pointer ${primary ? primaryClasses : secondaryClasses}`}
    >
      {text}
    </button>
  );
};

export default CTAButton;