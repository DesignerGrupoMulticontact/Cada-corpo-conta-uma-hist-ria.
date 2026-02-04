import * as React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-transparent h-20 flex items-center justify-between px-6 md:px-16 lg:px-24 pointer-events-none">
      <div className="flex items-center pointer-events-auto">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img 
          src="https://res.cloudinary.com/dlmyres0i/image/upload/v1765550460/logomain_ic3pg3.png" 
          alt="MyFormula Logo" 
          className="h-7 w-auto object-contain drop-shadow-sm"
        />
      </div>
    </header>
  );
};