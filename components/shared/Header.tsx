'use client';

import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  user: {
    id: string;
    name: string | null;
    email: string;
    image?: string | null;
  };
}

const Header = ({ user }: HeaderProps) => {
  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
      {/* Mobile menu button */}
      <Button variant="ghost" size="icon" className="lg:hidden">
        <Menu className="h-6 w-6" />
      </Button>

      {/* Separator */}
      <div className="h-6 w-px bg-gray-200 lg:hidden" />

      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <div className="flex flex-1 items-center">
          <h1 className="text-lg font-semibold text-gray-900">
            Welcome back, {(user.name || user.email).split(' ')[0]}!
          </h1>
        </div>
      </div>
    </header>
  );
}

export default Header