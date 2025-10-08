'use client';

import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Target, Zap, BarChart3, Users, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
  {
    icon: Brain,
    title: 'AI-Powered Insights',
    description: 'Get intelligent task recommendations and priority suggestions based on your work patterns.',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    icon: Target,
    title: 'Smart Prioritization',
    description: 'Automatically organize tasks by urgency and importance using advanced AI algorithms.',
    color: 'from-purple-500 to-pink-500'
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Built with Next.js 15 for blazing-fast performance and instant page loads.',
    color: 'from-amber-500 to-orange-500'
  },
  {
    icon: BarChart3,
    title: 'Advanced Analytics',
    description: 'Track your productivity with detailed insights and beautiful visualizations.',
    color: 'from-green-500 to-emerald-500'
  },
  {
    icon: Users,
    title: 'Team Collaboration',
    description: 'Work seamlessly with your team and keep everyone aligned on project goals.',
    color: 'from-indigo-500 to-blue-500'
  },
  {
    icon: Shield,
    title: 'Enterprise Security',
    description: 'Bank-level encryption and security to keep your data safe and private.',
    color: 'from-red-500 to-rose-500'
  }
];

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.5 }
  }
};

const FeaturesSection = () => {
  return (
    <section id="features" className="py-20">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 transition-colors">
            Powerful Features for
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"> Modern Teams</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto transition-colors">
            Everything you need to manage tasks efficiently and boost productivity
          </p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={scaleIn}
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Card className="border-2 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300 h-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <CardHeader>
                  <div className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4`}>
                    <feature.icon className="h-7 w-7 text-white" />
                  </div>
                  <CardTitle className="text-xl mb-2 dark:text-white transition-colors">{feature.title}</CardTitle>
                  <CardDescription className="text-base dark:text-gray-400 transition-colors">{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default FeaturesSection;