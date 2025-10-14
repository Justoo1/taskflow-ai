'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface BillingToggleProps {
  interval: 'monthly' | 'yearly';
  onIntervalChange: (interval: 'monthly' | 'yearly') => void;
  discountPercentage?: number;
}

export const BillingToggle = ({
  interval,
  onIntervalChange,
  discountPercentage = 20,
}: BillingToggleProps) => {
  return (
    <div className="flex items-center justify-center gap-4">
      <Button
        variant={interval === 'monthly' ? 'default' : 'outline'}
        onClick={() => onIntervalChange('monthly')}
        className={`px-6 py-2 rounded-lg font-semibold transition-all ${
          interval === 'monthly'
            ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-lg'
            : 'hover:bg-gray-100 dark:hover:bg-gray-800'
        }`}
      >
        Monthly
      </Button>
      <Button
        variant={interval === 'yearly' ? 'default' : 'outline'}
        onClick={() => onIntervalChange('yearly')}
        className={`px-6 py-2 rounded-lg font-semibold transition-all relative ${
          interval === 'yearly'
            ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-lg'
            : 'hover:bg-gray-100 dark:hover:bg-gray-800'
        }`}
      >
        Yearly
        <Badge className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full border-0">
          Save {discountPercentage}%
        </Badge>
      </Button>
    </div>
  );
};