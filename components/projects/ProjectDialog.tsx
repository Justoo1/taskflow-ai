'use client';

import React, { useState, useEffect } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { createProject, updateProject, generateAIProjectPlan } from '@/actions/projects';

interface Project {
  id: string;
  name: string;
  description: string | null;
  color: string;
}

interface ProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project?: Project | null;
  onSuccess?: () => void;
}

const PRESET_COLORS = [
  '#3B82F6', // Blue
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#F59E0B', // Amber
  '#10B981', // Green
  '#EF4444', // Red
  '#06B6D4', // Cyan
  '#6366F1', // Indigo
];

const ProjectDialog: React.FC<ProjectDialogProps> = ({
  open,
  onOpenChange,
  project,
  onSuccess,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('#3B82F6');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);

  useEffect(() => {
    if (project) {
      setName(project.name);
      setDescription(project.description || '');
      setColor(project.color);
    } else {
      setName('');
      setDescription('');
      setColor('#3B82F6');
    }
  }, [project, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error('Project name is required');
      return;
    }

    try {
      setIsSubmitting(true);

      if (project) {
        await updateProject(project.id, {
          name: name.trim(),
          description: description.trim() || undefined,
          color,
        });
        toast.success('Project updated successfully');
      } else {
        await createProject({
          name: name.trim(),
          description: description.trim() || undefined,
          color,
        });
        toast.success('Project created successfully');
      }

      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      console.error('Error saving project:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to save project');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGenerateAIPlan = async () => {
    if (!name.trim()) {
      toast.error('Please enter a project name first');
      return;
    }

    try {
      setIsGeneratingPlan(true);
      const plan = await generateAIProjectPlan(name, description);
      
      // Format the plan for display
      const formattedPlan = plan.phases
        .map((phase) => `${phase.name}:\n${phase.tasks.map((t) => `- ${t}`).join('\n')}`)
        .join('\n\n');
      
      toast.success('AI plan generated! Check the description field.');
      setDescription(formattedPlan);
    } catch (error) {
      console.error('Error generating plan:', error);
      toast.error(
        error instanceof Error ? error.message : 'Failed to generate AI plan'
      );
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {project ? 'Edit Project' : 'Create New Project'}
          </DialogTitle>
          <DialogDescription>
            {project
              ? 'Update your project details below.'
              : 'Create a new project to organize your tasks.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Project Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Project Name *</Label>
            <Input
              id="name"
              placeholder="Enter project name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={100}
              required
            />
          </div>

          {/* Project Description */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="description">Description</Label>
              {!project && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleGenerateAIPlan}
                  disabled={isGeneratingPlan || !name.trim()}
                  className="text-xs"
                >
                  {isGeneratingPlan ? (
                    <>
                      <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-3 w-3 mr-1" />
                      AI Plan
                    </>
                  )}
                </Button>
              )}
            </div>
            <Textarea
              id="description"
              placeholder="Describe your project (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="resize-none"
            />
          </div>

          {/* Color Picker */}
          <div className="space-y-2">
            <Label>Project Color</Label>
            <div className="flex flex-wrap gap-2">
              {PRESET_COLORS.map((presetColor) => (
                <button
                  key={presetColor}
                  type="button"
                  onClick={() => setColor(presetColor)}
                  className={`h-10 w-10 rounded-lg transition-all hover:scale-110 ${
                    color === presetColor
                      ? 'ring-2 ring-offset-2 ring-gray-900 dark:ring-gray-100'
                      : ''
                  }`}
                  style={{ backgroundColor: presetColor }}
                  aria-label={`Select color ${presetColor}`}
                />
              ))}
              <label
                className="h-10 w-10 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center cursor-pointer hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
                title="Custom color"
              >
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="sr-only"
                />
                <span className="text-xs text-gray-500">+</span>
              </label>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !name.trim()}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {project ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                <>{project ? 'Update Project' : 'Create Project'}</>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectDialog;