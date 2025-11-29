// components/DrugDetailsGrid.tsx
import React from 'react';
import { Clock, Calendar, Repeat, Droplet, Users, Target } from 'lucide-react';

interface Detail {
  name: string;
  details: string | number;
}

interface DrugDetailsGridProps {
  details: Detail[];
}

// Map detail names to appropriate colors and icons
const getIcon = (name: string) => {
  switch (name.toLowerCase()) {
    case 'frequency':
      return <Repeat className="w-6 h-6 text-indigo-600" />; // primary
    case 'time':
      return <Clock className="w-6 h-6 text-green-600" />; // ongoing/active
    case 'duration':
      return <Calendar className="w-6 h-6 text-orange-500" />; // warning
    case 'reminder':
      return <Target className="w-6 h-6 text-teal-500" />; // info
    case 'start date':
      return <Calendar className="w-6 h-6 text-green-400" />; // neutral

    case 'end date':
      return <Calendar className="w-6 h-6 text-red-400" />; // neutral
    case 'total doses':
      return <Droplet className="w-6 h-6 text-blue-600" />; // info
    case 'completed doses':
      return <Droplet className="w-6 h-6 text-green-600" />; // success
    case 'missed doses':
      return <Droplet className="w-6 h-6 text-red-600" />; // danger
    case 'remaining doses':
      return <Droplet className="w-6 h-6 text-yellow-600" />; // warning
    default:
      return <Users className="w-6 h-6 text-gray-400" />; // fallback
  }
};

const DrugDetailsGrid: React.FC<DrugDetailsGridProps> = ({ details }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-10 pb-32 md:pb-20">
      {details.map((detail, index) => (
        <div
          key={index}
          className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden transition-all duration-300  hover:border-gray-300"
        >
          {/* Header with icon and label */}
          <div className="flex items-center gap-4 px-6 py-5 border-b border-gray-100">
            <div className="p-2 rounded-full bg-gray-100">{getIcon(detail.name)}</div>
            <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
              {detail.name}
            </span>
          </div>

          {/* Content */}
          <div className="px-6 py-6">
            <span className="text-xl font-bold text-gray-900 capitalize">{detail.details}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DrugDetailsGrid;
