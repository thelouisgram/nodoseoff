import React from 'react'

const Loader = () => {
  return (
    <div className=' w-full h-[400px] flex items-center justify-center'>
      <div className="lds-ellipsis">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
    </div>
    </div>
  );
}

export default Loader
