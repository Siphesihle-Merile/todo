import { describe, it, expect, beforeEach, afterAll } from 'vitest';
import fs from 'fs';
import path from 'path';
import db from '../lib/db';
import { createTask, listTasks, archiveTask, updateTask } from '../lib/tasks';

const testDbPath = path.join(process.cwd(), 'test.db');

function cleanDb() {
  if (fs.existsSync(testDbPath)) fs.unlinkSync(testDbPath);
  if (fs.existsSync(testDbPath + '-wal')) fs.unlinkSync(testDbPath + '-wal');
  if (fs.existsSync(testDbPath + '-shm')) fs.unlinkSync(testDbPath + '-shm');
}

beforeEach(() => {
  db.exec('DELETE FROM tasks');
});

afterAll(() => {
  db.close();
  cleanDb();
});

describe('createTask', () => {
  it('creates a task with all required fields and returns it with defaults applied', () => {
    const task = createTask({
      title: 'Write report',
      description: 'Cover Q3 findings',
      due_date: '2026-08-10',
      topic: 'Work',
    });

    expect(task.title).toBe('Write report');
    expect(task.status).toBe('todo');
    expect(task.archived_at).toBeNull();
    expect(task.id).toBeTypeOf('number');
  });
});

describe('archiveTask', () => {
  it('sets archived_at instead of deleting the row', () => {
    const task = createTask({
      title: 'Old task',
      due_date: '2026-08-10',
      topic: 'Misc',
    });

    const archived = archiveTask(task.id);

    expect(archived?.archived_at).not.toBeNull();

    const activeList = listTasks({ includeArchived: false });
    expect(activeList.find((t) => t.id === task.id)).toBeUndefined();

    const fullList = listTasks({ includeArchived: true });
    expect(fullList.find((t) => t.id === task.id)).toBeDefined();
  });
});

describe('overdue derivation', () => {
  it('flags a task as overdue when its due date is in the past and status is not complete', () => {
    const task = createTask({
      title: 'Late task',
      due_date: '2020-01-01',
      topic: 'Test',
    });

    expect(task.is_overdue).toBe(true);
  });

  it('does not flag a task as overdue once its status is complete', () => {
    const task = createTask({
      title: 'Finished but late',
      due_date: '2020-01-01',
      topic: 'Test',
    });

    const updated = updateTask(task.id, { status: 'complete' });

    expect(updated?.is_overdue).toBe(false);
  });

  it('does not flag a task as overdue when its due date is in the future', () => {
    const task = createTask({
      title: 'Future task',
      due_date: '2099-01-01',
      topic: 'Test',
    });

    expect(task.is_overdue).toBe(false);
  });
});

describe('listTasks sorting', () => {
  it('sorts tasks by topic alphabetically when requested', () => {
    createTask({ title: 'B task', due_date: '2026-08-01', topic: 'Zoology' });
    createTask({ title: 'A task', due_date: '2026-08-01', topic: 'Biology' });

    const sorted = listTasks({ sortBy: 'topic' });
    const topics = sorted.map((t) => t.topic);

    expect(topics).toEqual(['Biology', 'Zoology']);
  });
});