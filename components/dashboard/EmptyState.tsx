// components/dashboard/EmptyState.tsx
'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Plus, Sparkles, FolderPlus, Rocket } from 'lucide-react';
import { motion } from 'framer-motion';

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: 'tasks' | 'projects' | 'ai';
  actions?: Array<{
    label: string;
    onClick: () => void;
    variant?: 'default' | 'outline' | 'secondary';
    icon?: React.ElementType;
  }>;
}

const iconComponents = {
  tasks: Rocket,
  projects: FolderPlus,
  ai: Sparkles,
};

const EmptyState = ({
  title = 'No tasks yet',
  description = 'Get started by creating your first task',
  icon = 'tasks',
  actions = [
    {
      label: 'Create Task',
      onClick: () => console.log('Create task'),
      variant: 'default' as const,
      icon: Plus,
    },
  ],
}: EmptyStateProps) => {
  const IconComponent = iconComponents[icon];

  return (
    <Card className="border-2 border-dashed border-gray-300 bg-gray-50/50">
      <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', duration: 0.6 }}
          className="mb-6"
        >
          <div className="relative">
            {/* Main icon container */}
            <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center">
              <IconComponent className="w-10 h-10 text-blue-600" />
            </div>

            {/* Floating decoration */}
            <motion.div
              className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg flex items-center justify-center"
              animate={{
                y: [0, -8, 0],
                rotate: [0, 10, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <Sparkles className="w-4 h-4 text-white" />
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-2 mb-8"
        >
          <h3 className="text-xl font-bold text-gray-900">{title}</h3>
          <p className="text-gray-600 max-w-md">{description}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-wrap gap-3 justify-center"
        >
          {actions.map((action, index) => {
            const ActionIcon = action.icon;
            return (
              <Button
                key={index}
                variant={action.variant || 'default'}
                onClick={action.onClick}
                className="shadow-sm hover:shadow-md transition-shadow"
              >
                {ActionIcon && <ActionIcon className="w-4 h-4 mr-2" />}
                {action.label}
              </Button>
            );
          })}
        </motion.div>

        {/* Helpful tips */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 pt-8 border-t border-gray-200 w-full max-w-md"
        >
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Quick Tips
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1.5" />
              <p className="text-xs text-gray-600">
                Use keyboard shortcuts for faster task creation
              </p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-purple-600 rounded-full mt-1.5" />
              <p className="text-xs text-gray-600">
                Set priorities to stay focused on what matters
              </p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-green-600 rounded-full mt-1.5" />
              <p className="text-xs text-gray-600">
                Add due dates to track deadlines
              </p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 bg-orange-600 rounded-full mt-1.5" />
              <p className="text-xs text-gray-600">
                Let AI help break down complex tasks
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </Card>
  );
};

export default EmptyState;