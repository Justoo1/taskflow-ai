export interface AIMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  metadata?: Record<string, unknown>;
}

export interface AIConversation {
  id: string;
  userId: string;
  title: string;
  messages: AIMessage[];
  createdAt: Date;
  updatedAt: Date;
}

export interface AITaskSuggestion {
  title: string;
  description: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  estimatedTime: string;
  category: string;
}

export interface AIProjectAnalysis {
  projectId: string;
  insights: string[];
  recommendations: string[];
  risks: string[];
  timeline: {
    phase: string;
    duration: string;
    tasks: string[];
  }[];
}

export interface AIProductivityInsight {
  type: 'warning' | 'info' | 'success';
  title: string;
  description: string;
  actionable: boolean;
  action?: string;
}

export interface AIChatRequest {
  message: string;
  conversationId?: string;
  context?: {
    tasks?: Array<{ id: string; title: string; priority: string }>;
    projects?: Array<{ id: string; name: string }>;
  };
}

export interface AIChatResponse {
  message: string;
  conversationId: string;
  suggestions?: AITaskSuggestion[];
  actions?: Array<{
    type: 'create_task' | 'update_task' | 'create_project';
    data: unknown;
  }>;
}

export interface AIAnalyticsData {
  userId: string;
  feature: string;
  tokensUsed: number;
  cost: number;
  success: boolean;
  duration: number;
  timestamp: Date;
}

export interface AICapability {
  name: string;
  description: string;
  enabled: boolean;
  requiresPro: boolean;
}

export const AI_FEATURES: AICapability[] = [
  {
    name: 'Task Analysis',
    description: 'Get AI-powered insights and breakdowns for your tasks',
    enabled: true,
    requiresPro: true,
  },
  {
    name: 'Daily Recommendations',
    description: 'Receive personalized task prioritization each day',
    enabled: true,
    requiresPro: true,
  },
  {
    name: 'Project Planning',
    description: 'Generate project phases and task breakdowns',
    enabled: true,
    requiresPro: true,
  },
  {
    name: 'Chat Assistant',
    description: 'Have conversations with AI about your work',
    enabled: true,
    requiresPro: false,
  },
  {
    name: 'Productivity Insights',
    description: 'Get analytics and suggestions to improve productivity',
    enabled: true,
    requiresPro: true,
  },
];