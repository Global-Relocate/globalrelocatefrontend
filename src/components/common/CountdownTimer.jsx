import React, { useState, useEffect } from 'react';

const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 3,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 3); // 3 days from now

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

      if (distance < 0) {
        clearInterval(timer);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="grid grid-flow-col gap-2 text-center auto-cols-max">
      <div className="flex flex-col">
        <span className="font-mono text-lg font-medium text-[#5762D5]">
          {String(timeLeft.days).padStart(2, '0')}
        </span>
        <span className="text-[10px] text-[#5762D5]/60">days</span>
      </div>
      <div className="flex flex-col">
        <span className="font-mono text-lg font-medium text-[#5762D5]">
          {String(timeLeft.hours).padStart(2, '0')}
        </span>
        <span className="text-[10px] text-[#5762D5]/60">hours</span>
      </div>
      <div className="flex flex-col">
        <span className="font-mono text-lg font-medium text-[#5762D5]">
          {String(timeLeft.minutes).padStart(2, '0')}
        </span>
        <span className="text-[10px] text-[#5762D5]/60">min</span>
      </div>
      <div className="flex flex-col">
        <span className="font-mono text-lg font-medium text-[#5762D5]">
          {String(timeLeft.seconds).padStart(2, '0')}
        </span>
        <span className="text-[10px] text-[#5762D5]/60">sec</span>
      </div>
    </div>
  );
};

export default CountdownTimer; 