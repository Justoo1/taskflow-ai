// app/(dashboard)/projects/[id]/page.tsx
import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ProjectDetailClient from '@/components/projects/ProjectDetailClient';
import { getProjectById } from '@/actions/projects';

interface ProjectDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({
  params,
}: ProjectDetailPageProps): Promise<Metadata> {
  try {
    const { id } = await params;
    const project = await getProjectById(id);

    return {
      title: `${project.name} | TaskFlow AI`,
      description: project.description || 'Project details and tasks',
    };
  } catch {
    return {
      title: 'Project Not Found | TaskFlow AI',
    };
  }
}

async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  try {
    const { id } = await params;
    const project = await getProjectById(id);

    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <ProjectDetailClient project={project} />
      </div>
    );
  } catch (error) {
    console.error('Error fetching project:', error);
    notFound();
  }
}

export default ProjectDetailPage;