// lib/ai-custom.ts
import OpenAI from 'openai';
import { Task, Project } from '@prisma/client';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

/**
 * Generate a meeting agenda based on project and tasks
 */
export async function generateMeetingAgenda(
  projectName: string,
  tasks: Array<{ title: string; status: string }>
) {
  const prompt = `Generate a meeting agenda for project "${projectName}".

Current tasks:
${tasks.map(t => `- ${t.title} (${t.status})`).join('\n')}

Create an agenda that covers:
1. Project status update
2. Discussion points for each task
3. Next steps and action items

Format as JSON:
{
  "title": "Meeting title",
  "duration": "estimated duration",
  "agenda": [
    {
      "topic": "Topic name",
      "duration": "5 min",
      "points": ["point 1", "point 2"]
    }
  ]
}`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [
      {
        role: 'system',
        content: 'You are a project management assistant. Generate structured meeting agendas.',
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

/**
 * Generate a project roadmap with milestones
 */
export async function generateProjectRoadmap(
  projectName: string,
  projectDescription: string,
  duration: string
) {
  const prompt = `Create a project roadmap for "${projectName}".

Description: ${projectDescription}
Expected Duration: ${duration}

Generate a roadmap with:
1. Key milestones
2. Timeline for each phase
3. Dependencies
4. Success metrics

Format as JSON:
{
  "milestones": [
    {
      "name": "Milestone name",
      "phase": "Planning/Development/Testing/Launch",
      "duration": "time estimate",
      "tasks": ["task 1", "task 2"],
      "dependencies": ["previous milestone"],
      "successMetrics": ["metric 1", "metric 2"]
    }
  ],
  "totalDuration": "estimated total time",
  "criticalPath": ["milestone 1", "milestone 2"]
}`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [
      {
        role: 'system',
        content: 'You are a project planning expert. Create detailed project roadmaps.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    response_format: { type: 'json_object' },
  });

  return JSON.parse(response.choices[0].message.content!);
}

/**
 * Generate weekly summary and recommendations
 */
export async function generateWeeklySummary(
  completedTasks: Task[],
  pendingTasks: Task[],
  projects: Project[]
) {
  const prompt = `Generate a weekly productivity summary.

Completed this week: ${completedTasks.length} tasks
- ${completedTasks.slice(0, 5).map(t => t.title).join('\n- ')}

Pending: ${pendingTasks.length} tasks
- ${pendingTasks.slice(0, 5).map(t => t.title).join('\n- ')}

Active projects: ${projects.length}
- ${projects.map(p => p.name).join('\n- ')}

Provide:
1. Weekly achievements summary
2. Productivity score (0-100)
3. Key accomplishments
4. Areas for improvement
5. Recommendations for next week

Format as JSON:
{
  "summary": "Brief overview",
  "productivityScore": 85,
  "achievements": ["achievement 1", "achievement 2"],
  "improvements": ["area 1", "area 2"],
  "nextWeekRecommendations": ["recommendation 1", "recommendation 2"]
}`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [
      {
        role: 'system',
        content: 'You are a productivity coach. Analyze work patterns and provide constructive feedback.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    response_format: { type: 'json_object' },
  });

  return JSON.parse(response.choices[0].message.content!);
}

/**
 * Generate task dependencies and ordering
 */
export async function suggestTaskOrder(
  tasks: Array<{ id: string; title: string; description?: string | null }>
) {
  const prompt = `Analyze these tasks and suggest the optimal order:

${tasks.map((t, i) => `${i + 1}. ${t.title}${t.description ? `\n   ${t.description}` : ''}`).join('\n\n')}

Provide:
1. Recommended execution order
2. Task dependencies
3. Which tasks can be done in parallel
4. Estimated sequence duration

Format as JSON:
{
  "recommendedOrder": [
    {
      "taskId": "task id",
      "order": 1,
      "reason": "why this order"
    }
  ],
  "dependencies": [
    {
      "taskId": "task id",
      "dependsOn": ["task id 1", "task id 2"]
    }
  ],
  "parallelGroups": [
    ["task id 1", "task id 2"]
  ]
}`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [
      {
        role: 'system',
        content: 'You are a task sequencing expert. Analyze task dependencies and optimal ordering.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    response_format: { type: 'json_object' },
  });

  return JSON.parse(response.choices[0].message.content!);
}

/**
 * Generate risk assessment for a project
 */
export async function assessProjectRisks(
  project: Project & { tasks: Task[] }
) {
  const overdueTasks = project.tasks.filter(
    t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'DONE'
  );
  
  const highPriorityPending = project.tasks.filter(
    t => (t.priority === 'HIGH' || t.priority === 'URGENT') && t.status !== 'DONE'
  );

  const prompt = `Assess risks for project "${project.name}".

Project Details:
- Total tasks: ${project.tasks.length}
- Completed: ${project.tasks.filter(t => t.status === 'DONE').length}
- Overdue: ${overdueTasks.length}
- High priority pending: ${highPriorityPending.length}

Description: ${project.description || 'No description'}

Provide:
1. Risk level (Low/Medium/High/Critical)
2. Identified risks
3. Impact assessment
4. Mitigation strategies

Format as JSON:
{
  "riskLevel": "Medium",
  "overallScore": 65,
  "risks": [
    {
      "category": "Timeline/Resource/Quality/Scope",
      "description": "Risk description",
      "probability": "Low/Medium/High",
      "impact": "Low/Medium/High",
      "mitigation": "Mitigation strategy"
    }
  ],
  "immediateActions": ["action 1", "action 2"]
}`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [
      {
        role: 'system',
        content: 'You are a project risk management expert. Identify and assess project risks.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    response_format: { type: 'json_object' },
  });

  return JSON.parse(response.choices[0].message.content!);
}

/**
 * Generate personalized productivity tips
 */
export async function generatePersonalizedTips(
  userStats: {
    totalTasks: number;
    completionRate: number;
    averageTasksPerDay: number;
    mostProductiveTime?: string;
    commonCategories: string[];
  }
) {
  const prompt = `Generate personalized productivity tips for a user with these stats:

- Total tasks managed: ${userStats.totalTasks}
- Completion rate: ${userStats.completionRate}%
- Average tasks per day: ${userStats.averageTasksPerDay}
- Most productive time: ${userStats.mostProductiveTime || 'Unknown'}
- Common task categories: ${userStats.commonCategories.join(', ')}

Provide 5-7 actionable, personalized tips.

Format as JSON:
{
  "tips": [
    {
      "title": "Tip title",
      "description": "Detailed tip",
      "category": "Time Management/Focus/Organization/Prioritization",
      "impact": "High/Medium/Low"
    }
  ]
}`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [
      {
        role: 'system',
        content: 'You are a productivity expert. Provide personalized, actionable advice.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    response_format: { type: 'json_object' },
  });

  return JSON.parse(response.choices[0].message.content!);
}

/**
 * Generate sprint planning suggestions
 */
export async function generateSprintPlan(
  tasks: Task[],
  sprintDuration: number,
  teamCapacity: number
) {
  const prompt = `Create a sprint plan for ${sprintDuration} days with team capacity of ${teamCapacity} story points.

Available tasks:
${tasks.map(t => `- ${t.title} (Priority: ${t.priority}, Status: ${t.status})`).join('\n')}

Provide:
1. Tasks to include in sprint
2. Sprint goals
3. Capacity allocation
4. Risk factors

Format as JSON:
{
  "sprintGoal": "Primary sprint objective",
  "selectedTasks": [
    {
      "taskTitle": "task title",
      "estimatedPoints": 5,
      "priority": "High",
      "assignmentSuggestion": "Assign to experienced dev"
    }
  ],
  "totalPoints": 25,
  "capacityUtilization": 85,
  "risks": ["risk 1", "risk 2"],
  "bufferTasks": ["backup task 1"]
}`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [
      {
        role: 'system',
        content: 'You are an agile coach. Help plan effective sprints.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    response_format: { type: 'json_object' },
  });

  return JSON.parse(response.choices[0].message.content!);
}

/**
 * Generate email summary of tasks
 */
export async function generateTaskEmailSummary(
  tasks: Task[],
  recipientName: string
) {
  const prompt = `Create a professional email summary for ${recipientName}.

Tasks to summarize:
${tasks.map(t => `- ${t.title} (${t.status}, Priority: ${t.priority})`).join('\n')}

Create a concise, professional email that:
1. Summarizes current status
2. Highlights priorities
3. Notes any concerns
4. Is friendly but professional

Format as JSON:
{
  "subject": "Email subject line",
  "body": "Full email body with proper formatting",
  "tone": "Professional/Casual/Formal"
}`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [
      {
        role: 'system',
        content: 'You are a professional communication assistant. Write clear, effective emails.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    response_format: { type: 'json_object' },
  });

  return JSON.parse(response.choices[0].message.content!);
}