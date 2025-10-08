export interface TaskAnalysis {
  priority: 'low' | 'medium' | 'high' | 'urgent';
  estimatedTime: string;
  subtasks: string[];
  tips: string[];
  category: string;
}