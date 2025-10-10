'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Edit,
  Trash2,
  Plus,
  MoreVertical,
  Calendar,
  CheckCircle2,
  Clock,
  TrendingUp,
  BarChart3,
  Filter,
  Search,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { deleteProject } from '@/actions/projects';
import { deleteTask, updateTaskStatus } from '@/actions/tasks';
import ProjectDialog from './ProjectDialog';
import TaskDialog from '@/components/dashboard/TaskDialog';
import { Status, Priority } from '@prisma/client';

interface Task {
  id: string;
  title: string;
  description: string | null;
  status: Status;
  priority: Priority;
  dueDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  projectId: string | null;
  project?: {
    id: string;
    name: string;
    color?: string | null;
  } | null;
}

interface Project {
  id: string;
  name: string;
  description: string | null;
  color: string;
  createdAt: Date;
  updatedAt: Date;
  tasks: Task[];
  _count: {
    tasks: number;
  };
}

interface ProjectDetailClientProps {
  project: Project;
}

const statusColors: Record<Status, string> = {
  TODO: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  IN_PROGRESS: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300',
  REVIEW: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300',
  DONE: 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300',
};

const statusLabels: Record<Status, string> = {
  TODO: 'To Do',
  IN_PROGRESS: 'In Progress',
  REVIEW: 'Review',
  DONE: 'Done',
};

const priorityColors: Record<Priority, string> = {
  LOW: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
  MEDIUM: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300',
  HIGH: 'bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300',
  URGENT: 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300',
};

const priorityLabels: Record<Priority, string> = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
  URGENT: 'Urgent',
};

