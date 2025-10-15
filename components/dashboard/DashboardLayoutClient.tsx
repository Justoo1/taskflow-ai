'use client';

import { useState, useEffect, ReactNode } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '@/components/dashboard/Sidebar';
import Header from '@/components/dashboard/Header';
import AIAssistantWidget from '@/components/ai/AIAssistantWidget';

interface DashboardLayoutClientProps {
  user: {
    id: string;
    name: string | null;
    email: string;
    image?: string | null;
  };
  taskCount: number;
  projectCount: number;
  subscriptionPlan?: 'FREE' | 'PRO' | 'ENTERPRISE';
  children: ReactNode;
}

export default function DashboardLayoutClient({
  user,
  taskCount,
  projectCount,
  subscriptionPlan,
  children,
}: DashboardLayoutClientProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    // Check on mount
    checkScreenSize();

    // Add event listener
    window.addEventListener('resize', checkScreenSize);

    // Cleanup
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
      {/* Sidebar */}
      <AnimatePresence mode="wait">
        {isSidebarOpen && (
          <motion.div
            initial={{ x: -256 }}
            animate={{ x: 0 }}
            exit={{ x: -256 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed inset-y-0 z-50"
          >
            <Sidebar user={user} taskCount={taskCount} projectCount={projectCount} subscriptionPlan={subscriptionPlan} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="fixed top-4 z-50 lg:flex hidden shadow-lg bg-white dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
        style={{
          left: isSidebarOpen ? '272px' : '16px',
          transition: 'left 0.3s ease',
        }}
      >
        {isSidebarOpen ? (
          <X className="h-4 w-4" />
        ) : (
          <Menu className="h-4 w-4" />
        )}
      </Button>

      {/* Main Content */}
      <motion.div
        animate={{
          paddingLeft: isDesktop && isSidebarOpen ? '256px' : '0px',
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="lg:pl-64"
      >
        <Header user={user}  />

        <main className="py-6 px-4 sm:px-6 lg:px-8">
          {children}
        </main>

        <AIAssistantWidget />
      </motion.div>
    </div>
  );
}
