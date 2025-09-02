
import type React from 'react';

export interface Step {
  id: number;
  title: string;
  description: string;
  icon: React.FC<{ className?: string }>;
  code?: string;
}
