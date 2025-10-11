import React from 'react';
import { Metadata } from 'next';
import ProjectsClient from '@/components/projects/ProjectsClient';
import { getProjects } from '@/actions/projects';

export const metadata: Metadata = {
  title: 'Projects | TaskFlow AI',
  description: 'Manage and organize your projects with AI-powered insights',
};

async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <ProjectsClient initialProjects={projects} />
    </div>
  );
}

export default ProjectsPage;