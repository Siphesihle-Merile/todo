'use client';

import { useEffect, useState, useCallback } from 'react';
import { Task, TaskStatus, SortField } from '@/lib/tasks';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [sortBy, setSortBy] = useState<SortField>('due_date');
  const [showArchived, setShowArchived] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    const res = await fetch(
      `/api/tasks?sortBy=${sortBy}&includeArchived=${showArchived}`
    );
    const data = await res.json();
    const filtered = showArchived
      ? data.filter((t: Task) => t.archived_at)
      : data;
    setTasks(filtered);
    setLoading(false);
  }, [sortBy, showArchived]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  async function handleCreate(input: {
    title: string;
    description: string;
    due_date: string;
    topic: string;
  }) {
    await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });
    fetchTasks();
  }

  async function handleStatusChange(id: number, status: TaskStatus) {
    const previousTasks = tasks;

    setTasks((current) =>
      current.map((t) => (t.id === id ? { ...t, status } : t))
    );

    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) throw new Error('Update failed');
    } catch (err) {
      setTasks(previousTasks);
      console.error('Failed to update task status, reverted:', err);
    }
  }

  async function handleEdit(id: number, updates: {
    title: string;
    description: string;
    due_date: string;
    topic: string;
  }) {
    const previousTasks = tasks;

    setTasks((current) =>
      current.map((t) => (t.id === id ? { ...t, ...updates } : t))
    );

    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      if (!res.ok) throw new Error('Edit failed');
    } catch (err) {
      setTasks(previousTasks);
      console.error('Failed to edit task, reverted:', err);
    }
  }

  async function handleArchive(id: number) {
    const previousTasks = tasks;

    setTasks((current) => current.filter((t) => t.id !== id));

    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'archive' }),
      });

      if (!res.ok) throw new Error('Archive failed');
    } catch (err) {
      setTasks(previousTasks);
      console.error('Failed to archive task, reverted:', err);
    }
  }

  return (
    <main className="max-w-5xl mx-auto p-6 space-y-6 min-h-screen">
      <h1 className="text-2xl font-bold text-slate-100">Todo Board</h1>

      {!showArchived && <TaskForm onCreate={handleCreate} />}

      {loading ? (
        <p className="text-sm text-slate-500">Loading...</p>
      ) : (
        <TaskList
          tasks={tasks}
          sortBy={sortBy}
          showArchived={showArchived}
          onSortChange={setSortBy}
          onToggleArchived={() => setShowArchived((v) => !v)}
          onStatusChange={handleStatusChange}
          onArchive={handleArchive}
          onEdit={handleEdit}
        />
      )}
    </main>
  );
}