
import React, { useEffect, useState } from 'react';
import { Droplets } from 'lucide-react';

const SplashScreen: React.FC = () => {
  const [fadeOut, setFadeOut] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div 
      className={`fixed inset-0 flex flex-col items-center justify-center bg-river z-50 transition-opacity duration-500 ease-in-out ${
        fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="flex flex-col items-center justify-center space-y-6">
        <Droplets className="h-20 w-20 text-river-blue-light animate-pulse" />
        <h1 className="text-4xl font-bold text-river-foreground">RiverWatcher</h1>
        <p className="text-river-blue-light">Real-time river monitoring system</p>
        
        <div className="w-48 h-1 bg-river-purple-dark/30 rounded-full overflow-hidden mt-8">
          <div className="h-full bg-river-blue-light animate-[flow_2s_ease-in-out_infinite]"></div>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
