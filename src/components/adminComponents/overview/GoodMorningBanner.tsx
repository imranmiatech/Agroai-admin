import React from 'react';


export const GoodMorningBanner: React.FC = () => {
  
  

  return (
    <div 
      className="rounded-2xl p-6 sm:p-7 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm"
      style={{
        background: 'linear-gradient(135deg, #062E35 0%, #0A434D 100%)'
      }}
    >
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          Good morning 👋
        </h1>
        <p className="text-[#9DB9BF] text-sm mt-1">
          Here's a snapshot of your platform today.
        </p>
      </div>

 
    </div>
  );
};
