import React from "react";
import { Stat } from "@/src/app/types/dashboard";
import { TrendingUp, TrendingDown } from "lucide-react";

interface StatsSectionProps {
  stats: Stat[];
}

export const StatsSection: React.FC<StatsSectionProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat) => {
        const isPositive = stat.change.startsWith('+');
        return (
          <div 
            key={stat.id} 
            className="bg-white border border-gray-200 rounded-lg p-4"
          >
            <div className="text-sm text-gray-600 mb-1">{stat.label}</div>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-semibold text-gray-900">
                {stat.value}
              </div>
              {stat.change && (
                <div 
                  className={`flex items-center gap-1 text-sm px-2 py-1 rounded ${
                    isPositive 
                      ? 'bg-green-50 text-green-700' 
                      : 'bg-red-50 text-red-700'
                  }`}
                >
                  {isPositive ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  {stat.change}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};