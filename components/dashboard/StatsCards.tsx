// components/dashboard/StatsCards.tsx
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, Clock, ListTodo, TrendingUp } from 'lucide-react';

interface StatsCardsProps {
  stats: {
    total: number;
    todo: number;
    inProgress: number;
    done: number;
  };
  plan: string;
}

const StatsCards = ({ stats, plan }: StatsCardsProps) => {
  const cards = [
    {
      title: 'Total Tasks',
      value: stats.total,
      icon: ListTodo,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'To Do',
      value: stats.todo,
      icon: Clock,
      color: 'text-gray-600',
      bgColor: 'bg-gray-100',
    },
    {
      title: 'In Progress',
      value: stats.inProgress,
      icon: TrendingUp,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
    },
    {
      title: 'Completed',
      value: stats.done,
      icon: CheckCircle2,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {card.title}
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {card.value}
                </p>
              </div>
              <div className={`${card.bgColor} p-3 rounded-lg`}>
                <card.icon className={`h-6 w-6 ${card.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default StatsCards;