import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return new Response('Unauthorized', { status: 401 });
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { message, conversationId } = await req.json();

    if (!message || typeof message !== 'string') {
      return new Response('Invalid message', { status: 400 });
    }

    // Get user context
    const [tasks, projects] = await Promise.all([
      prisma.task.findMany({
        where: { userId: session.user.id },
        select: {
          id: true,
          title: true,
          priority: true,
          status: true,
        },
        take: 20,
        orderBy: { updatedAt: 'desc' },
      }),
      prisma.project.findMany({
        where: { userId: session.user.id },
        select: {
          id: true,
          name: true,
        },
        take: 10,
      }),
    ]);

    const systemPrompt = `You are a helpful productivity assistant for TaskFlow AI.
You help users manage their tasks and projects effectively.

Current user context:
- Active tasks: ${tasks.length}
- Active projects: ${projects.length}

Key capabilities:
1. Answer questions about task management
2. Provide productivity tips and suggestions
3. Help prioritize tasks
4. Analyze workload and provide insights
5. Suggest task breakdowns
6. Help with project planning

When suggesting tasks or actions, be specific and actionable.
Keep responses concise but helpful.`;

    const contextMessage = `
User's current tasks (${tasks.length} total):
${tasks.slice(0, 10).map(t => `- ${t.title} (${t.priority}, ${t.status})`).join('\n')}

User's projects (${projects.length} total):
${projects.slice(0, 5).map(p => `- ${p.name}`).join('\n')}
`;

    // Create streaming response
    const stream = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'system',
          content: contextMessage,
        },
        {
          role: 'user',
          content: message,
        },
      ],
      temperature: 0.7,
      max_tokens: 500,
      stream: true,
    });

    // Create a ReadableStream for the response
    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || '';
            if (content) {
              controller.enqueue(encoder.encode(content));
            }
          }
          
          // Track AI usage (approximate)
          await prisma.aIUsage.create({
            data: {
              userId: session.user.id,
              feature: 'chat_assistant_stream',
              tokens: 300, // Approximate
              cost: 0.003,
            },
          });

          controller.close();
        } catch (error) {
          console.error('Streaming error:', error);
          controller.error(error);
        }
      },
    });

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('AI Stream API error:', error);
    return new Response('Internal server error', { status: 500 });
  }
}