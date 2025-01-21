import React from 'react';

const CounterBadge = ({ count }) => {
  if (!count) return null;
  
  return (
    <div className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center absolute -top-1 -right-1">
      {count}
    </div>
  );
};

export default CounterBadge;
