import React from 'react';

interface LoadingStateProps {
  message?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ message = "Loading board information..." }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-choco-200 border-t-choco-600 rounded-full animate-spin"></div>
        <div className="text-choco-600 text-sm">{message}</div>
      </div>
    </div>
  );
};