'use client';

import { useState, useEffect } from 'react';

export function LiveCounter() {
  const [resumesCreated, setResumesCreated] = useState(48702);

  useEffect(() => {
    const interval = setInterval(() => {
      setResumesCreated((prev) => {
        const increment = Math.floor(Math.random() * 3) + 1;
        return prev + increment;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-2 mb-6">
      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
      <span className="text-sm text-gray-300">
        {resumesCreated.toLocaleString()} resumes created today
      </span>
    </div>
  );
}
