import React from 'react'
import { regimenProps } from '../../../../../types/dashboardDrugs';

const Regimen: React.FC<regimenProps> = ({renderedDrugs , drugs }) => {
  return (
    <div>
      {drugs.length > 0 ? (
        <div className="w-full grid grid-cols-2 md:grid-cols-3 md:px-0 gap-4">
          {renderedDrugs}{" "}
        </div>
      ) : (
        <div className="w-full h-[400px] flex justify-center items-center">
          {" "}
          <h1 className="text-[20px] text-navyBlue font-semibold font-montserrant text-center opacity-30">
            Add a drug to get started!
          </h1>
        </div>
      )}
    </div>
  );
}

export default Regimen
