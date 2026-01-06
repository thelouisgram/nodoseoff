import React from "react";

const DrugsHeader: React.FC = () => {
  return (
    <div className="mb-7">
      <h1 className="text-2xl ss:text-3xl font-semibold font-karla text-slate-800 dark:text-slate-100">
        Drugs
      </h1>
      <p className="text-base text-gray-500 dark:text-slate-400">
        Manage medications wisely!
      </p>
    </div>
  );
};

export default DrugsHeader;
