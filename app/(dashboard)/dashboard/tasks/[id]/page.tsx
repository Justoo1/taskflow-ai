'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Calendar, User, Flag, Clock, MessageSquare, Activity, Edit2, MoreVertical, Check, X, Trash2 } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { Status, Priority } from '@prisma/client';

// UI Components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

import TaskAIAnalysis from '@/components/tasks/TaskAIAnalysis';

// Types
interface TaskUser {
  id: string;
  name: string | null;
  email: string;
  image?: string | null;
}

interface TaskProject {
  id: string;
  name: string;
  color?: string | null;
}

interface TaskComment {
  id: string;
  content: string;
  authorId: string;
  author: TaskUser;
  createdAt: Date;
  updatedAt: Date;
}

interface TaskActivity {
  id: string;
  action: string;
  userId: string;
  user: TaskUser;
  createdAt: Date;
}

interface Task {
  id: string;
  title: string;
  description: string | null;
  priority: Priority;
  status: Status;
  dueDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  projectId: string | null;
  user: TaskUser;
  project: TaskProject | null;
  comments?: TaskComment[];
  activities?: TaskActivity[];
}

interface TaskPageProps {
  params: Promise<{
    id: string;
  }>;
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

const TaskDetailsPage = ({ params }: TaskPageProps) => {
  const router = useRouter();
  const [task, setTask] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editedTask, setEditedTask] = useState<Partial<Task>>({});
  const [newComment, setNewComment] = useState('');
  const [isPostingComment, setIsPostingComment] = useState(false);
  const [progress, setProgress] = useState(0);

