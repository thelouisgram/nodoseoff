import React, { useState, useEffect } from "react";

interface CounterProps {
  number: number ;
}

const Counter: React.FC<CounterProps> = ({ number }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (count < number) {
        setCount((prevCount) => prevCount + 1);
      } else {
        clearInterval(interval);
      }
    }, 100); // Change the interval time as needed

    // Cleanup function to clear the interval when component unmounts
    return () => clearInterval(interval);
  }, [count, number]); // Re-run effect if 'count' or 'number' changes

  return (
      <>{count}</>
  );
};

export default Counter;
