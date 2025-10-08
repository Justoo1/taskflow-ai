'use client';

import { Card, CardDescription, CardHeader } from '@/components/ui/card';
import { Star } from 'lucide-react';
import { motion } from 'framer-motion';

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Product Manager',
    company: 'TechCorp',
    content: 'TaskFlow AI has completely transformed how our team manages projects. The AI recommendations are spot-on!',
    avatar: 'SJ'
  },
  {
    name: 'Michael Chen',
    role: 'Startup Founder',
    company: 'InnovateLab',
    content: 'I\'ve tried dozens of task management tools. TaskFlow AI is the only one that actually saves me time.',
    avatar: 'MC'
  },
  {
    name: 'Emily Rodriguez',
    role: 'Engineering Lead',
    company: 'DevStudio',
    content: 'The smart prioritization feature is a game-changer. Our team\'s productivity has increased by 40%.',
    avatar: 'ER'
  }
];

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const TestimonialsSection = () => {
  return (
    <section id="testimonials" className="py-20 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 transition-colors">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 transition-colors">
            Loved by Teams Worldwide
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 transition-colors">
            See what our users have to say about TaskFlow AI
          </p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
             variants={{
                hidden: { opacity: 0, y: 20 },
                visible: fadeInUp,
            }}
              whileHover={{ y: -5 }}
            >
              <Card className="h-full bg-white dark:bg-gray-800 border-2 hover:border-blue-300 dark:hover:border-blue-600 transition-all">
                <CardHeader>
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <CardDescription className="text-gray-700 dark:text-gray-300 text-base italic mb-6 transition-colors">
                    &ldquo;{testimonial.content}&rdquo;
                  </CardDescription>
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white transition-colors">{testimonial.name}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 transition-colors">
                        {testimonial.role} at {testimonial.company}
                      </div>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default TestimonialsSection;