const ProjectDetailClient: React.FC<ProjectDetailClientProps> = ({ project: initialProject }) => {
  const router = useRouter();
  const [project, setProject] = useState(initialProject);
  const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false);
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);

  const filteredTasks = project.tasks.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || task.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const stats = {
    total: project.tasks.length,
    done: project.tasks.filter((t) => t.status === 'DONE').length,
    inProgress: project.tasks.filter((t) => t.status === 'IN_PROGRESS').length,
    todo: project.tasks.filter((t) => t.status === 'TODO').length,
    review: project.tasks.filter((t) => t.status === 'REVIEW').length,
    progress:
      project.tasks.length > 0
        ? Math.round((project.tasks.filter((t) => t.status === 'DONE').length / project.tasks.length) * 100)
        : 0,
  };

  const priorityStats = {
    urgent: project.tasks.filter((t) => t.priority === 'URGENT').length,
    high: project.tasks.filter((t) => t.priority === 'HIGH').length,
    medium: project.tasks.filter((t) => t.priority === 'MEDIUM').length,
    low: project.tasks.filter((t) => t.priority === 'LOW').length,
  };

  const handleDeleteProject = async () => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${project.name}"? This will not delete associated tasks.`
    );

    if (!confirmed) return;

    try {
      await deleteProject(project.id);
      toast.success('Project deleted successfully');
      router.push('/projects');
    } catch (error) {
      console.error('Error deleting project:', error);
      toast.error('Failed to delete project');
    }
  };

  const handleCreateTask = () => {
    setSelectedTask(null);
    setIsTaskDialogOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setIsTaskDialogOpen(true);
  };

  const handleDeleteTask = async (taskId: string, taskTitle: string) => {
    const confirmed = window.confirm(`Are you sure you want to delete "${taskTitle}"?`);

    if (!confirmed) return;

    try {
      setDeletingTaskId(taskId);
      await deleteTask(taskId);
      setProject((prev) => ({
        ...prev,
        tasks: prev.tasks.filter((t) => t.id !== taskId),
      }));
      toast.success('Task deleted successfully');
      router.refresh();
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error('Failed to delete task');
    } finally {
      setDeletingTaskId(null);
    }
  };

  const handleStatusChange = async (taskId: string, newStatus: Status) => {
    try {
      await updateTaskStatus(taskId, newStatus);
      setProject((prev) => ({
        ...prev,
        tasks: prev.tasks.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t)),
      }));
      toast.success('Task status updated');
      router.refresh();
    } catch (error) {
      console.error('Error updating task status:', error);
      toast.error('Failed to update task status');
    }
  };

  const handleTaskClick = (taskId: string) => {
    router.push(`/tasks/${taskId}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4 flex-1 min-w-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push('/projects')}
            className="shrink-0 mt-1"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <div
                className="h-3 w-3 rounded-full shrink-0"
                style={{ backgroundColor: project.color }}
              />
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white truncate">
                {project.name}
              </h1>
            </div>
            {project.description && (
              <p className="text-gray-600 dark:text-gray-400 mt-1">{project.description}</p>
            )}
            <div className="flex items-center gap-4 mt-3 text-sm text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Created {new Date(project.createdAt).toLocaleDateString()}
              </span>
              <span>{stats.total} tasks</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsProjectDialogOpen(true)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setIsProjectDialogOpen(true)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Project
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleDeleteProject}
                className="text-red-600 dark:text-red-400"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Project
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-2">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Tasks
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {stats.total}
                </p>
              </div>
              <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  In Progress
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {stats.inProgress}
                </p>
              </div>
              <div className="h-12 w-12 bg-amber-100 dark:bg-amber-900/50 rounded-lg flex items-center justify-center">
                <Clock className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Completed
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {stats.done}
                </p>
              </div>
              <div className="h-12 w-12 bg-green-100 dark:bg-green-900/50 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Progress
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {stats.progress}%
                </p>
              </div>
              <div className="h-12 w-12 bg-purple-100 dark:bg-purple-900/50 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Bar */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-gray-900 dark:text-white">
                Project Progress
              </span>
              <span className="text-gray-600 dark:text-gray-400">
                {stats.done} of {stats.total} tasks completed
              </span>
            </div>
            <Progress value={stats.progress} className="h-3" />
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 pt-1">
              <span>To Do: {stats.todo}</span>
              <span>In Progress: {stats.inProgress}</span>
              <span>Review: {stats.review}</span>
              <span>Done: {stats.done}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tasks Section */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div>
              <CardTitle>Tasks</CardTitle>
              <CardDescription>Manage tasks within this project</CardDescription>
            </div>
            <Button
              onClick={handleCreateTask}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Task
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="TODO">To Do</SelectItem>
                <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                <SelectItem value="REVIEW">Review</SelectItem>
                <SelectItem value="DONE">Done</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterPriority} onValueChange={setFilterPriority}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="URGENT">Urgent</SelectItem>
                <SelectItem value="HIGH">High</SelectItem>
                <SelectItem value="MEDIUM">Medium</SelectItem>
                <SelectItem value="LOW">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tasks List */}
          {filteredTasks.length === 0 ? (
            <div className="text-center py-12">
              <div className="h-16 w-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {searchQuery || filterStatus !== 'all' || filterPriority !== 'all'
                  ? 'No tasks found'
                  : 'No tasks yet'}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {searchQuery || filterStatus !== 'all' || filterPriority !== 'all'
                  ? 'Try adjusting your filters'
                  : 'Get started by creating your first task'}
              </p>
              {!searchQuery && filterStatus === 'all' && filterPriority === 'all' && (
                <Button
                  onClick={handleCreateTask}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Task
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredTasks.map((task) => (
                <Card
                  key={task.id}
                  className="border hover:border-blue-300 dark:hover:border-blue-600 transition-all cursor-pointer group"
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div
                        className="flex-1 min-w-0"
                        onClick={() => handleTaskClick(task.id)}
                      >
                        <div className="flex items-start gap-3 mb-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStatusChange(
                                task.id,
                                task.status === 'DONE' ? 'TODO' : 'DONE'
                              );
                            }}
                            className="mt-1 shrink-0"
                          >
                            {task.status === 'DONE' ? (
                              <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                            ) : (
                              <div className="h-5 w-5 rounded-full border-2 border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 transition-colors" />
                            )}
                          </button>
                          <div className="flex-1 min-w-0">
                            <h4
                              className={`font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors ${
                                task.status === 'DONE' ? 'line-through opacity-60' : ''
                              }`}
                            >
                              {task.title}
                            </h4>
                            {task.description && (
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                                {task.description}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap ml-8">
                          <Badge className={statusColors[task.status]}>
                            {statusLabels[task.status]}
                          </Badge>
                          <Badge className={priorityColors[task.priority]}>
                            {priorityLabels[task.priority]}
                          </Badge>
                          {task.dueDate && (
                            <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(task.dueDate).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 shrink-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleTaskClick(task.id)}>
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditTask(task)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleDeleteTask(task.id, task.title)}
                            disabled={deletingTaskId === task.id}
                            className="text-red-600 dark:text-red-400"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            {deletingTaskId === task.id ? 'Deleting...' : 'Delete'}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialogs */}
      <ProjectDialog
        open={isProjectDialogOpen}
        onOpenChange={setIsProjectDialogOpen}
        project={project}
        onSuccess={() => {
          router.refresh();
        }}
      />
      <TaskDialog
        open={isTaskDialogOpen}
        onOpenChange={setIsTaskDialogOpen}
        task={selectedTask}
        defaultProjectId={project.id}
        onSuccess={() => {
          router.refresh();
        }}
      />
    </div>
  );
};

export default ProjectDetailClient;