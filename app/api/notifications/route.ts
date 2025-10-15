// app/api/notifications/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getNotifications, getUnreadCount } from '@/actions/notifications';

/**
 * GET /api/notifications - Get user notifications
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '50');
    const unreadOnly = searchParams.get('unread') === 'true';

    if (unreadOnly) {
      const count = await getUnreadCount();
      return NextResponse.json({ count });
    }

    const notifications = await getNotifications(limit);

    return NextResponse.json({ 
      notifications,
      count: notifications.length 
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch notifications' },
      { status: 500 }
    );
  }
}
