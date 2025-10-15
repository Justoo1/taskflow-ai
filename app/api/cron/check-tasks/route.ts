// app/api/cron/check-tasks/route.ts
/**
 * Cron job to check for tasks that are due soon or overdue
 * This should be called periodically (e.g., once per day)
 * 
 * Set up in Vercel:
 * 1. Go to your project settings
 * 2. Add a new cron job
 * 3. Schedule: 0 9 * * * (every day at 9 AM)
 * 4. URL: /api/cron/check-tasks
 * 
 * Or use this with a service like cron-job.org pointing to:
 * https://yourdomain.com/api/cron/check-tasks
 * 
 * For security, add a CRON_SECRET to your .env:
 * CRON_SECRET=your-random-secret-key
 */

import { NextRequest, NextResponse } from 'next/server';
import { notifyTasksDueSoon, notifyOverdueTasks } from '@/lib/notification-utils';

export async function GET(request: NextRequest) {
  try {
    // Verify the request is authorized (optional but recommended)
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check for tasks due soon
    await notifyTasksDueSoon();

    // Check for overdue tasks
    await notifyOverdueTasks();

    return NextResponse.json({
      success: true,
      message: 'Task notifications checked successfully',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Cron job error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to check tasks',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Also support POST for manual triggers
export async function POST(request: NextRequest) {
  return GET(request);
}