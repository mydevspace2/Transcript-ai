import React from 'react';
import { Mic } from './Icons';

export const Header: React.FC = () => (
  <header className="text-center">
    <div className="flex items-center justify-center gap-4 mb-2">
      <Mic className="w-10 h-10 text-indigo-400" />
      <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">
        Transcript AI
      </h1>
    </div>
    <p className="text-lg text-gray-400">
      Turn your audio into viral social media content in seconds.
    </p>
  </header>
);