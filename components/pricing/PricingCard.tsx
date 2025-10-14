'use client';

import { Check, Crown, ArrowRight, Loader2, LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface PricingCardProps {
  name: string;
  price: number;
  interval?: string;
  description: string;
  features: string[];
  popular?: boolean;
  icon: LucideIcon;
  gradient: string;
  planKey: string;
  onUpgrade: (planKey: string) => void;
  isLoading?: boolean;
  currentPlan?: boolean;
}

export const PricingCard = ({
  name,
  price,
  interval = 'month',
  description,
  features,
  popular = false,
  icon: Icon,
  gradient,
  planKey,
  onUpgrade,
  isLoading = false,
  currentPlan = false,
}: PricingCardProps) => {
  const isFree = planKey === 'FREE';

  return (
    <Card
      className={`relative rounded-2xl border-2 transition-all duration-300 hover:scale-105 ${
        popular
          ? 'border-blue-500 dark:border-blue-400 shadow-2xl shadow-blue-500/20 dark:shadow-blue-400/20'
          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
      } overflow-hidden`}
    >
      {/* Popular Badge */}
      {popular && (
        <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2">
          <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg border-0">
            <Crown className="h-3 w-3" />
            MOST POPULAR
          </Badge>
        </div>
      )}

      <CardContent className="p-8">
        {/* Icon & Name */}
        <div className="flex items-center gap-3 mb-4">
          <div className={`p-3 rounded-xl bg-gradient-to-br ${gradient}`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              {name}
            </h3>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          {description}
        </p>

        {/* Price */}
        <div className="mb-6">
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-bold text-gray-900 dark:text-white">
              ${price}
            </span>
            {!isFree && (
              <span className="text-gray-500 dark:text-gray-400">
                /{interval}
              </span>
            )}
          </div>
          {isFree && (
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Forever free
            </span>
          )}
        </div>

        {/* CTA Button */}
        <Button
          onClick={() => onUpgrade(planKey)}
          disabled={isLoading || currentPlan}
          className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-200 ${
            popular
              ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl'
              : currentPlan
              ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white cursor-not-allowed'
              : 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100'
          }`}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin mr-2" />
              Processing...
            </>
          ) : currentPlan ? (
            'Current Plan'
          ) : (
            <>
              {isFree ? 'Get Started' : 'Upgrade Now'}
              {!isFree && <ArrowRight className="h-5 w-5 ml-2" />}
            </>
          )}
        </Button>

        {/* Features List */}
        <div className="mt-8 space-y-4">
          <p className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wide">
            What&#39;s included
          </p>
          <ul className="space-y-3">
            {features.map((feature, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <div
                  className={`flex-shrink-0 w-5 h-5 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center mt-0.5`}
                >
                  <Check className="h-3 w-3 text-white" />
                </div>
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {feature}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};