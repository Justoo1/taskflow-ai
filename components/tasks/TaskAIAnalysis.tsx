// components/tasks/TaskAIAnalysis.tsx
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Loader2, Clock, Target, Lightbulb, Tag } from 'lucide-react';
import { analyzeTaskWithAI } from '@/actions/ai';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

interface TaskAnalysis {
  priority: 'low' | 'medium' | 'high' | 'urgent';
  estimatedTime: string;
  subtasks: string[];
  tips: string[];
  category: string;
}

interface TaskAIAnalysisProps {
  taskId: string;
  taskTitle: string;
  taskDescription?: string | null;
}

const priorityColors = {
  low: 'bg-green-100 text-green-800 border-green-300 dark:bg-green-900/30 dark:text-green-400 dark:border-green-700',
  medium: 'bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-700',
  high: 'bg-orange-100 text-orange-800 border-orange-300 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-700',
  urgent: 'bg-red-100 text-red-800 border-red-300 dark:bg-red-900/30 dark:text-red-400 dark:border-red-700',
};

export default function TaskAIAnalysis({ taskId, taskTitle, taskDescription }: TaskAIAnalysisProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<TaskAnalysis | null>(null);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    try {
      const result = await analyzeTaskWithAI(taskId);
      setAnalysis(result);
      toast.success('Task analyzed successfully!');
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Failed to analyze task');
      }
      console.error(error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <Card className="border-2 border-purple-200 dark:border-purple-800 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
        <CardTitle className="flex items-center gap-2">
          <div className="p-2 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          AI Task Analysis
        </CardTitle>
        <CardDescription>
          Get intelligent insights and suggestions for this task
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <AnimatePresence mode="wait">
          {!analysis ? (
            <motion.div
              key="analyze-button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="text-center py-8">
                <div className="mb-6">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 rounded-2xl flex items-center justify-center">
                    <Sparkles className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Analyze &ldquo;{taskTitle}&rdquo;
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                  Let AI help you break down this task, estimate time, and provide productivity tips
                </p>
                <Button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold"
                  size="lg"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Analyzing with AI...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-5 w-5" />
                      Analyze Task with AI
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="analysis-results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Priority Suggestion */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  <Target className="h-4 w-4 text-purple-600" />
                  Priority Suggestion
                </div>
                <Badge className={`${priorityColors[analysis.priority]} border-2 font-semibold px-4 py-1 text-sm`}>
                  {analysis.priority.charAt(0).toUpperCase() + analysis.priority.slice(1)} Priority
                </Badge>
              </div>

              {/* Estimated Time */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  <Clock className="h-4 w-4 text-purple-600" />
                  Estimated Time
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-lg p-3">
                  <p className="text-sm font-medium text-blue-900 dark:text-blue-300">
                    {analysis.estimatedTime}
                  </p>
                </div>
              </div>

              {/* Category */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  <Tag className="h-4 w-4 text-purple-600" />
                  Suggested Category
                </div>
                <Badge variant="outline" className="border-2 px-3 py-1">
                  {analysis.category}
                </Badge>
              </div>

              {/* Suggested Subtasks */}
              {analysis.subtasks && analysis.subtasks.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    <Sparkles className="h-4 w-4 text-purple-600" />
                    Suggested Subtasks
                  </div>
                  <div className="space-y-2">
                    {analysis.subtasks.map((subtask, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700 transition-colors"
                      >
                        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-purple-600 text-white text-xs font-bold flex-shrink-0 mt-0.5">
                          {index + 1}
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                          {subtask}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Productivity Tips */}
              {analysis.tips && analysis.tips.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    <Lightbulb className="h-4 w-4 text-purple-600" />
                    Productivity Tips
                  </div>
                  <div className="space-y-2">
                    {analysis.tips.map((tip, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 + 0.2 }}
                        className="flex items-start gap-3 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800"
                      >
                        <Lightbulb className="h-4 w-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                          {tip}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <Button
                  variant="outline"
                  onClick={() => setAnalysis(null)}
                  className="w-full border-2"
                >
                  Analyze Again
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}