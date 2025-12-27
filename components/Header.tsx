
import React from 'react';
import { Calculator, BookOpen, Crown } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3 group cursor-default">
          <div className="bg-gradient-to-tr from-indigo-600 to-indigo-400 p-2.5 rounded-2xl shadow-lg shadow-indigo-100 group-hover:scale-110 transition-transform duration-300">
            <Calculator className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-black text-slate-900 tracking-tighter leading-none">MATH MENTOR</h1>
            <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest mt-0.5">Academic Edition</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="hidden sm:flex items-center text-[11px] font-bold text-slate-400 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
            <BookOpen className="w-3.5 h-3.5 mr-1.5 text-indigo-400" />
            <span>特级教师库</span>
          </div>
          <div className="flex items-center text-[11px] font-bold text-amber-600 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-100">
            <Crown className="w-3.5 h-3.5 mr-1.5" />
            <span>AI PRO</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
