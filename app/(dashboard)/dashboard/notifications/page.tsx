// app/(dashboard)/dashboard/notifications/page.tsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Check, CheckCheck, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useNotifications } from '@/hooks/useNotifications';
import { getRelativeTime, getNotificationIcon, getNotificationColor } from '@/types/notification';
import { useRouter } from 'next/navigation';
import { Notification } from '@/types/notification';

export default function NotificationsPage() {
  const router = useRouter();
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotifications();

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread' && notification.read) return false;
    if (typeFilter !== 'all' && notification.type !== typeFilter) return false;
    return true;
  });

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.read) {
      await markAsRead(notification.id);
    }
    if (notification.actionUrl) {
      router.push(notification.actionUrl);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Notifications
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Stay updated with your tasks and projects
        </p>
      </div>

      {/* Stats and Actions */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <Badge variant="secondary" className="text-sm">
            Total: {notifications.length}
          </Badge>
          <Badge variant="default" className="text-sm bg-blue-600">
            Unread: {unreadCount}
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          {/* Filter by read/unread */}
          <Select value={filter} onValueChange={(value: "all" | "unread") => setFilter(value)}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="unread">Unread</SelectItem>
            </SelectContent>
          </Select>

          {/* Filter by type */}
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="TASK_ASSIGNED">Task Assigned</SelectItem>
              <SelectItem value="TASK_COMPLETED">Completed</SelectItem>
              <SelectItem value="TASK_DUE_SOON">Due Soon</SelectItem>
              <SelectItem value="TASK_OVERDUE">Overdue</SelectItem>
              <SelectItem value="COMMENT_ADDED">Comments</SelectItem>
              <SelectItem value="PROJECT_UPDATE">Projects</SelectItem>
            </SelectContent>
          </Select>

          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={markAllAsRead}
              className="gap-2"
            >
              <CheckCheck className="h-4 w-4" />
              Mark all read
            </Button>
          )}
        </div>
      </div>

      {/* Notifications List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Loading notifications...
          </p>
        </div>
      ) : filteredNotifications.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Bell className="h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No notifications
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-center max-w-sm">
              {filter === 'unread' 
                ? "You're all caught up! No unread notifications." 
                : "You don't have any notifications yet. They'll appear here when you have updates."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredNotifications.map((notification, index) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card 
                className={`cursor-pointer transition-all hover:shadow-md ${
                  !notification.read 
                    ? 'border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/20' 
                    : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
                }`}
                onClick={() => handleNotificationClick(notification)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 text-2xl">
                      {getNotificationIcon(notification.type)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className={`text-sm font-semibold ${
                          !notification.read 
                            ? 'text-gray-900 dark:text-white' 
                            : 'text-gray-700 dark:text-gray-300'
                        }`}>
                          {notification.title}
                        </h3>
                        {!notification.read && (
                          <div className="flex-shrink-0 w-2 h-2 rounded-full bg-blue-600 mt-1.5" />
                        )}
                      </div>

                      {notification.message && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          {notification.message}
                        </p>
                      )}

                      <div className="flex items-center gap-3 text-xs">
                        <span className={getNotificationColor(notification.type)}>
                          {notification.type.replace(/_/g, ' ')}
                        </span>
                        <span className="text-gray-500 dark:text-gray-500">
                          {getRelativeTime(notification.createdAt)}
                        </span>
                      </div>
                    </div>

                    <div className="flex-shrink-0 flex items-center gap-2">
                      {!notification.read && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={(e) => {
                            e.stopPropagation();
                            markAsRead(notification.id);
                          }}
                          title="Mark as read"
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNotification(notification.id);
                        }}
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}