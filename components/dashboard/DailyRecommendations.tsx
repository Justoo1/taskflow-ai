'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, Loader2, RefreshCw, TrendingUp, Crown } from 'lucide-react';
import { getDailyAIRecommendations } from '@/actions/ai';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

interface DailyRecommendationsProps {
  plan: string;
}

interface CachedRecommendations {
  recommendations: string[];
  date: string; // Format: YYYY-MM-DD
  timestamp: number;
}

// Utility functions for localStorage caching
const CACHE_KEY = 'daily-ai-recommendations';

const getTodayDateString = (): string => {
  const today = new Date();
  return today.toISOString().split('T')[0]; // Returns YYYY-MM-DD
};

const getCachedRecommendations = (): CachedRecommendations | null => {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;

    const data: CachedRecommendations = JSON.parse(cached);
    const today = getTodayDateString();

    // Check if cached data is from today
    if (data.date === today) {
      return data;
    }

    // Cache is expired, remove it
    localStorage.removeItem(CACHE_KEY);
    return null;
  } catch (error) {
    console.error('Error reading cached recommendations:', error);
    return null;
  }
};

const saveCachedRecommendations = (recommendations: string[]): void => {
  try {
    const data: CachedRecommendations = {
      recommendations,
      date: getTodayDateString(),
      timestamp: Date.now(),
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving cached recommendations:', error);
  }
};

export default function DailyRecommendations({ plan }: DailyRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const isPro = plan !== 'FREE';

  const loadRecommendations = async (forceRefresh: boolean = false) => {
    if (!isPro) return;

    // Check cache first if not forcing refresh
    if (!forceRefresh) {
      const cached = getCachedRecommendations();
      if (cached) {
        setRecommendations(cached.recommendations);
        setLastUpdated(new Date(cached.timestamp));
        return;
      }
    }

    setIsLoading(true);
    try {
      const recs = await getDailyAIRecommendations();
      setRecommendations(recs);
      const now = new Date();
      setLastUpdated(now);

      // Save to cache
      saveCachedRecommendations(recs);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Failed to load recommendations');
      }
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isPro) {
      loadRecommendations();
    }
  }, [isPro]);

  if (!isPro) {
    return (
      <Card className="border-2 border-dashed border-gray-300 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
            <Sparkles className="h-5 w-5" />
            Daily AI Recommendations
          </CardTitle>
          <CardDescription>
            Upgrade to Pro to get personalized daily recommendations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <div className="mb-4">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 rounded-2xl flex items-center justify-center">
                <Crown className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              Pro Feature
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Get AI-powered daily task recommendations
            </p>
            <Link href="/pricing">
              <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold">
                <Crown className="mr-2 h-4 w-4" />
                Upgrade to Pro
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-purple-200 dark:border-purple-800 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <div className="p-2 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              Daily AI Recommendations
            </CardTitle>
            <CardDescription className="mt-1">
              {lastUpdated && (
                <span className="text-xs">
                  Updated {lastUpdated.toLocaleTimeString()}
                </span>
              )}
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => loadRecommendations(true)}
            disabled={isLoading}
            className="hover:bg-white/50 dark:hover:bg-gray-800/50"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-8"
            >
              <Loader2 className="h-8 w-8 animate-spin text-purple-600 mb-3" />
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Analyzing your tasks...
              </p>
            </motion.div>
          ) : recommendations.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-8"
            >
              <div className="mb-4">
                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 rounded-2xl flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                No tasks to analyze yet. Create some tasks to get AI recommendations!
              </p>
              <Link href="/tasks">
                <Button variant="outline">
                  Go to Tasks
                </Button>
              </Link>
            </motion.div>
          ) : (
            <motion.div
              key="recommendations"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-3"
            >
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-purple-600" />
                  Top priorities for today:
                </h4>
              </div>
              
              {recommendations.map((recommendation, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-3 p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg border-2 border-purple-200 dark:border-purple-800 hover:border-purple-300 dark:hover:border-purple-700 transition-colors"
                >
                  <div className="flex items-center justify-center w-7 h-7 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 text-white text-sm font-bold flex-shrink-0 mt-0.5 shadow-md">
                    {index + 1}
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                    {recommendation}
                  </p>
                </motion.div>
              ))}
              
              <div className="pt-4 border-t border-purple-200 dark:border-purple-800">
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                  💡 Focus on completing these high-priority tasks first
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}