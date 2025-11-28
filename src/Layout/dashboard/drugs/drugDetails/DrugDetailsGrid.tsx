import React from 'react'
import { Detail } from '../../../../../types/dashboard/drug';

interface DrugDetailsGridProps {
  details: Detail[];
}

const DrugDetailsGrid:React.FC<DrugDetailsGridProps> = ({details}) => {
    
     const RenderedDetails = details.map((detail: Detail, index: number) => {
    return (
      <div
        key={index}
        className="bg-white rounded-xl shadow-sm p-6 transition-all border border-gray-200"
      >
        {/* Card header - category label in blue */}
        <h2 className="text-xs font-medium uppercase tracking-wider text-blue-500 mb-1">
          {detail.name}
        </h2>
        {/* Card content - actual value in large text */}
        <h3 className="text-lg font-semibold capitalize text-gray-800">
          {detail.details}
        </h3>
      </div>
    );
  });
  return (
    <div className="grid ss:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {RenderedDetails}
      </div>
  )
}

export default DrugDetailsGrid