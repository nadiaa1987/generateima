import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500 to-indigo-600 font-bold text-white shadow-lg shadow-primary-500/20">
            PM
          </div>
          <span className="text-xl font-bold tracking-tight text-white">
            Pixel<span className="text-primary-400">Morph</span>
          </span>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
          <a href="#" className="hover:text-primary-400 transition-colors">Features</a>
          <a href="#" className="hover:text-primary-400 transition-colors">Pricing</a>
          <a href="#" className="hover:text-primary-400 transition-colors">Docs</a>
        </nav>
        <div className="flex items-center gap-4">
          <button className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
            Sign In
          </button>
          <button className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition-transform hover:scale-105 hover:bg-slate-100 active:scale-95">
            Get Started
          </button>
        </div>
      </div>
    </header>
  );
};
