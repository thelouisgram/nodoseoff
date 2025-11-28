import React from 'react'
import { DrugProps } from '../../../../../types/dashboard/dashboard';

interface DrugSummaryCardProps{
    drugDetails: DrugProps;
    tab: string;
}

const DrugSummaryCard:React.FC<DrugSummaryCardProps> = ({drugDetails, tab, }) => {
  const { route } = drugDetails;
  

  return (
    <div className="w-full bg-white rounded-xl  border border-gray-200 mb-8 overflow-hidden flex flex-col md:flex-row">
          {" "}
          {/* Status & Route */}
          <div className="flex flex-col flex-1 p-6 md:border-r border-gray-200">
            <div className="mb-4">
              <h2 className="text-sm font-medium uppercase tracking-wider text-gray-500 mb-1">
                Status
              </h2>
              <div className="flex items-center gap-2">
                <h3
                  className={`text-lg font-semibold capitalize px-3 py-1 rounded-full`}
                >
                  {tab}
                </h3>
                <div className={`w-3 h-3 rounded-full`} />
              </div>
            </div>
            <div>
              <h2 className="text-sm font-medium uppercase tracking-wider text-gray-500 mb-1">
                Route Of Administration
              </h2>
              <h3 className="text-lg font-semibold capitalize text-slate-800">
                {route}
              </h3>
            </div>
          </div>
          
        </div>
  )
}

export default DrugSummaryCard