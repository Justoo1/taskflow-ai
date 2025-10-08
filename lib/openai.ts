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