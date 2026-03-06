// pages/create-branch/components/StatsOverview.tsx
import React from 'react';
import { GitBranch, TrendingUp, Target, Users } from 'lucide-react';
import { getUniqueTeamMembersCount, getTotalCards } from '@/src/app/utils/create-branch.utils';
import { BoardBranch } from '@/src/app/lib/projectService';

interface StatsOverviewProps {
  branches: BoardBranch[];
  totalProgress: number;
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({ branches, totalProgress }) => {
  const stats = [
    {
      title: "Total Branches",
      value: branches.length,
      icon: <GitBranch className="w-6 h-6" />,
      iconBg: "bg-choco-100",
      iconColor: "text-choco-600"
    },
    {
      title: "Total Progress",
      value: `${totalProgress}%`,
      icon: <TrendingUp className="w-6 h-6" />,
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600"
    },
    {
      title: "Total Cards",
      value: getTotalCards(branches),
      icon: <Target className="w-6 h-6" />,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600"
    },
    {
      title: "Team Members",
      value: getUniqueTeamMembersCount(branches),
      icon: <Users className="w-6 h-6" />,
      iconBg: "bg-amber-100",
      iconColor: "text-amber-600"
    }
  ];

  return (
    <div className="mb-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white border border-gray-200 rounded-xl p-5">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl ${stat.iconBg} flex items-center justify-center`}>
                <div className={stat.iconColor}>{stat.icon}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">{stat.title}</div>
                <div className="text-2xl font-semibold text-gray-900">{stat.value}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};