// components/dashboard/QuickActions.tsx
'use client';

import { Button } from '@/components/ui/button';
import { Plus, Sparkles, FolderPlus } from 'lucide-react';

const QuickActions = () =>{
  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold mb-2">Ready to be productive?</h2>
          <p className="text-blue-100">
            Create tasks, start projects, or let AI help you plan your day
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="secondary"
            onClick={() => console.log('Create task')}
          >
            <Plus className="mr-2 h-4 w-4" />
            New Task
          </Button>
          <Button
            variant="secondary"
            onClick={() => console.log('Create project')}
          >
            <FolderPlus className="mr-2 h-4 w-4" />
            New Project
          </Button>
          <Button
            variant="secondary"
            onClick={() => console.log('AI assistant')}
          >
            <Sparkles className="mr-2 h-4 w-4" />
            Ask AI
          </Button>
        </div>
      </div>
    </div>
  );
}

export default QuickActions;