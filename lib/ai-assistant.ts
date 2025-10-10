import OpenAI from 'openai';
import { Task, Project } from '@prisma/client';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

interface ChatContext {
  tasks: Array<{ id: string; title: string; priority: string; status: string }>;
  projects: Array<{ id: string; name: string; description?: string | null }>;
  conversationId?: string;
  userPlan: string;
}

interface ChatResponse {
  message: string;
  conversationId: string;
  tokensUsed: number;
  cost: number;
  suggestions?: unknown[];
}

export async function aiChat(
  userMessage: string,
  context: ChatContext
): Promise<ChatResponse> {
  const systemPrompt = `You are a helpful productivity assistant for TaskFlow AI.
You help users manage their tasks and projects effectively.

Current user context:
- Plan: ${context.userPlan}
- Active tasks: ${context.tasks.length}
- Active projects: ${context.projects.length}

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
User's current tasks (${context.tasks.length} total):
${context.tasks.slice(0, 10).map(t => `- ${t.title} (${t.priority}, ${t.status})`).join('\n')}

User's projects (${context.projects.length} total):
${context.projects.slice(0, 5).map(p => `- ${p.name}`).join('\n')}
`;

  const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
    { role: 'system', content: systemPrompt },
    { role: 'system', content: contextMessage },
    { role: 'user', content: userMessage },
  ];

  const completion = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages,
    temperature: 0.7,
    max_tokens: 500,
  });

  const responseMessage = completion.choices[0].message.content || 'I apologize, but I could not generate a response.';
  const tokensUsed = completion.usage?.total_tokens || 0;
  const cost = (tokensUsed / 1000) * 0.01; // Approximate cost

  return {
    message: responseMessage,
    conversationId: context.conversationId || `conv_${Date.now()}`,
    tokensUsed,
    cost,
  };
}

export async function getProductivityInsights(
  tasks: (Task & { project: Project | null })[]
) {
  const taskSummary = {
    total: tasks.length,
    byStatus: tasks.reduce((acc, t) => {
      acc[t.status] = (acc[t.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    byPriority: tasks.reduce((acc, t) => {
      acc[t.priority] = (acc[t.priority] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    overdue: tasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date()).length,
  };

  const prompt = `Analyze this task data and provide 3-5 actionable productivity insights:

Task Summary:
- Total tasks: ${taskSummary.total}
- Status breakdown: ${JSON.stringify(taskSummary.byStatus)}
- Priority breakdown: ${JSON.stringify(taskSummary.byPriority)}
- Overdue tasks: ${taskSummary.overdue}

Provide insights as a JSON array with this structure:
[
  {
    "type": "warning|info|success",
    "title": "Short title",
    "description": "Detailed insight",
    "actionable": true|false,
    "action": "Suggested action if actionable"
  }
]

Focus on:
1. Workload balance
2. Priority distribution
3. Overdue items
4. Productivity patterns
5. Actionable recommendations`;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [
      {
        role: 'system',
        content: 'You are a productivity analyst. Provide insights in JSON format.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.7,
  });

  const insights = JSON.parse(completion.choices[0].message.content || '{"insights": []}');
  return insights.insights || insights;
}

export async function analyzeProject(
  project: Project & { tasks: Task[] }
) {
  const projectContext = {
    name: project.name,
    description: project.description,
    totalTasks: project.tasks.length,
    completedTasks: project.tasks.filter(t => t.status === 'DONE').length,
    inProgressTasks: project.tasks.filter(t => t.status === 'IN_PROGRESS').length,
    todoTasks: project.tasks.filter(t => t.status === 'TODO').length,
    highPriorityTasks: project.tasks.filter(t => t.priority === 'HIGH' || t.priority === 'URGENT').length,
  };

  const prompt = `Analyze this project and provide insights:

Project: ${projectContext.name}
Description: ${projectContext.description || 'No description'}
Total tasks: ${projectContext.totalTasks}
- Done: ${projectContext.completedTasks}
- In Progress: ${projectContext.inProgressTasks}
- To Do: ${projectContext.todoTasks}
High priority: ${projectContext.highPriorityTasks}

Provide analysis as JSON:
{
  "insights": ["insight 1", "insight 2", ...],
  "recommendations": ["recommendation 1", "recommendation 2", ...],
  "risks": ["risk 1", "risk 2", ...],
  "estimatedCompletion": "time estimate",
  "healthScore": 0-100
}`;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [
      {
        role: 'system',
        content: 'You are a project management expert. Analyze projects and provide structured insights.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    response_format: { type: 'json_object' },
  });

  return JSON.parse(completion.choices[0].message.content || '{}');
}

export async function generateSmartSuggestions(
  userInput: string,
  context: { recentTasks: Task[]; activeProjects: Project[] }
) {
  const prompt = `Based on user input and context, suggest 3 relevant tasks:

User input: "${userInput}"

Recent tasks:
${context.recentTasks.slice(0, 5).map(t => `- ${t.title}`).join('\n')}

Active projects:
${context.activeProjects.slice(0, 3).map(p => `- ${p.name}`).join('\n')}

Generate 3 task suggestions as JSON:
{
  "suggestions": [
    {
      "title": "Task title",
      "description": "Task description",
      "priority": "LOW|MEDIUM|HIGH|URGENT",
      "estimatedTime": "time estimate",
      "category": "category"
    }
  ]
}`;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [
      {
        role: 'system',
        content: 'You are a task management assistant. Generate relevant task suggestions.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    response_format: { type: 'json_object' },
  });

  const result = JSON.parse(completion.choices[0].message.content || '{"suggestions": []}');
  return result.suggestions;
}