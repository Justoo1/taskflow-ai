import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const task = await prisma.task.findUnique({
      where: { id: params.id },
    });

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    if (task.userId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { content } = body;

    if (!content || typeof content !== 'string' || content.trim().length === 0) {
      return NextResponse.json(
        { error: 'Comment content is required' },
        { status: 400 }
      );
    }

    // For now, return a mock comment since Comment model needs to be added to Prisma schema
    // TODO: need to create the Comment model and uncomment the actual implementation below
    
    /*
    const comment = await prisma.comment.create({
      data: {
        content: content.trim(),
        taskId: params.id,
        authorId: session.user.id,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });

    return NextResponse.json(comment);
    */

    // Mock response until Comment model is added
    const mockComment = {
      id: `comment-${Date.now()}`,
      content: content.trim(),
      authorId: session.user.id,
      taskId: params.id,
      author: {
        id: session.user.id,
        name: session.user.name || null,
        email: session.user.email || '',
        image: session.user.image || null,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return NextResponse.json(mockComment);
  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}