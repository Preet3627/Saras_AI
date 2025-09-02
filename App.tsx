
import React from 'react';
import { STEPS } from './constants';
import { StepCard } from './components/StepCard';
import { LogoIcon } from './components/Icons';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900/20 to-gray-900 font-sans">
      <main className="container mx-auto px-4 py-8 md:py-12">
        <header className="text-center mb-12">
          <div className="inline-flex items-center justify-center bg-gray-800 p-4 rounded-full shadow-lg mb-4">
            <LogoIcon className="h-16 w-16 text-cyan-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
            RASPBOT V2: Saras AI Upgrade Guide
          </h1>
          <p className="mt-4 text-lg text-gray-400 max-w-3xl mx-auto">
            A complete walkthrough to empower your robot with Gemini AI, custom voice commands, and intelligent behaviors.
          </p>
        </header>

        <div className="space-y-6 max-w-4xl mx-auto">
          {STEPS.map((step, index) => (
            <StepCard key={step.id} step={step} index={index} />
          ))}
        </div>

        <footer className="text-center mt-16 text-gray-500">
            <p>&copy; 2024 Saras AI Project. Guide for educational purposes.</p>
            <p className="mt-1 text-sm">Developed for PM SHRI PRATHMIK VIDHYAMANDIR PONSRI.</p>
        </footer>
      </main>
    </div>
  );
};

export default App;
