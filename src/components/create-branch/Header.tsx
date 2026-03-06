// pages/create-branch/components/Header.tsx
import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface HeaderProps {
  title: string;
  subtitle: string;
  onBack: () => void;
  onViewMainBoard: () => void;
}

export const Header: React.FC<HeaderProps> = ({ title, subtitle, onBack, onViewMainBoard }) => {
  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <button 
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
              <p className="text-gray-600 text-sm">{subtitle}</p>
            </div>
          </div>
          <button
            onClick={onViewMainBoard}
            className="px-4 py-2 bg-choco-600 text-white rounded-lg hover:bg-choco-700 transition-colors text-sm"
          >
            View Main Board
          </button>
        </div>
      </div>
    </div>
  );
};