  // Fetch task data
  useEffect(() => {
    const fetchTask = async () => {
      try {
        const { id } = await params;
        const response = await fetch(`/api/tasks/${id}`);
        if (!response.ok) {
          const errorData = await response.json();
          toast.error(errorData.error || 'Failed to load task');
          router.push('/dashboard/tasks');
          return;
        }
        const data: Task = await response.json();
        setTask(data);
        setEditedTask(data);

        // Calculate progress based on status
        const progressMap: Record<Status, number> = {
          TODO: 0,
          IN_PROGRESS: 50,
          REVIEW: 75,
          DONE: 100,
        };
        setProgress(progressMap[data.status]);
      } catch (error) {
        console.error('Error fetching task:', error);
        toast.error('Failed to load task');
        router.push('/dashboard/tasks');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTask();
  }, [params, router]);

  const handleSave = async () => {
    if (!task) return;

    setIsSaving(true);
    try {
      const response = await fetch(`/api/tasks/${task.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editedTask),
      });

      if (!response.ok) throw new Error('Failed to update task');

      const updatedTask: Task = await response.json();
      setTask(updatedTask);
      setEditedTask(updatedTask);
      setIsEditing(false);
      toast.success('Task updated successfully');
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error('Failed to update task');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditedTask(task || {});
    setIsEditing(false);
  };

  const handleStatusChange = async (newStatus: Status) => {
    if (!task) return;

    try {
      const response = await fetch(`/api/tasks/${task.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error('Failed to update status');

      const updatedTask: Task = await response.json();
      setTask(updatedTask);
      
      // Update progress
      const progressMap: Record<Status, number> = {
        TODO: 0,
        IN_PROGRESS: 50,
        REVIEW: 75,
        DONE: 100,
      };
      setProgress(progressMap[newStatus]);
      
      toast.success('Status updated successfully');
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  const handleAddComment = async () => {
    if (!task || !newComment.trim()) return;

    setIsPostingComment(true);
    try {
      const response = await fetch(`/api/tasks/${task.id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newComment }),
      });

      if (!response.ok) throw new Error('Failed to post comment');

      const newCommentData: TaskComment = await response.json();
      
      setTask(prevTask => {
        if (!prevTask) return prevTask;
        return {
          ...prevTask,
          comments: [...(prevTask.comments || []), newCommentData],
        };
      });
      
      setNewComment('');
      toast.success('Comment added');
    } catch (error) {
      console.error('Error posting comment:', error);
      toast.error('Failed to post comment');
    } finally {
      setIsPostingComment(false);
    }
  };

  const handleDelete = async () => {
    if (!task || !confirm('Are you sure you want to delete this task?')) return;

    try {
      const response = await fetch(`/api/tasks/${task.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete task');

      toast.success('Task deleted successfully');
      router.push('/dashboard');
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error('Failed to delete task');
    }
  };

  const getInitials = (name: string | null): string => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading task...</p>
        </div>
      </div>
    );
  }

  if (!task) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push('/dashboard/tasks')}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">TASK-{task.id.slice(0, 8)}</span>
                  <Badge className={statusColors[task.status]}>
                    {statusLabels[task.status]}
                  </Badge>
                </div>
                {!isEditing ? (
                  <h1 className="text-2xl font-bold mt-1">{task.title}</h1>
                ) : (
                  <Input
                    value={editedTask.title || ''}
                    onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
                    className="text-2xl font-bold mt-1 h-auto border-0 border-b-2 border-primary rounded-none px-0 focus-visible:ring-0"
                  />
                )}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {isEditing ? (
                <>
                  <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    size="sm"
                  >
                    {isSaving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        Save
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={handleCancel}
                    variant="outline"
                    size="sm"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    onClick={() => setIsEditing(true)}
                    variant="outline"
                    size="sm"
                  >
                    <Edit2 className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setIsEditing(true)}>
                        <Edit2 className="w-4 h-4 mr-2" />
                        Edit Task
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={handleDelete}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Task
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  Description
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!isEditing ? (
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                    {task.description || 'No description provided.'}
                  </p>
                ) : (
                  <Textarea
                    value={editedTask.description || ''}
                    onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
                    placeholder="Add a description..."
                    className="min-h-[150px]"
                  />
                )}
              </CardContent>
            </Card>

            {/* Progress */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Progress</CardTitle>
                  <span className="text-sm font-medium">{progress}%</span>
                </div>
              </CardHeader>
              <CardContent>
                <Progress value={progress} className="h-3" />
              </CardContent>
            </Card>

            {/* Comments */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <MessageSquare className="w-5 h-5 mr-2" />
                  Comments ({task.comments?.length || 0})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Comment List */}
                <div className="space-y-4">
                  {task.comments?.map((comment) => (
                    <div key={comment.id} className="flex space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={comment.author.image || undefined} />
                        <AvatarFallback>{getInitials(comment.author.name)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-sm">
                            {comment.author.name || comment.author.email}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">{comment.content}</p>
                      </div>
                    </div>
                  ))}
                  {(!task.comments || task.comments.length === 0) && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No comments yet. Be the first to comment!
                    </p>
                  )}
                </div>

                <Separator />

                {/* Add Comment */}
                <div className="flex space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{getInitials(task.user.name)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-2">
                    <Textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Add a comment..."
                      className="min-h-[80px]"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                          handleAddComment();
                        }
                      }}
                    />
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">
                        Press ⌘+Enter to post
                      </span>
                      <Button
                        onClick={handleAddComment}
                        disabled={!newComment.trim() || isPostingComment}
                        size="sm"
                      >
                        {isPostingComment ? 'Posting...' : 'Post Comment'}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Activity Log */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Activity className="w-5 h-5 mr-2" />
                  Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {task.activities?.map((activity) => (
                    <div key={activity.id} className="flex space-x-3">
                      <div className="flex-shrink-0">
                        <div className="h-2 w-2 rounded-full bg-primary mt-2"></div>
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm">{activity.action}</p>
                        <p className="text-xs text-muted-foreground">
                          {activity.user.name || activity.user.email} •{' '}
                          {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                  ))}
                  {(!task.activities || task.activities.length === 0) && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No activity yet
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Details Sidebar */}
          <div className="space-y-6">
            {/* AI Analyses */}
            <TaskAIAnalysis taskDescription={task.description} taskId={task.id} taskTitle={task.title} />
            {/* Status */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium text-muted-foreground">STATUS</CardTitle>
              </CardHeader>
              <CardContent>
                <Select
                  value={task.status}
                  onValueChange={(value) => handleStatusChange(value as Status)}
                  disabled={isEditing}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(statusLabels).map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        <div className="flex items-center">
                          <div className={`w-2 h-2 rounded-full mr-2 ${statusColors[key as Status].split(' ')[0]}`} />
                          {label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Details Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium text-muted-foreground">DETAILS</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Assignee */}
                <div className="space-y-2">
                  <Label className="text-xs flex items-center text-muted-foreground">
                    <User className="w-3 h-3 mr-1" />
                    Assignee
                  </Label>
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={task.user.image || undefined} />
                      <AvatarFallback className="text-xs">
                        {getInitials(task.user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{task.user.name || task.user.email}</span>
                  </div>
                </div>

                {/* Priority */}
                <div className="space-y-2">
                  <Label className="text-xs flex items-center text-muted-foreground">
                    <Flag className="w-3 h-3 mr-1" />
                    Priority
                  </Label>
                  {!isEditing ? (
                    <Badge className={priorityColors[task.priority]}>
                      {priorityLabels[task.priority]}
                    </Badge>
                  ) : (
                    <Select
                      value={editedTask.priority || task.priority}
                      onValueChange={(value) => setEditedTask({ ...editedTask, priority: value as Priority })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(priorityLabels).map(([key, label]) => (
                          <SelectItem key={key} value={key}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>

                {/* Due Date */}
                <div className="space-y-2">
                  <Label className="text-xs flex items-center text-muted-foreground">
                    <Calendar className="w-3 h-3 mr-1" />
                    Due Date
                  </Label>
                  {!isEditing ? (
                    <div className="text-sm">
                      {task.dueDate ? format(new Date(task.dueDate), 'PPP') : 'No due date'}
                    </div>
                  ) : (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal">
                          <Calendar className="mr-2 h-4 w-4" />
                          {editedTask.dueDate ? format(new Date(editedTask.dueDate), 'PPP') : 'Pick a date'}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                          mode="single"
                          selected={editedTask.dueDate ? new Date(editedTask.dueDate) : undefined}
                          onSelect={(date) => setEditedTask({ ...editedTask, dueDate: date || null })}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  )}
                </div>

                {/* Created */}
                <div className="space-y-2">
                  <Label className="text-xs flex items-center text-muted-foreground">
                    <Clock className="w-3 h-3 mr-1" />
                    Created
                  </Label>
                  <div className="text-sm">
                    {format(new Date(task.createdAt), 'PPP')}
                  </div>
                </div>

                {/* Updated */}
                <div className="space-y-2">
                  <Label className="text-xs flex items-center text-muted-foreground">
                    <Clock className="w-3 h-3 mr-1" />
                    Last Updated
                  </Label>
                  <div className="text-sm">
                    {formatDistanceToNow(new Date(task.updatedAt), { addSuffix: true })}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Project */}
            {task.project && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-muted-foreground">PROJECT</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-3 h-3 rounded"
                      style={{ backgroundColor: task.project.color || '#3B82F6' }}
                    />
                    <span className="text-sm font-medium">{task.project.name}</span>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TaskDetailsPage;