'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  Zap, 
  Shield, 
  Brain,
  Target,
  Rocket,
  BarChart3,
  Users,
  Star,
  Menu,
  X
} from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useState } from 'react';

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] }
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

  const scaleIn = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.5 }
    }
  };

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

  const stats = [
    { value: '10K+', label: 'Active Users' },
    { value: '1M+', label: 'Tasks Completed' },
    { value: '99.9%', label: 'Uptime' },
    { value: '4.9/5', label: 'User Rating' }
  ];

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

  const pricingPlans = [
    {
      name: 'Free',
      price: '$0',
      description: 'Perfect for individuals',
      features: [
        'Up to 50 tasks',
        'Basic AI insights',
        '3 projects',
        'Mobile app access',
        'Email support'
      ],
      cta: 'Get Started',
      popular: false
    },
    {
      name: 'Pro',
      price: '$12',
      description: 'Best for professionals',
      features: [
        'Unlimited tasks',
        'Advanced AI recommendations',
        'Unlimited projects',
        'Priority support',
        'Team collaboration',
        'Advanced analytics',
        'Custom integrations'
      ],
      cta: 'Start Free Trial',
      popular: true
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      description: 'For large organizations',
      features: [
        'Everything in Pro',
        'Dedicated support',
        'Custom AI training',
        'SLA guarantee',
        'Advanced security',
        'On-premise option',
        'Custom workflows'
      ],
      cta: 'Contact Sales',
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Floating Navigation */}
      <motion.header 
        className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-6xl px-4"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <nav className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg border border-gray-200/50 px-6 py-4">
          <div className="flex items-center justify-between">
            <motion.div 
              className="flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-2 rounded-xl">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                TaskFlow AI
              </span>
            </motion.div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">
              <Link href="#features" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                Features
              </Link>
              <Link href="#pricing" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                Pricing
              </Link>
              <Link href="#testimonials" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                Testimonials
              </Link>
            </div>

            <div className="hidden md:flex items-center gap-4">
              <Link href="/login">
                <Button variant="ghost" className="font-medium">Sign in</Button>
              </Link>
              <Link href="/register">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 font-medium">
                    Get Started <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </motion.div>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <motion.div 
              className="md:hidden pt-4 pb-2 space-y-3"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <Link href="#features" className="block text-gray-700 hover:text-blue-600 transition-colors font-medium">
                Features
              </Link>
              <Link href="#pricing" className="block text-gray-700 hover:text-blue-600 transition-colors font-medium">
                Pricing
              </Link>
              <Link href="#testimonials" className="block text-gray-700 hover:text-blue-600 transition-colors font-medium">
                Testimonials
              </Link>
              <div className="flex flex-col gap-2 pt-2">
                <Link href="/login">
                  <Button variant="ghost" className="w-full">Sign in</Button>
                </Link>
                <Link href="/register">
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600">
                    Get Started
                  </Button>
                </Link>
              </div>
            </motion.div>
          )}
        </nav>
      </motion.header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-32 pb-20">
        <motion.div 
          className="max-w-5xl mx-auto text-center space-y-8"
          style={{ opacity, scale }}
        >
          <motion.div 
            className="inline-block"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-full text-sm font-semibold shadow-lg inline-flex items-center gap-2">
              <Rocket className="h-4 w-4" />
              AI-Powered Task Management
            </span>
          </motion.div>
          
          <motion.h1 
            className="text-5xl md:text-7xl font-bold text-gray-900 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Task Management,
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
              Supercharged by AI
            </span>
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            Stop managing tasks manually. Let AI help you prioritize, organize, 
            and complete your work faster than ever before.
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Link href="/register">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8 py-6 shadow-xl">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </motion.div>
            </Link>
            <Link href="#features">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-2">
                  See How It Works
                </Button>
              </motion.div>
            </Link>
          </motion.div>

          <motion.div
            className="flex flex-wrap items-center justify-center gap-6 pt-8 text-sm text-gray-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <span>Free 14-day trial</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <span>Cancel anytime</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Hero Image/Demo */}
        <motion.div
          className="max-w-6xl mx-auto mt-20"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl blur-3xl opacity-20"></div>
            <div className="relative bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-6 py-4 flex items-center gap-2">
                <div className="flex gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-500"></div>
                  <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                  <div className="h-3 w-3 rounded-full bg-green-500"></div>
                </div>
                <span className="text-gray-400 text-sm ml-4">TaskFlow AI Dashboard</span>
              </div>
              <div className="p-8 bg-gradient-to-br from-blue-50 to-purple-50">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[1, 2, 3].map((i) => (
                    <motion.div
                      key={i}
                      className="bg-white rounded-xl p-6 shadow-lg"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 + i * 0.1 }}
                    >
                      <div className="h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg mb-4"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-100 rounded w-full"></div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: fadeInUp,
                }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Powerful Features for
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"> Modern Teams</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
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
                <Card className="border-2 hover:border-blue-300 transition-all duration-300 h-full bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <div className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4`}>
                      <feature.icon className="h-7 w-7 text-white" />
                    </div>
                    <CardTitle className="text-xl mb-2">{feature.title}</CardTitle>
                    <CardDescription className="text-base">{feature.description}</CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Loved by Teams Worldwide
            </h2>
            <p className="text-xl text-gray-600">
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
                <Card className="h-full bg-white border-2 hover:border-blue-300 transition-all">
                  <CardHeader>
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <CardDescription className="text-gray-700 text-base italic mb-6">
                      &ldquo;{testimonial.content}&rdquo;
                    </CardDescription>
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold">
                        {testimonial.avatar}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{testimonial.name}</div>
                        <div className="text-sm text-gray-600">
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

      {/* Pricing Section */}
      <section id="pricing" className="py-20">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600">
              Choose the plan that&apos;s right for you
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={index}
                variants={scaleIn}
                whileHover={{ y: -10 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Card className={`relative h-full ${plan.popular ? 'border-4 border-blue-500 shadow-2xl' : 'border-2'}`}>
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                        Most Popular
                      </span>
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                    <div className="pt-4">
                      <span className="text-5xl font-bold text-gray-900">{plan.price}</span>
                      {plan.price !== 'Custom' && <span className="text-gray-600 ml-2">/month</span>}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Link href="/register">
                      <Button 
                        className={`w-full ${plan.popular ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700' : ''}`}
                        variant={plan.popular ? 'default' : 'outline'}
                        size="lg"
                      >
                        {plan.cta}
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600">
        <div className="container mx-auto px-4">
          <motion.div 
            className="max-w-4xl mx-auto text-center text-white space-y-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold">
              Ready to Transform Your Workflow?
            </h2>
            <p className="text-xl opacity-90">
              Join thousands of teams already using TaskFlow AI to boost their productivity
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-6">
                    Start Your Free Trial
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </motion.div>
              </Link>
            </div>
            <p className="text-sm opacity-75">
              14-day free trial • No credit card required • Cancel anytime
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#features" className="hover:text-white transition-colors">Features</Link></li>
                <li><Link href="#pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><Link href="/login" className="hover:text-white transition-colors">Sign in</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Blog</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Careers</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Resources</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#" className="hover:text-white transition-colors">Documentation</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Help Center</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">API</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Legal</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#" className="hover:text-white transition-colors">Privacy</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Terms</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Security</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <Sparkles className="h-6 w-6 text-blue-500" />
              <span className="font-bold text-lg">TaskFlow AI</span>
            </div>
            <p className="text-gray-400 text-sm">
              © 2025 TaskFlow AI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}