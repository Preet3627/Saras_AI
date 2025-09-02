
import React, { useState } from 'react';
import { ClipboardIcon, CheckIcon } from './Icons';

interface CodeBlockProps {
  code: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ code }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-gray-900/70 rounded-md overflow-hidden border border-gray-700 relative">
      <div className="flex justify-between items-center px-4 py-2 bg-gray-800/50 border-b border-gray-700">
        <span className="text-xs font-sans text-gray-400">Python Example</span>
        <button
          onClick={handleCopy}
          className="flex items-center text-xs text-gray-400 hover:text-white transition-colors"
        >
          {copied ? (
            <>
              <CheckIcon className="h-4 w-4 mr-1 text-green-400" />
              Copied!
            </>
          ) : (
            <>
              <ClipboardIcon className="h-4 w-4 mr-1" />
              Copy code
            </>
          )}
        </button>
      </div>
      <pre className="p-4 text-sm overflow-x-auto">
        <code className="font-mono text-cyan-300">{code}</code>
      </pre>
    </div>
  );
};
