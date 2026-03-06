import React from "react";
import { Sunrise, Sun, Moon } from "lucide-react";
import { useGreeting } from "@/src/app/hooks/useGreeting";

export const WelcomeSection: React.FC = () => {
  const { greeting } = useGreeting();

  // Get icon based on current time
  const getTimeIcon = () => {
    const hour = new Date().getHours();
    if (hour < 12) {
      return <Sunrise className="w-4 h-4" />;
    } else if (hour < 18) {
      return <Sun className="w-4 h-4" />;
    } else {
      return <Moon className="w-4 h-4" />;
    }
  };

  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-2">
        {getTimeIcon()}
        <h1 className="text-2xl font-semibold text-gray-900">{greeting}</h1>
      </div>
      <p className="text-gray-600">Welcome back. Here's your overview.</p>
    </div>
  );
};