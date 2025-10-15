import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

interface TaskAnalysis {
  priority: 'low' | 'medium' | 'high' | 'urgent';
  estimatedTime: string;
  subtasks: string[];
  tips: string[];
  category: string;
}

export async function analyzeTask(
  taskTitle: string,
  taskDescription?: string
): Promise<TaskAnalysis> {
  const prompt = `Analyze this task and provide structured insights:
Title: ${taskTitle}
Description: ${taskDescription || 'No description provided'}

Provide:
1. Priority level (low/medium/high/urgent)
2. Estimated time to complete
3. Breakdown into 3-5 subtasks
4. 2-3 productivity tips
5. Category (work/personal/health/learning/etc)

Be concise and actionable.`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [
      {
        role: 'system',
        content: `You are an expert productivity assistant. Analyze tasks 
                  and provide actionable insights in JSON format.`,
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.7,
  });

  return JSON.parse(response.choices[0].message.content!);
}

export async function getDailyRecommendations(
  tasks: Array<{ title: string; priority: string; dueDate?: Date }>
): Promise<string[]> {
  const tasksContext = tasks
    .map((t, i) => `${i + 1}. ${t.title} (Priority: ${t.priority})`)
    .join('\n');

  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [
      {
        role: 'system',
        content: `You are a productivity coach. Given a list of tasks, 
                  recommend the top 3 tasks to focus on today. Consider 
                  priorities and urgency.`,
      },
      {
        role: 'user',
        content: `Here are my tasks:\n${tasksContext}\n\nWhat should I focus on today?`,
      },
    ],
    max_tokens: 300,
  });

  const recommendations = response.choices[0].message.content!;
  return recommendations.split('\n').filter((line) => line.trim());
}

export async function generateProjectPlan(
  projectName: string,
  projectDescription: string
): Promise<{ phases: Array<{ name: string; tasks: string[] }> }> {
  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [
      {
        role: 'system',
        content: `You are a project planning expert. Break down projects
                  into phases and actionable tasks. Return JSON with this structure:
                  {
                    "phases": [
                      {
                        "name": "Phase name",
                        "tasks": ["task 1", "task 2", ...]
                      }
                    ]
                  }`,
      },
      {
        role: 'user',
        content: `Project: ${projectName}\nDescription: ${projectDescription}`,
      },
    ],
    response_format: { type: 'json_object' },
  });

  return JSON.parse(response.choices[0].message.content!);
}

interface ProjectAnalysis {
  summary: string;
  healthScore: number;
  insights: {
    completionRate: string;
    taskDistribution: string;
    upcomingDeadlines: string;
    blockers: string[];
  };
  recommendations: string[];
  priorities: {
    urgent: string[];
    high: string[];
    focus: string[];
  };
}

export async function analyzeProject(
  projectName: string,
  projectDescription: string | null,
  tasks: Array<{
    title: string;
    description: string | null;
    status: string;
    priority: string;
    dueDate: Date | null;
  }>
): Promise<ProjectAnalysis> {
  const tasksSummary = tasks
    .map(
      (t) =>
        `- ${t.title} [${t.status}] (Priority: ${t.priority}, Due: ${
          t.dueDate ? t.dueDate.toLocaleDateString() : 'No deadline'
        })`
    )
    .join('\n');

  const statusCount = tasks.reduce(
    (acc, t) => {
      acc[t.status] = (acc[t.status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const prompt = `Analyze this project and provide comprehensive insights:

Project: ${projectName}
Description: ${projectDescription || 'No description provided'}

Tasks (${tasks.length} total):
${tasksSummary}

Status Distribution: ${JSON.stringify(statusCount)}

Provide a detailed analysis in JSON format with:
1. summary: A brief 2-3 sentence overview of the project's current state
2. healthScore: A number from 0-100 indicating project health
3. insights: Object with:
   - completionRate: Analysis of progress
   - taskDistribution: Assessment of task priorities and status
   - upcomingDeadlines: Summary of deadline situation
   - blockers: Array of potential blockers or issues
4. recommendations: Array of 3-5 actionable recommendations
5. priorities: Object with arrays of:
   - urgent: Tasks that need immediate attention
   - high: Important high-priority items
   - focus: Key tasks to focus on this week

Be specific, actionable, and data-driven.`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [
      {
        role: 'system',
        content: `You are an expert project management analyst. Analyze projects
                  and provide actionable insights in JSON format. Be specific and
                  data-driven in your analysis.`,
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.7,
  });

  return JSON.parse(response.choices[0].message.content!);
}