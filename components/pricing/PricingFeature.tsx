import { LucideIcon } from 'lucide-react';

interface PricingFeatureProps {
  icon: LucideIcon;
  title: string;
  description: string;
  gradient: string;
}

export const PricingFeature = ({
  icon: Icon,
  title,
  description,
  gradient,
}: PricingFeatureProps) => {
  return (
    <div className="text-center p-6 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
      <div
        className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg`}
      >
        <Icon className="h-8 w-8 text-white" />
      </div>
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
        {title}
      </h3>
      <p className="text-gray-600 dark:text-gray-400">{description}</p>
    </div>
  );
};