'use client';

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
} from 'lucide-react';
import { signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  user: {
    id: string;
    name: string | null;
    email: string;
    image?: string | null;
  };
}

const navigation = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: 'Tasks',
    href: '/dashboard/tasks',
    icon: CheckSquare,
  },
  {
    name: 'Projects',
    href: '/dashboard/projects',
    icon: FolderKanban,
  },
  {
    name: 'AI Assistant',
    href: '/dashboard/ai',
    icon: Sparkles,
  },
  {
    name: 'Settings',
    href: '/dashboard/settings',
    icon: Settings,
  },
];

const Sidebar = ({ user }: SidebarProps) => {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 pb-4">
          {/* Logo */}
          <div className="flex h-16 shrink-0 items-center gap-2">
            <Sparkles className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">TaskFlow AI</span>
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
                          className={cn(
                            'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold transition-colors',
                            isActive
                              ? 'bg-blue-50 text-blue-600'
                              : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                          )}
                        >
                          <item.icon
                            className={cn(
                              'h-6 w-6 shrink-0',
                              isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-blue-600'
                            )}
                          />
                          {item.name}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </li>

              {/* User Section */}
              <li className="mt-auto">
                <div className="flex items-center gap-x-4 px-2 py-3 text-sm font-semibold leading-6 text-gray-900 border-t border-gray-200">
                  <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                    {(user.name || user.email).charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {user.name || user.email}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {user.email}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-gray-700 hover:text-red-600 hover:bg-red-50"
                  onClick={() => signOut({ callbackUrl: '/login' })}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </Button>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Mobile Sidebar - You can implement a mobile menu here */}
      {/* For now, we'll keep it simple with just desktop */}
    </>
  );
}

export default Sidebar;