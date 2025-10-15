import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Task } from '@/types/dashboard';
import { Project } from '@/types/project';

/**
 * GET /api/search - Search tasks and projects
 * Query params:
 *   - q: search query (required)
 *   - type: filter by type ('tasks', 'projects', 'all') - default: 'all'
 *   - limit: max results per type - default: 10
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');
    const type = searchParams.get('type') || 'all';
    const limit = parseInt(searchParams.get('limit') || '10');

    if (!query || query.trim().length === 0) {
      return NextResponse.json({ tasks: [], projects: [] });
    }

    const searchTerm = query.trim();

    // Search tasks
    let tasks: Task[] = [];
    if (type === 'all' || type === 'tasks') {
      tasks = await prisma.task.findMany({
        where: {
          userId: session.user.id,
          OR: [
            {
              title: {
                contains: searchTerm,
                mode: 'insensitive',
              },
            },
            {
              description: {
                contains: searchTerm,
                mode: 'insensitive',
              },
            },
          ],
        },
        include: {
          project: {
            select: {
              id: true,
              name: true,
              color: true,
            },
          },
        },
        orderBy: [
          { updatedAt: 'desc' },
        ],
        take: limit,
      });
    }

    // Search projects
    let projects: Project[] = [];
    if (type === 'all' || type === 'projects') {
      projects = await prisma.project.findMany({
        where: {
          userId: session.user.id,
          OR: [
            {
              name: {
                contains: searchTerm,
                mode: 'insensitive',
              },
            },
            {
              description: {
                contains: searchTerm,
                mode: 'insensitive',
              },
            },
          ],
        },
        include: {
          _count: {
            select: {
              tasks: true,
            },
          },
        },
        orderBy: [
          { updatedAt: 'desc' },
        ],
        take: limit,
      });
    }

    return NextResponse.json({
      tasks,
      projects,
      query: searchTerm,
      count: {
        tasks: tasks.length,
        projects: projects.length,
        total: tasks.length + projects.length,
      },
    });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { 
        error: 'Search failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}