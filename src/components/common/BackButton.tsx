import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface BackButtonProps {
  fallbackTab?: string;
  label?: string;
  className?: string;
  onClick?: () => void;
}

export const BackButton: React.FC<BackButtonProps> = ({
  fallbackTab,
  label = 'Back',
  className = '',
  onClick,
}) => {
  const { goBack } = useApp();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onClick) {
      onClick();
    } else {
      goBack(fallbackTab);
    }
  };

  return (
    <div className={`mb-4 ${className}`}>
      <button
        type="button"
        onClick={handleClick}
        aria-label={`Go back to previous page`}
        className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold text-[#252525] bg-white hover:bg-[#FFF0E3] hover:text-[#F58220] border border-[#252525]/10 hover:border-[#FFAB66]/50 rounded-lg shadow-2xs transition-all duration-200 group active:scale-95"
      >
        <ArrowLeft className="w-4 h-4 text-[#77716B] group-hover:text-[#F58220] group-hover:-translate-x-0.5 transition-all duration-200" />
        <span>{label}</span>
      </button>
    </div>
  );
};
