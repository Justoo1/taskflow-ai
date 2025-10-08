// components/dashboard/QuickActions.tsx
'use client';

import { Button } from '@/components/ui/button';
import { Plus, Sparkles, FolderPlus, Calendar, Users, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const QuickActions = () => {
  const actions = [
    {
      icon: Plus,
      label: 'New Task',
      description: 'Create a task',
      onClick: () => console.log('Create task'),
      gradient: 'from-blue-500 to-blue-600',
      hoverGradient: 'hover:from-blue-600 hover:to-blue-700',
    },
    {
      icon: FolderPlus,
      label: 'New Project',
      description: 'Start a project',
      onClick: () => console.log('Create project'),
      gradient: 'from-purple-500 to-purple-600',
      hoverGradient: 'hover:from-purple-600 hover:to-purple-700',
    },
    {
      icon: Sparkles,
      label: 'Ask AI',
      description: 'Get AI help',
      onClick: () => console.log('AI assistant'),
      gradient: 'from-amber-500 to-orange-600',
      hoverGradient: 'hover:from-amber-600 hover:to-orange-700',
    },
    {
      icon: Calendar,
      label: 'Schedule',
      description: 'Plan your day',
      onClick: () => console.log('Schedule'),
      gradient: 'from-green-500 to-emerald-600',
      hoverGradient: 'hover:from-green-600 hover:to-emerald-700',
    },
  ];

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 dark:from-blue-700 dark:via-purple-700 dark:to-indigo-800 rounded-2xl shadow-xl">
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative p-6 lg:p-8">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          {/* Left content */}
          <motion.div 
            className="space-y-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-2">
              <Zap className="w-6 h-6 text-yellow-300" />
              <h2 className="text-2xl lg:text-3xl font-bold text-white">
                Ready to be productive?
              </h2>
            </div>
            <p className="text-blue-100 dark:text-blue-200 max-w-2xl">
              Create tasks, start projects, or let AI help you plan your day efficiently
            </p>
          </motion.div>

          {/* Action buttons grid */}
          <motion.div 
            className="grid grid-cols-2 lg:grid-cols-4 gap-3 w-full lg:w-auto"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {actions.map((action, index) => (
              <motion.button
                key={action.label}
                onClick={action.onClick}
                className={`
                  group relative bg-white/10 dark:bg-white/5 backdrop-blur-sm rounded-xl p-4
                  hover:bg-white/20 dark:hover:bg-white/10 transition-all duration-300
                  border border-white/20 dark:border-white/10 hover:border-white/40 dark:hover:border-white/20
                  flex flex-col items-center gap-2 text-center
                  hover:scale-105 active:scale-95
                `}
                whileHover={{ y: -4 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <div className={`
                  p-3 rounded-lg bg-gradient-to-br ${action.gradient}
                  ${action.hoverGradient}
                  shadow-lg group-hover:shadow-xl transition-all duration-300
                `}>
                  <action.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-white text-sm">
                    {action.label}
                  </p>
                  <p className="text-xs text-blue-100 dark:text-blue-200 opacity-80 hidden lg:block">
                    {action.description}
                  </p>
                </div>

                {/* Hover glow effect */}
                <div className="absolute inset-0 rounded-xl bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
              </motion.button>
            ))}
          </motion.div>
        </div>

        {/* Quick stats bar */}
        <motion.div 
          className="mt-6 pt-6 border-t border-white/20 dark:border-white/10"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <div className="flex flex-wrap gap-6 text-white/90 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span>All systems operational</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>Team collaboration enabled</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span>AI assistant ready</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default QuickActions;