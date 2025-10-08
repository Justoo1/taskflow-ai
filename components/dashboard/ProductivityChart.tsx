// components/dashboard/ProductivityChart.tsx
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

interface ProductivityData {
  day: string;
  completed: number;
  total: number;
}

const ProductivityChart = () => {
  // Mock data - replace with real data from your API
  const data: ProductivityData[] = [
    { day: 'Mon', completed: 8, total: 12 },
    { day: 'Tue', completed: 12, total: 15 },
    { day: 'Wed', completed: 6, total: 10 },
    { day: 'Thu', completed: 15, total: 18 },
    { day: 'Fri', completed: 10, total: 14 },
    { day: 'Sat', completed: 5, total: 8 },
    { day: 'Sun', completed: 3, total: 5 },
  ];

  const maxValue = Math.max(...data.map(d => d.total));
  const weekTotal = data.reduce((sum, d) => sum + d.completed, 0);
  const weekGoal = data.reduce((sum, d) => sum + d.total, 0);
  const completionRate = Math.round((weekTotal / weekGoal) * 100);

  return (
    <Card className="border-2 hover:shadow-lg transition-shadow">
      <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-purple-600" />
            <CardTitle className="text-lg">Weekly Productivity</CardTitle>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1 text-green-600 text-sm font-semibold">
              <TrendingUp className="w-4 h-4" />
              {completionRate}%
            </div>
            <p className="text-xs text-gray-500">{weekTotal} / {weekGoal} tasks</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        {/* Chart */}
        <div className="space-y-6">
          <div className="flex items-end justify-between h-48 gap-3">
            {data.map((item, index) => {
              const completedHeight = (item.completed / maxValue) * 100;
              const totalHeight = (item.total / maxValue) * 100;
              
              return (
                <motion.div 
                  key={item.day} 
                  className="flex-1 flex flex-col items-center gap-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <div className="w-full relative" style={{ height: '100%' }}>
                    {/* Total bar (background) */}
                    <motion.div 
                      className="absolute bottom-0 w-full bg-gray-100 rounded-t-lg"
                      initial={{ height: 0 }}
                      animate={{ height: `${totalHeight}%` }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    />
                    
                    {/* Completed bar (foreground) */}
                    <motion.div 
                      className="absolute bottom-0 w-full bg-gradient-to-t from-blue-500 to-purple-500 rounded-t-lg hover:from-blue-600 hover:to-purple-600 transition-all cursor-pointer group"
                      initial={{ height: 0 }}
                      animate={{ height: `${completedHeight}%` }}
                      transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
                      whileHover={{ scale: 1.05 }}
                    >
                      {/* Tooltip on hover */}
                      <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        <div className="bg-gray-900 text-white text-xs rounded-lg py-1 px-2 whitespace-nowrap">
                          {item.completed} / {item.total}
                        </div>
                        <div className="w-2 h-2 bg-gray-900 transform rotate-45 mx-auto -mt-1"></div>
                      </div>
                    </motion.div>
                  </div>

                  {/* Day label */}
                  <span className="text-xs font-medium text-gray-600">
                    {item.day}
                  </span>
                </motion.div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-6 pt-4 border-t">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gradient-to-br from-blue-500 to-purple-500 rounded"></div>
              <span className="text-xs text-gray-600">Completed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gray-200 rounded"></div>
              <span className="text-xs text-gray-600">Remaining</span>
            </div>
          </div>

          {/* Insights */}
          <motion.div 
            className="grid grid-cols-3 gap-4 pt-4 border-t"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{weekTotal}</p>
              <p className="text-xs text-gray-500">Completed</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{completionRate}%</p>
              <p className="text-xs text-gray-500">Success Rate</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{weekGoal - weekTotal}</p>
              <p className="text-xs text-gray-500">Remaining</p>
            </div>
          </motion.div>
        </div>
      </CardContent>
    </Card>
  );
}

export default ProductivityChart;