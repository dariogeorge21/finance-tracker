import React from 'react';

export function Footer() {
  return (
    <footer className="py-8 bg-gradient-to-r from-slate-100 to-slate-200 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-gray-600 text-sm">
          Made with 💚 by {' '}
          <a 
            href="https://github.com/dariogeorge21" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-emerald-600 hover:text-emerald-700 font-medium transition-colors duration-200"
            aria-label="Visit Dario George's GitHub profile"
          >
            Dario George
          </a>
        </p>
      </div>
    </footer>
  );
}