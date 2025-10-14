'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FAQItemProps {
  question: string;
  answer: string;
}

export const FAQItem = ({ question, answer }: FAQItemProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 dark:border-gray-700 last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-6 flex items-center justify-between text-left hover:text-blue-600 dark:hover:text-blue-400 transition-colors group"
      >
        <span className="text-lg font-semibold text-gray-900 dark:text-white pr-8">
          {question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 flex items-center justify-center transition-colors"
        >
          <ChevronDown className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="pb-6 pr-12">
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {answer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};