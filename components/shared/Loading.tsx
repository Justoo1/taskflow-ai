'use client';

import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export const LoadingState = ({ message = 'Loading...' }: { message?: string }) => {
  return (
    <motion.div
      className="flex flex-col items-center justify-center py-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
      <p className="text-sm text-gray-500 dark:text-gray-400">{message}</p>
    </motion.div>
  );
};