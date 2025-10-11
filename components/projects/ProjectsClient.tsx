'use client';

import React, { useState, useEffect } from 'react';
import {
  FolderOpen,
  Plus,
  Search,
  Grid3x3,
  List,
  MoreVertical,
  Edit,
  Trash2,
  Calendar,
  CheckCircle2,
  Clock,
  TrendingUp,
  ArrowLeft,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { deleteProject } from '@/actions/projects';
import ProjectDialog from './ProjectDialog';
import { Status, Priority } from '@prisma/client';

import ProjectAIPlanning from '@/components/projects/ProjectAIPlanning';

interface ProjectTask {
  id: string;
  status: Status;
  priority: Priority;
}

interface Project {
  id: string;
  name: string;
  description: string | null;
  color: string;
  createdAt: Date;
  updatedAt: Date;
  tasks: ProjectTask[];
  _count: {
    tasks: number;
  };
}

interface ProjectsClientProps {
  initialProjects: Project[];
}

const ProjectsClient: React.FC<ProjectsClientProps> = ({ initialProjects }) => {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [deletingProjectId, setDeletingProjectId] = useState<string | null>(null);

  useEffect(() => {
    setProjects(initialProjects);
  }, [initialProjects]);

  const filteredProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateProject = () => {
    setSelectedProject(null);
    setIsDialogOpen(true);
  };

  const handleEditProject = (project: Project) => {
    setSelectedProject(project);
    setIsDialogOpen(true);
  };

  const handleDeleteProject = async (projectId: string, projectName: string) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${projectName}"? This will not delete associated tasks.`
    );

    if (!confirmed) return;

    try {
      setDeletingProjectId(projectId);
      await deleteProject(projectId);
      setProjects((prev) => prev.filter((p) => p.id !== projectId));
      toast.success('Project deleted successfully');
      router.refresh();
    } catch (error) {
      console.error('Error deleting project:', error);
      toast.error('Failed to delete project');
    } finally {
      setDeletingProjectId(null);
    }
  };

  const handleProjectClick = (projectId: string) => {
    router.push(`/dashboard/projects/${projectId}`);
  };

  const calculateProjectStats = (project: Project) => {
    const total = project.tasks.length;
    const done = project.tasks.filter((t) => t.status === 'DONE').length;
    const inProgress = project.tasks.filter((t) => t.status === 'IN_PROGRESS').length;
    const todo = project.tasks.filter((t) => t.status === 'TODO').length;
    const progress = total > 0 ? Math.round((done / total) * 100) : 0;

    return { total, done, inProgress, todo, progress };
  };

  const totalProjects = projects.length;
  const totalTasks = projects.reduce((sum, p) => sum + p.tasks.length, 0);
  const completedTasks = projects.reduce(
    (sum, p) => sum + p.tasks.filter((t) => t.status === 'DONE').length,
    0
  );
  const activeProjects = projects.filter((p) => 
    p.tasks.some((t) => t.status !== 'DONE')
  ).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-start gap-4 flex-1 min-w-0">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push('/dashboard')}
              className="shrink-0 mt-1"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white transition-colors">
              Projects
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mt-1 transition-colors">
            Organize and manage your projects
          </p>
        </div>
        <Button
          onClick={handleCreateProject}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Project
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-2 hover:border-blue-300 dark:hover:border-blue-600 transition-all">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Projects
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {totalProjects}
                </p>
              </div>
              <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center">
                <FolderOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 hover:border-green-300 dark:hover:border-green-600 transition-all">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Active Projects
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {activeProjects}
                </p>
              </div>
              <div className="h-12 w-12 bg-green-100 dark:bg-green-900/50 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 hover:border-purple-300 dark:hover:border-purple-600 transition-all">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Tasks
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {totalTasks}
                </p>
              </div>
              <div className="h-12 w-12 bg-purple-100 dark:bg-purple-900/50 rounded-lg flex items-center justify-center">
                <Clock className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 hover:border-amber-300 dark:hover:border-amber-600 transition-all">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Completed Tasks
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {completedTasks}
                </p>
              </div>
              <div className="h-12 w-12 bg-amber-100 dark:bg-amber-900/50 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-md w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as 'grid' | 'list')}>
          <TabsList>
            <TabsTrigger value="grid" className="flex items-center gap-2">
              <Grid3x3 className="h-4 w-4" />
              Grid
            </TabsTrigger>
            <TabsTrigger value="list" className="flex items-center gap-2">
              <List className="h-4 w-4" />
              List
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Projects List */}
      {filteredProjects.length === 0 ? (
        <Card className="border-2 border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="h-16 w-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
              <FolderOpen className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {searchQuery ? 'No projects found' : 'No projects yet'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4 text-center max-w-sm">
              {searchQuery
                ? 'Try adjusting your search query'
                : 'Get started by creating your first project'}
            </p>
            {!searchQuery && (
              <Button
                onClick={handleCreateProject}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Project
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div
          className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'space-y-4'
          }
        >
          {filteredProjects.map((project) => {
            const stats = calculateProjectStats(project);
            return (
              <Card
                key={project.id}
                className="border-2 hover:border-blue-300 dark:hover:border-blue-600 transition-all cursor-pointer group relative overflow-hidden"
              >
                {/* Color accent bar */}
                <div
                  className="absolute top-0 left-0 right-0 h-1"
                  style={{ backgroundColor: project.color }}
                />

                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div
                      className="flex-1 min-w-0"
                      onClick={() => handleProjectClick(project.id)}
                    >
                      <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                        {project.name}
                      </CardTitle>
                      {project.description && (
                        <CardDescription className="mt-1 line-clamp-2">
                          {project.description}
                        </CardDescription>
                      )}
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 ml-2 shrink-0"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleProjectClick(project.id)}>
                          <FolderOpen className="h-4 w-4 mr-2" />
                          Open Project
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEditProject(project)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDeleteProject(project.id, project.name)}
                          disabled={deletingProjectId === project.id}
                          className="text-red-600 dark:text-red-400"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          {deletingProjectId === project.id ? 'Deleting...' : 'Delete'}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>

                <CardContent onClick={() => handleProjectClick(project.id)}>
                  <div className="space-y-4">
                    {/* Progress Bar */}
                    <div>
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-gray-600 dark:text-gray-400">Progress</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {stats.progress}%
                        </span>
                      </div>
                      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-300"
                          style={{ width: `${stats.progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-2">
                      <div className="text-center p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                        <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                          To Do
                        </div>
                        <div className="font-semibold text-gray-900 dark:text-white">
                          {stats.todo}
                        </div>
                      </div>
                      <div className="text-center p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <div className="text-xs text-blue-600 dark:text-blue-400 mb-1">
                          In Progress
                        </div>
                        <div className="font-semibold text-blue-700 dark:text-blue-300">
                          {stats.inProgress}
                        </div>
                      </div>
                      <div className="text-center p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <div className="text-xs text-green-600 dark:text-green-400 mb-1">
                          Done
                        </div>
                        <div className="font-semibold text-green-700 dark:text-green-300">
                          {stats.done}
                        </div>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {new Date(project.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                      </div>
                      <Badge variant="secondary" className="font-medium">
                        {stats.total} {stats.total === 1 ? 'task' : 'tasks'}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Project Dialog */}
      <ProjectDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        project={selectedProject}
        onSuccess={() => {
          router.refresh();
        }}
      />
      <ProjectAIPlanning 
      onCreateProject={(plan, name, description) => {
        // Handle project creation with AI-generated plan
        console.log('Creating project:', { plan, name, description });
        // You can integrate this with your existing createProject action
      }}
    />
    </div>
  );
};

export default ProjectsClient;