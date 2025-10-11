'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sparkles, Loader2, ArrowRight } from 'lucide-react';
import { generateAIProjectPlan } from '@/actions/ai';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

interface Phase {
  name: string;
  tasks: string[];
}

interface ProjectPlan {
  phases: Phase[];
}

export default function ProjectAIPlanning({ onCreateProject }: { onCreateProject?: (plan: ProjectPlan, name: string, description: string) => void }) {
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [plan, setPlan] = useState<ProjectPlan | null>(null);

  const handleGenerate = async () => {
    if (!projectName.trim() || !projectDescription.trim()) {
      toast.error('Please provide project name and description');
      return;
    }

    setIsGenerating(true);
    try {
      const result = await generateAIProjectPlan(projectName, projectDescription);
      setPlan(result);
      toast.success('Project plan generated successfully!');
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Failed to generate project plan');
      }
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCreateProject = () => {
    if (plan && onCreateProject) {
      onCreateProject(plan, projectName, projectDescription);
    }
  };

  const handleReset = () => {
    setPlan(null);
    setProjectName('');
    setProjectDescription('');
  };

  return (
    <Card className="border-2 border-purple-200 dark:border-purple-800 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
        <CardTitle className="flex items-center gap-2">
          <div className="p-2 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          AI Project Planning
        </CardTitle>
        <CardDescription>
          Generate a detailed project breakdown with intelligent task suggestions
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 pt-6">
        <AnimatePresence mode="wait">
          {!plan ? (
            <motion.div
              key="input-form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="project-name" className="text-sm font-semibold">
                  Project Name
                </Label>
                <Input
                  id="project-name"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="e.g., Mobile App Redesign"
                  className="border-2 focus:border-purple-500"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="project-description" className="text-sm font-semibold">
                  Project Description
                </Label>
                <Textarea
                  id="project-description"
                  value={projectDescription}
                  onChange={(e) => setProjectDescription(e.target.value)}
                  placeholder="Describe your project goals, requirements, and any specific details..."
                  rows={5}
                  className="border-2 focus:border-purple-500 resize-none"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Be as detailed as possible for better AI suggestions
                </p>
              </div>
              
              <Button
                onClick={handleGenerate}
                disabled={isGenerating || !projectName.trim() || !projectDescription.trim()}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold"
                size="lg"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Generating AI Plan...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-5 w-5" />
                    Generate AI Plan
                  </>
                )}
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="plan-results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg p-4 border-2 border-purple-200 dark:border-purple-800">
                <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-2">
                  {projectName}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {projectDescription}
                </p>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-semibold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                  <ArrowRight className="h-5 w-5 text-purple-600" />
                  Suggested Project Phases
                </h4>
                
                {plan.phases.map((phase, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="border-2 border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:border-purple-300 dark:hover:border-purple-700 transition-colors bg-white dark:bg-gray-800"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 text-white font-bold text-sm">
                        {index + 1}
                      </div>
                      <h5 className="font-semibold text-purple-700 dark:text-purple-400 text-lg">
                        {phase.name}
                      </h5>
                    </div>
                    
                    <ul className="space-y-2 ml-11">
                      {phase.tasks.map((task, taskIndex) => (
                        <li
                          key={taskIndex}
                          className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300"
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-purple-600 mt-1.5 flex-shrink-0" />
                          <span>{task}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </div>
              
              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={handleReset}
                  className="flex-1 border-2"
                >
                  Generate New Plan
                </Button>
                <Button
                  onClick={handleCreateProject}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold"
                >
                  Create Project
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}