'use client';

import { Fragment } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  CheckSquare,
  FolderKanban,
  Settings,
  Sparkles,
  LogOut,
  X,
  Crown,
} from 'lucide-react';
import { signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';

interface MobileSidebarProps {
  user: {
    id: string;
    name: string | null;
    email: string;
    image?: string | null;
  };
  isOpen: boolean;
  onClose: () => void;
  taskCount: number;
  projectCount: number;
}

const MobileSidebar = ({ user, isOpen, onClose, taskCount, projectCount }: MobileSidebarProps) => {
  const pathname = usePathname();

  const navigation = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      name: 'Tasks',
      href: '/dashboard/tasks',
      icon: CheckSquare,
      badge: taskCount > 0 ? taskCount.toString() : null,
    },
    {
      name: 'Projects',
      href: '/dashboard/projects',
      icon: FolderKanban,
      badge: projectCount > 0 ? projectCount.toString() : null,
    },
    {
      name: 'AI Assistant',
      href: '/dashboard/ai',
      icon: Sparkles,
      badge: 'New',
    },
    {
      name: 'Settings',
      href: '/dashboard/settings',
      icon: Settings,
      badge: null,
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-gray-900/80 backdrop-blur-sm lg:hidden"
            onClick={onClose}
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed inset-y-0 left-0 z-50 w-72 lg:hidden"
          >
            <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-6 pb-4 h-full">
              {/* Header */}
              <div className="flex h-16 shrink-0 items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl">
                    <Sparkles className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    TaskFlow AI
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Navigation */}
              <nav className="flex flex-1 flex-col">
                <ul role="list" className="flex flex-1 flex-col gap-y-7">
                  <li>
                    <ul role="list" className="-mx-2 space-y-1">
                      {navigation.map((item) => {
                        const isActive = pathname === item.href;
                        
                        return (
                          <li key={item.name}>
                            <Link
                              href={item.href}
                              onClick={onClose}
                              className={cn(
                                'group flex items-center justify-between gap-x-3 rounded-xl p-3 text-sm leading-6 font-semibold transition-all',
                                isActive
                                  ? 'bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-600 dark:text-blue-400 shadow-sm'
                                  : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                              )}
                            >
                              <div className="flex items-center gap-x-3">
                                <item.icon
                                  className={cn(
                                    'h-5 w-5 shrink-0',
                                    isActive 
                                      ? 'text-blue-600 dark:text-blue-400' 
                                      : 'text-gray-400 dark:text-gray-500 group-hover:text-blue-600 dark:group-hover:text-blue-400'
                                  )}
                                />
                                <span>{item.name}</span>
                              </div>
                              
                              {item.badge && (
                                <Badge 
                                  variant="secondary" 
                                  className={cn(
                                    "text-xs px-2 py-0.5",
                                    isActive 
                                      ? "bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300" 
                                      : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                                  )}
                                >
                                  {item.badge}
                                </Badge>
                              )}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </li>

                  {/* Upgrade Card */}
                  <li>
                    <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 p-4 shadow-lg">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-8 -mt-8" />
                      <div className="relative">
                        <div className="flex items-center gap-2 mb-2">
                          <Crown className="h-5 w-5 text-yellow-300" />
                          <span className="text-sm font-bold text-white">Upgrade to Pro</span>
                        </div>
                        <p className="text-xs text-blue-100 mb-3">
                          Unlock unlimited tasks and AI features
                        </p>
                        <Button 
                          size="sm" 
                          className="w-full bg-white text-blue-600 hover:bg-gray-100 font-semibold shadow-md"
                        >
                          Upgrade Now
                        </Button>
                      </div>
                    </div>
                  </li>

                  {/* User Section */}
                  <li className="mt-auto">
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                      <div className="flex items-center gap-x-3 px-2 py-3 rounded-xl bg-gray-50 dark:bg-gray-800">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold shadow-md">
                          {(user.name || user.email).charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                            {user.name || user.email.split('@')[0]}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                            {user.email}
                          </p>
                        </div>
                      </div>
                      
                      <Button
                        variant="ghost"
                        className="w-full justify-start mt-2 text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        onClick={() => signOut({ callbackUrl: '/login' })}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign out
                      </Button>
                    </div>
                  </li>
                </ul>
              </nav>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileSidebar;