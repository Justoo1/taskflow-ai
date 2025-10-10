'use client';

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Plus, 
  MoreVertical, 
  CheckCircle2, 
  Circle, 
  Calendar,
  Tag,
  AlertCircle,
  Clock,
  Loader2,
  Trash2,
  Edit,
  Eye,
  ArrowLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useRouter } from 'next/navigation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Status, Priority } from '@prisma/client';
import { toast } from 'sonner';
import TaskDialog from '@/components/dashboard/TaskDialog';
import { getTasks, deleteTask } from '@/actions/tasks';

// Task type matching your project schema
interface Task {
  id: string;
  title: string;
  description: string | null;
  status: Status;
  priority: Priority;
  dueDate: Date | null;
  userId: string;
  projectId: string | null;
  createdAt: Date;
  updatedAt: Date;
  project?: {
    id: string;
    name: string;
    color?: string | null;
  } | null;
}

const TasksListClient: React.FC = () => {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);

  // Fetch tasks on mount
  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const data = await getTasks();
      setTasks(data as Task[]);
    } catch (error) {
      console.error('Error loading tasks:', error);
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = () => {
    setSelectedTask(null);
    setIsDialogOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setIsDialogOpen(true);
  };

  const handleDeleteTask = async (taskId: string, taskTitle: string) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${taskTitle}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    setDeletingTaskId(taskId);
    try {
      await deleteTask(taskId);
      toast.success('Task deleted successfully');
      await loadTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error('Failed to delete task');
    } finally {
      setDeletingTaskId(null);
    }
  };

  const handleDialogClose = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      setSelectedTask(null);
      loadTasks(); // Refresh tasks after dialog closes
    }
  };

  const toggleTaskStatus = (taskId: string): void => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId
          ? {
              ...task,
              status: task.status === Status.DONE ? Status.TODO : Status.DONE,
            }
          : task
      )
    );
  };

  const getPriorityBadgeVariant = (priority: Priority): 'default' | 'destructive' | 'secondary' => {
    switch (priority) {
      case Priority.URGENT:
      case Priority.HIGH:
        return 'destructive';
      case Priority.MEDIUM:
        return 'default';
      case Priority.LOW:
        return 'secondary';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status: Status): React.ReactNode => {
    switch (status) {
      case Status.DONE:
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case Status.IN_PROGRESS:
        return <Clock className="h-5 w-5 text-blue-500" />;
      case Status.REVIEW:
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      default:
        return <Circle className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusLabel = (status: Status): string => {
    const labels = {
      [Status.TODO]: 'To Do',
      [Status.IN_PROGRESS]: 'In Progress',
      [Status.REVIEW]: 'Review',
      [Status.DONE]: 'Done',
    };
    return labels[status];
  };

  const getPriorityLabel = (priority: Priority): string => {
    const labels = {
      [Priority.LOW]: 'Low',
      [Priority.MEDIUM]: 'Medium',
      [Priority.HIGH]: 'High',
      [Priority.URGENT]: 'Urgent',
    };
    return labels[priority];
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (task.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
    const matchesStatus = filterStatus === 'all' || task.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const taskCounts = {
    all: tasks.length,
    todo: tasks.filter(t => t.status === Status.TODO).length,
    inProgress: tasks.filter(t => t.status === Status.IN_PROGRESS).length,
    review: tasks.filter(t => t.status === Status.REVIEW).length,
    done: tasks.filter(t => t.status === Status.DONE).length,
  };

  const formatDate = (date: Date | null): string => {
    if (!date) return 'No due date';
    return new Date(date).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric' 
    });
  };

  const renderTaskCard = (task: Task) => (
    <Card key={task.id} className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <button
            onClick={() => toggleTaskStatus(task.id)}
            className="mt-1 hover:opacity-70 transition-opacity"
            disabled={deletingTaskId === task.id}
          >
            {getStatusIcon(task.status)}
          </button>
          
          <div className="flex-1 space-y-3">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1 flex-1">
                <h3 className={`font-semibold text-lg text-foreground ${
                  task.status === Status.DONE ? 'line-through opacity-70' : ''
                }`}>
                  {task.title}
                </h3>
                {task.description && (
                  <p className="text-muted-foreground text-sm">
                    {task.description}
                  </p>
                )}
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    disabled={deletingTaskId === task.id}
                  >
                    {deletingTaskId === task.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <MoreVertical className="h-4 w-4" />
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleEditTask(task)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="text-destructive"
                    onClick={() => handleDeleteTask(task.id, task.title)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push(`/tasks/${task.id}`)}>
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(task.dueDate)}</span>
              </div>
              {task.project && (
                <div className="flex items-center gap-2">
                  <div 
                    className="h-3 w-3 rounded-full" 
                    style={{ backgroundColor: task.project.color || '#3B82F6' }}
                  />
                  <span>{task.project.name}</span>
                </div>
              )}
              <Badge variant={getPriorityBadgeVariant(task.priority)}>
                {getPriorityLabel(task.priority)}
              </Badge>
              <Badge variant="outline">
                {getStatusLabel(task.status)}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
          <p className="mt-4 text-muted-foreground">Loading tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-6">
             <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push('/dashboard')}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-3xl font-bold text-foreground">Tasks</h1>
            </div>
            <p className="text-muted-foreground mt-1">
              Manage and track your tasks efficiently
            </p>
          </div>
          <Button onClick={handleCreateTask} className="w-fit">
            <Plus className="h-4 w-4 mr-2" />
            New Task
          </Button>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value={Status.TODO}>To Do</SelectItem>
                  <SelectItem value={Status.IN_PROGRESS}>In Progress</SelectItem>
                  <SelectItem value={Status.REVIEW}>Review</SelectItem>
                  <SelectItem value={Status.DONE}>Done</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterPriority} onValueChange={setFilterPriority}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value={Priority.LOW}>Low</SelectItem>
                  <SelectItem value={Priority.MEDIUM}>Medium</SelectItem>
                  <SelectItem value={Priority.HIGH}>High</SelectItem>
                  <SelectItem value={Priority.URGENT}>Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full md:w-auto grid-cols-5 md:inline-grid">
            <TabsTrigger value="all">
              All <span className="ml-2 text-xs">({taskCounts.all})</span>
            </TabsTrigger>
            <TabsTrigger value="todo">
              To Do <span className="ml-2 text-xs">({taskCounts.todo})</span>
            </TabsTrigger>
            <TabsTrigger value="in-progress">
              In Progress <span className="ml-2 text-xs">({taskCounts.inProgress})</span>
            </TabsTrigger>
            <TabsTrigger value="review">
              Review <span className="ml-2 text-xs">({taskCounts.review})</span>
            </TabsTrigger>
            <TabsTrigger value="done">
              Done <span className="ml-2 text-xs">({taskCounts.done})</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4 mt-6">
            {filteredTasks.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    {tasks.length === 0 ? 'No tasks yet. Create your first task!' : 'No tasks found'}
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredTasks.map(task => renderTaskCard(task))
            )}
          </TabsContent>

          {[
            { value: 'todo', status: Status.TODO },
            { value: 'in-progress', status: Status.IN_PROGRESS },
            { value: 'review', status: Status.REVIEW },
            { value: 'done', status: Status.DONE },
          ].map(({ value, status }) => (
            <TabsContent key={value} value={value} className="space-y-4 mt-6">
              {filteredTasks.filter(t => t.status === status).length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No {getStatusLabel(status).toLowerCase()} tasks</p>
                  </CardContent>
                </Card>
              ) : (
                filteredTasks.filter(t => t.status === status).map(task => renderTaskCard(task))
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>

      {/* Task Dialog */}
      <TaskDialog
        open={isDialogOpen}
        onOpenChange={handleDialogClose}
        task={selectedTask}
      />
    </div>
  );
};

export default TasksListClient;