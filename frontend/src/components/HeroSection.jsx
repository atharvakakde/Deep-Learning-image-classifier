import React from 'react';

export default function HeroSection() {
  return (
    <section className="w-full pt-12 pb-8 flex flex-col items-center text-center">
      <div className="w-48 h-48 sm:w-64 sm:h-64 mb-6 shadow-soft rounded-[24px] overflow-hidden bg-white hover:scale-[1.02] transition-transform duration-300">
        <img 
          src="/hero_illustration.png" 
          alt="Cute fluffy AI pets" 
          className="w-full h-full object-cover"
        />
      </div>
      <h1 className="text-4xl sm:text-5xl font-bold text-textMain mb-4">
        Smart Image Classification
      </h1>
      <p className="text-lg text-textMuted max-w-xl mx-auto font-medium">
        Upload an image and let our friendly AI identify it instantly!
      </p>
    </section>
  );
}
