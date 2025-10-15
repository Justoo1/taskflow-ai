// components/dashboard/Header.tsx
'use client';

import { useState } from 'react';
import { Bell, Search, Settings, User, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from '@/components/theme-toggle';
import { SearchDialog } from '@/components/dashboard/SearchDialog';
import { useNotifications } from '@/hooks/useNotifications';
import { getRelativeTime, getNotificationIcon, Notification } from '@/types/notification';
import { useRouter } from 'next/navigation';

interface HeaderProps {
  user: {
    name?: string | null;
    email: string;
  };
}

export function Header({ user }: HeaderProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const router = useRouter();
  
  const {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotifications();

  const handleNotificationClick = async (notification: Notification) => {
    // Mark as read
    if (!notification.read) {
      await markAsRead(notification.id);
    }

    // Navigate to action URL if available
    if (notification.actionUrl) {
      router.push(notification.actionUrl);
    }
  };

  return (
    <>
      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
      
      <header className="sticky top-0 z-40 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4 flex-1">
            <AnimatePresence mode="wait">
              {!searchOpen && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex items-center gap-4"
                >
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Dashboard
                  </h1>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSearchOpen(true)}
                    className="ml-auto lg:ml-0"
                  >
                    <Search className="h-5 w-5" />
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-semibold"
                    >
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </motion.span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-96 dark:bg-gray-800 dark:border-gray-700">
                <DropdownMenuLabel className="dark:text-white">
                  <div className="flex items-center justify-between">
                    <span>Notifications</span>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="dark:bg-gray-700 dark:text-gray-300">
                        {unreadCount} new
                      </Badge>
                      {unreadCount > 0 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={markAllAsRead}
                          className="h-6 text-xs"
                        >
                          Mark all read
                        </Button>
                      )}
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="dark:bg-gray-700" />
                
                <div className="max-h-96 overflow-y-auto">
                  {loading && (
                    <div className="p-4 text-center text-sm text-gray-500 dark:text-gray-400">
                      Loading notifications...
                    </div>
                  )}
                  
                  {!loading && notifications.length === 0 && (
                    <div className="p-8 text-center">
                      <Bell className="h-12 w-12 mx-auto text-gray-300 dark:text-gray-600 mb-2" />
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        No notifications yet
                      </p>
                    </div>
                  )}
                  
                  {!loading && notifications.map((notification) => (
                    <DropdownMenuItem 
                      key={notification.id} 
                      className="flex items-start gap-3 p-3 cursor-pointer dark:hover:bg-gray-700 relative group"
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="flex-shrink-0 text-xl mt-0.5">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className={`flex-1 min-w-0 ${!notification.read ? 'pr-8' : ''}`}>
                        <p className={`text-sm ${notification.read ? 'text-gray-600 dark:text-gray-400' : 'font-semibold text-gray-900 dark:text-white'}`}>
                          {notification.title}
                        </p>
                        {notification.message && (
                          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1 line-clamp-2">
                            {notification.message}
                          </p>
                        )}
                        <p className="text-xs text-gray-400 dark:text-gray-600 mt-1">
                          {getRelativeTime(notification.createdAt)}
                        </p>
                      </div>
                      {!notification.read && (
                        <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-blue-600" />
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity absolute top-2 right-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNotification(notification.id);
                        }}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </DropdownMenuItem>
                  ))}
                </div>
                
                {notifications.length > 0 && (
                  <>
                    <DropdownMenuSeparator className="dark:bg-gray-700" />
                    <DropdownMenuItem 
                      className="text-center justify-center text-blue-600 dark:text-blue-400 font-medium cursor-pointer"
                      onClick={() => router.push('/dashboard/notifications')}
                    >
                      View all notifications
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="hidden sm:flex rounded-full">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                    {(user.name || user.email).charAt(0).toUpperCase()}
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 dark:bg-gray-800 dark:border-gray-700">
                <DropdownMenuLabel className="dark:text-white">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-semibold">
                      {user.name || user.email.split('@')[0]}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="dark:bg-gray-700" />
                <DropdownMenuItem className="cursor-pointer dark:hover:bg-gray-700 dark:text-gray-300">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer dark:hover:bg-gray-700 dark:text-gray-300">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator className="dark:bg-gray-700" />
                <DropdownMenuItem className="cursor-pointer text-red-600 dark:text-red-400 dark:hover:bg-gray-700">
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
    </>
  );
}

export default Header