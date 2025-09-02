
import React, { useState } from 'react';
import type { Step } from '../types';
import { CodeBlock } from './CodeBlock';
import { ChevronDownIcon } from './Icons';

interface StepCardProps {
  step: Step;
  index: number;
}

export const StepCard: React.FC<StepCardProps> = ({ step, index }) => {
  const [isOpen, setIsOpen] = useState(index === 0);

  return (
    <div className="border border-gray-700/50 bg-gray-800/40 rounded-lg shadow-lg backdrop-blur-sm transition-all duration-300 hover:border-cyan-400/50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6 text-left"
      >
        <div className="flex items-center">
          <div className="flex-shrink-0 h-12 w-12 rounded-full bg-gray-700 border-2 border-gray-600 flex items-center justify-center mr-5">
            <step.icon className="h-6 w-6 text-cyan-400" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-100">{step.title}</h2>
            <p className="text-sm text-gray-400">Step {step.id}</p>
          </div>
        </div>
        <ChevronDownIcon
          className={`h-6 w-6 text-gray-400 transition-transform duration-300 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out ${
          isOpen ? 'max-h-[2000px]' : 'max-h-0'
        }`}
      >
        <div className="px-6 pb-6 pt-0">
          <p className="text-gray-300 leading-relaxed whitespace-pre-line mb-6">{step.description}</p>
          {step.code && <CodeBlock code={step.code} />}
        </div>
      </div>
    </div>
  );
};
