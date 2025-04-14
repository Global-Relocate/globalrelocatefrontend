import { useState, useEffect } from 'react';
import { getSubscriptionDetails } from '@/services/api';

// Helper function to check if current route is a public route
const isPublicRoute = () => {
  const publicRoutes = ['/', '/login', '/signup', '/forgotpassword', '/resetpassword', '/verifymail', '/welcome', '/help', '/privacy', '/term'];
  const currentPath = window.location.pathname;
  
  // Check for exact matches
  if (publicRoutes.includes(currentPath)) {
    return true;
  }
  
  // Check for partial matches (like /help/some-article)
  return publicRoutes.some(route => 
    route !== '/' && currentPath.startsWith(route)
  );
};

const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let timer;
    
    const fetchSubscriptionAndStartTimer = async () => {
      // Skip API call on public routes
      if (isPublicRoute()) {
        // Set default values for public routes
        setTimeLeft({ days: 7, hours: 0, minutes: 0, seconds: 0 });
        setIsLoading(false);
        return;
      }
      
      try {
        const response = await getSubscriptionDetails();
        const remainingDays = response.data?.trial?.remainingDays || 0;
        
        if (remainingDays <= 0) {
          setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
          setIsLoading(false);
          return;
        }

        // Calculate target date based on remaining days
        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() + remainingDays);

        timer = setInterval(() => {
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

        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching subscription details:', error);
        setIsLoading(false);
      }
    };

    fetchSubscriptionAndStartTimer();

    return () => {
      if (timer) clearInterval(timer);
    };
  }, []);

  if (isLoading) {
    return <div className="animate-pulse">Loading...</div>;
  }

  // Don't show the timer if there's no time left
  if (timeLeft.days === 0 && timeLeft.hours === 0 && 
      timeLeft.minutes === 0 && timeLeft.seconds === 0) {
    return (
      <div className="text-center">
        <p className="text-gray-600">Trial period has ended</p>
      </div>
    );
  }

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