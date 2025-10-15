-- Add Performance Indexes
-- Run this SQL script manually in your database if migrations fail

-- Add composite index for Task queries by userId and status
CREATE INDEX IF NOT EXISTS "Task_userId_status_idx" ON "Task"("userId", "status");

-- Add index for Task dueDate queries
CREATE INDEX IF NOT EXISTS "Task_dueDate_idx" ON "Task"("dueDate");

-- Verify indexes were created
SELECT
    tablename,
    indexname,
    indexdef
FROM
    pg_indexes
WHERE
    tablename IN ('Task', 'Project', 'Subscription', 'User')
ORDER BY
    tablename, indexname;
