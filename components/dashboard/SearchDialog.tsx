// components/dashboard/SearchDialog.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Search,
  FileText,
  Folder,
  Calendar,
  ArrowRight,
  Clock,
  Hash,
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Status, Priority } from '@prisma/client';

interface Task {
  id: string;
  title: string;
  description: string | null;
  status: Status;
  priority: Priority;
  dueDate: Date | null;
  project: {
    id: string;
    name: string;
    color?: string;
  } | null;
}

interface Project {
  id: string;
  name: string;
  description: string | null;
  color: string;
  _count?: {
    tasks: number;
  };
}

interface SearchResult {
  tasks: Task[];
  projects: Project[];
}

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult>({ tasks: [], projects: [] });
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setResults({ tasks: [], projects: [] });
      return;
    }

    const timer = setTimeout(() => {
      performSearch(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Reset on dialog close
  useEffect(() => {
    if (!open) {
      setQuery('');
      setResults({ tasks: [], projects: [] });
      setSelectedIndex(0);
    }
  }, [open]);

  const performSearch = async (searchQuery: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
      if (!response.ok) throw new Error('Search failed');
      
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error('Search error:', error);
      setResults({ tasks: [], projects: [] });
    } finally {
      setLoading(false);
    }
  };

  const allResults = [
    ...results.tasks.map(task => ({ type: 'task' as const, data: task })),
    ...results.projects.map(project => ({ type: 'project' as const, data: project })),
  ];

  const handleSelect = (item: typeof allResults[0]) => {
    if (item.type === 'task') {
      router.push(`/dashboard/tasks/${item.data.id}`);
    } else {
      router.push(`/dashboard/projects/${item.data.id}`);
    }
    onOpenChange(false);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!open) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < allResults.length - 1 ? prev + 1 : prev
        );
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : 0));
      } else if (e.key === 'Enter' && allResults[selectedIndex]) {
        e.preventDefault();
        handleSelect(allResults[selectedIndex]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, selectedIndex, allResults]);

  // CMD+K shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onOpenChange(!open);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onOpenChange]);

  const getStatusColor = (status: Status) => {
    const colors = {
      TODO: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
      IN_PROGRESS: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300',
      REVIEW: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300',
      DONE: 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300',
    };
    return colors[status];
  };

  const getPriorityColor = (priority: Priority) => {
    const colors = {
      LOW: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
      MEDIUM: 'bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400',
      HIGH: 'bg-orange-100 text-orange-600 dark:bg-orange-900/50 dark:text-orange-400',
      URGENT: 'bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-400',
    };
    return colors[priority];
  };

  const formatDate = (date: Date | null) => {
    if (!date) return null;
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0 gap-0 overflow-hidden">
        {/* Search Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search tasks and projects..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10 pr-20 border-0 focus-visible:ring-0 text-base"
              autoFocus
            />
            {loading && (
              <Loader2 className="absolute right-12 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-gray-400" />
            )}
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-xs text-gray-400">
              <kbd className="px-1.5 py-0.5 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800">
                ESC
              </kbd>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="max-h-[400px] overflow-y-auto">
          {!query.trim() ? (
            <div className="p-8 text-center">
              <Search className="h-12 w-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                Search for tasks and projects
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500">
                Use <kbd className="px-1 py-0.5 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-xs">⌘K</kbd> to quickly access search
              </p>
            </div>
          ) : allResults.length === 0 && !loading ? (
            <div className="p-8 text-center">
              <FileText className="h-12 w-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No results found for &ldquo;{query}&rdquo;
              </p>
            </div>
          ) : (
            <div className="py-2">
              <AnimatePresence mode="popLayout">
                {/* Tasks Section */}
                {results.tasks.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <div className="px-4 py-2">
                      <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-2">
                        <FileText className="h-3.5 w-3.5" />
                        Tasks ({results.tasks.length})
                      </h3>
                    </div>
                    {results.tasks.map((task, idx) => {
                      const globalIndex = idx;
                      return (
                        <button
                          key={task.id}
                          onClick={() => handleSelect({ type: 'task', data: task })}
                          onMouseEnter={() => setSelectedIndex(globalIndex)}
                          className={cn(
                            'w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors flex items-start gap-3 group',
                            selectedIndex === globalIndex && 'bg-gray-50 dark:bg-gray-800/50'
                          )}
                        >
                          <div className="mt-1">
                            <Hash className="h-4 w-4 text-gray-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-medium text-sm text-gray-900 dark:text-white truncate">
                                {task.title}
                              </p>
                            </div>
                            {task.description && (
                              <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 mb-2">
                                {task.description}
                              </p>
                            )}
                            <div className="flex items-center gap-2 flex-wrap">
                              <Badge variant="secondary" className={cn('text-xs', getStatusColor(task.status))}>
                                {task.status.replace('_', ' ')}
                              </Badge>
                              <Badge variant="secondary" className={cn('text-xs', getPriorityColor(task.priority))}>
                                {task.priority}
                              </Badge>
                              {task.project && (
                                <Badge variant="outline" className="text-xs">
                                  <Folder className="h-3 w-3 mr-1" />
                                  {task.project.name}
                                </Badge>
                              )}
                              {task.dueDate && (
                                <Badge variant="outline" className="text-xs">
                                  <Calendar className="h-3 w-3 mr-1" />
                                  {formatDate(task.dueDate)}
                                </Badge>
                              )}
                            </div>
                          </div>
                          <ArrowRight className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity mt-1" />
                        </button>
                      );
                    })}
                  </motion.div>
                )}

                {/* Projects Section */}
                {results.projects.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <div className="px-4 py-2 mt-2">
                      <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-2">
                        <Folder className="h-3.5 w-3.5" />
                        Projects ({results.projects.length})
                      </h3>
                    </div>
                    {results.projects.map((project, idx) => {
                      const globalIndex = results.tasks.length + idx;
                      return (
                        <button
                          key={project.id}
                          onClick={() => handleSelect({ type: 'project', data: project })}
                          onMouseEnter={() => setSelectedIndex(globalIndex)}
                          className={cn(
                            'w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors flex items-start gap-3 group',
                            selectedIndex === globalIndex && 'bg-gray-50 dark:bg-gray-800/50'
                          )}
                        >
                          <div 
                            className="mt-1 w-4 h-4 rounded" 
                            style={{ backgroundColor: project.color }}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm text-gray-900 dark:text-white truncate mb-1">
                              {project.name}
                            </p>
                            {project.description && (
                              <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
                                {project.description}
                              </p>
                            )}
                            {project._count && (
                              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                                {project._count.tasks} tasks
                              </p>
                            )}
                          </div>
                          <ArrowRight className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity mt-1" />
                        </button>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800">↑↓</kbd>
                Navigate
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800">↵</kbd>
                Select
              </span>
            </div>
            <span>{allResults.length} results</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}