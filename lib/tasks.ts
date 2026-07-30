import db from './db';

export type TaskStatus = 'todo' | 'in_progress' | 'complete';
export type SortField = 'topic' | 'status' | 'due_date';

export interface Task {
  id: number;
  title: string;
  description: string | null;
  due_date: string;
  topic: string;
  status: TaskStatus;
  archived_at: string | null;
  created_at: string;
  updated_at: string;
  is_overdue: boolean; // computed, not stored
}

// Turns a raw database row into a Task, computing is_overdue on the fly
function withOverdueFlag(row: any): Task {
  const today = new Date().toISOString().slice(0, 10); // 'YYYY-MM-DD'
  return {
    ...row,
    is_overdue: row.status !== 'complete' && row.due_date < today,
  };
}

export function createTask(input: {
  title: string;
  description?: string;
  due_date: string;
  topic: string;
}): Task {
  const stmt = db.prepare(`
    INSERT INTO tasks (title, description, due_date, topic)
    VALUES (@title, @description, @due_date, @topic)
  `);
  const result = stmt.run({
    title: input.title,
    description: input.description ?? null,
    due_date: input.due_date,
    topic: input.topic,
  });
  return getTaskById(result.lastInsertRowid as number)!;
}

export function getTaskById(id: number): Task | undefined {
  const row = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
  return row ? withOverdueFlag(row) : undefined;
}

export function listTasks(options: {
  sortBy?: SortField;
  includeArchived?: boolean;
} = {}): Task[] {
  const { sortBy = 'due_date', includeArchived = false } = options;

  // Whitelist sort columns to prevent SQL injection via sort param
  const validSortColumns: Record<SortField, string> = {
    topic: 'topic',
    status: 'status',
    due_date: 'due_date',
  };
  const column = validSortColumns[sortBy];

  const whereClause = includeArchived ? '' : 'WHERE archived_at IS NULL';
  const rows = db
    .prepare(`SELECT * FROM tasks ${whereClause} ORDER BY ${column} ASC`)
    .all();

  return rows.map(withOverdueFlag);
}

export function updateTask(
  id: number,
  input: Partial<{
    title: string;
    description: string;
    due_date: string;
    topic: string;
    status: TaskStatus;
  }>
): Task | undefined {
  const existing = getTaskById(id);
  if (!existing) return undefined;

  const merged = { ...existing, ...input };

  db.prepare(`
    UPDATE tasks
    SET title = @title, description = @description, due_date = @due_date,
        topic = @topic, status = @status, updated_at = datetime('now')
    WHERE id = @id
  `).run({
    id,
    title: merged.title,
    description: merged.description,
    due_date: merged.due_date,
    topic: merged.topic,
    status: merged.status,
  });

  return getTaskById(id);
}

export function archiveTask(id: number): Task | undefined {
  db.prepare(`
    UPDATE tasks SET archived_at = datetime('now'), updated_at = datetime('now')
    WHERE id = ?
  `).run(id);
  return getTaskById(id);
}