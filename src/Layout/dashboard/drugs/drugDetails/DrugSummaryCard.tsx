import React, { useEffect, useState } from 'react';
import { Activity, Beaker, CheckCircle, Clock, LucideIcon } from 'lucide-react';

interface DrugSummaryCardProps {
  drug: string;
  tab: string;
  route: string;
  compliance: number;
}

interface StatusConfig {
  color: string;
  bg: string;
  Icon: LucideIcon;
  name: string;
}

type StatusMap = Record<string, StatusConfig>;

const DrugSummaryCard: React.FC<DrugSummaryCardProps> = ({ drug, tab, route, compliance }) => {
  const defaultStatus: StatusConfig = {
    color: 'text-gray-500',
    bg: 'bg-white',
    Icon: Clock,
    name: tab
  };

  const statusMap: StatusMap = {
    Ongoing: {
      color: 'text-green-600',
      bg: 'bg-green-50',
      Icon: Activity,
      name: 'Active'
    },
    Completed: {
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      Icon: CheckCircle,
      name: 'Complete'
    },
    Allergies: {
      color: 'text-red-600',
      bg: 'bg-red-50',
      Icon: Beaker,
      name: 'Allergy'
    }
  };

  const statusConfig: StatusConfig = statusMap[tab] || defaultStatus;

  // Animate compliance number
  const [displayCompliance, setDisplayCompliance] = useState(0);
  useEffect(() => {
    let start = 0;
    const duration = 800;
    const stepTime = Math.abs(Math.floor(duration / compliance));
    const interval = setInterval(() => {
      start += 1;
      if (start >= compliance) {
        start = compliance;
        clearInterval(interval);
      }
      setDisplayCompliance(start);
    }, stepTime);
    return () => clearInterval(interval);
  }, [compliance]);

  return (
    <div
      className={`w-full ss:w-[500px] rounded-3xl border border-gray-200 shadow-sm overflow-hidden mb-8 font-Inter transition-all duration-300`}
    >
      {/* Header with Status Badge */}
     <div className={`px-8 py-6 border-b border-gray-100 flex justify-between items-center ${statusConfig.bg}`}>
  <div className="flex items-center gap-3">
    {/* Universal pill badge for any tab */}
    <span
      className={`px-3 py-1 text-xs font-semibold rounded-full uppercase
        ${tab === 'ongoing' ? 'text-green-600 bg-green-200' : ''}
        ${tab === 'completed' ? 'text-blue-700 bg-blue-200' : ''}
        ${tab === 'allergies' ? 'text-red-700 bg-red-200' : ''}
        ${tab !== 'ongoing' && tab !== 'completed' && tab !== 'allergies' ? 'text-gray-700 bg-gray-200' : ''}
      `}
    >
      {statusConfig.name}
    </span>

    {/* Small pulse dot next to badge for extra visual flair */}
    <div className={`w-3 h-3 rounded-full ${statusConfig.color.replace('text-', 'bg-')} animate-pulse`}></div>
  </div>
</div>

      {/* Content Grid */}
      <div className="grid grid-cols-2 gap-px bg-gray-100">
        {/* Route */}
        <div className="bg-white px-8 py-6 transition-all hover:bg-gray-50">
          <div className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Route</span>
            <span className="text-xl font-bold text-gray-900 capitalize">{route || 'N/A'}</span>
          </div>
        </div>

        {/* Compliance */}
        <div className="bg-white px-8 py-6 transition-all hover:bg-gray-50">
          <div className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Compliance</span>
            <div className="flex items-baseline gap-2">
              <span
                className={`text-3xl font-black ${
                  displayCompliance >= 80
                    ? 'text-green-600'
                    : displayCompliance >= 60
                    ? 'text-yellow-600'
                    : 'text-red-600'
                } transition-colors duration-500`}
              >
                {displayCompliance.toFixed(0)}
              </span>
              <span className="text-lg font-bold text-gray-500">%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-gray-200 mt-2 overflow-hidden">
              <div
                className={`h-full rounded-full ${
                  displayCompliance >= 80
                    ? 'bg-green-500'
                    : displayCompliance >= 60
                    ? 'bg-yellow-400'
                    : 'bg-red-500'
                } transition-all duration-500`}
                style={{ width: `${displayCompliance}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DrugSummaryCard;
