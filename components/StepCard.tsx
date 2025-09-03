import React, { useState } from 'react';
import type { Step } from '../types';
import { ChevronDownIcon } from './Icons';

interface StepCardProps {
  step: Step;
  index: number;
}

export const StepCard: React.FC<StepCardProps> = ({ step, index }) => {
  const [isOpen, setIsOpen] = useState(index === 0);
  const Icon = step.icon;

  return (
    <div className="bg-gray-800/40 border border-gray-700/50 rounded-lg overflow-hidden transition-all duration-300">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 text-left focus:outline-none"
        aria-expanded={isOpen}
        aria-controls={`step-content-${step.id}`}
      >
        <div className="flex items-center">
          <div className="flex-shrink-0 bg-gray-700 rounded-full h-8 w-8 flex items-center justify-center mr-4">
            <Icon className="h-5 w-5 text-cyan-400" />
          </div>
          <span className="font-semibold text-white">{`${index + 1}. ${step.title}`}</span>
        </div>
        <ChevronDownIcon
          className={`h-6 w-6 text-gray-400 transform transition-transform duration-300 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>
      {isOpen && (
        <div id={`step-content-${step.id}`} className="p-4 pt-0">
          <p className="text-gray-300 mb-4">{step.description}</p>
          {step.code && (
            <pre className="bg-black/50 p-4 rounded-md text-sm text-cyan-200 overflow-x-auto font-mono">
              <code>{step.code.trim()}</code>
            </pre>
          )}
        </div>
      )}
    </div>
  );
};
