import React from 'react';
import { Link } from 'react-router-dom';
import { BrainCircuit } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="w-full bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-softGray">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="p-2 bg-lightBlue/20 rounded-xl group-hover:bg-lightBlue/30 transition-colors">
            <BrainCircuit className="w-5 h-5 text-lightBlue" />
          </div>
          <span className="font-bold text-lg text-textMain tracking-wide">
            VisionAI
          </span>
        </Link>
        <div className="flex items-center gap-8 font-medium text-sm text-textMuted">
          <Link to="/" className="text-textMain hover:text-lightBlue transition-colors">Home</Link>
          <Link to="/" className="hover:text-lightBlue transition-colors">About</Link>
          <Link to="/" className="hover:text-lightBlue transition-colors">Models</Link>
        </div>
      </div>
    </nav>
  );
}
