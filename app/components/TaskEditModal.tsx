'use client';

import { useState } from 'react';
import { Task } from '@/lib/tasks';

interface TaskEditModalProps {
  task: Task;
  onSave: (id: number, updates: {
    title: string;
    description: string;
    due_date: string;
    topic: string;
  }) => void;
  onClose: () => void;
}

export default function TaskEditModal({ task, onSave, onClose }: TaskEditModalProps) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description ?? '');
  const [dueDate, setDueDate] = useState(task.due_date);
  const [topic, setTopic] = useState(task.topic);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !dueDate || !topic.trim()) return;
    onSave(task.id, { title, description, due_date: dueDate, topic });
  }

  const inputClasses =
    'w-full border border-slate-700 rounded-md px-3 py-2 text-sm text-slate-100 bg-slate-800 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500';

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <form
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
        className="border border-slate-700 rounded-xl p-5 bg-slate-900 space-y-3 shadow-2xl w-full max-w-md"
      >
        <h2 className="font-semibold text-lg text-slate-100">Edit Task</h2>

        <div>
          <label className="block text-sm text-slate-400 mb-1">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className={inputClasses}
          />
        </div>

        <div>
          <label className="block text-sm text-slate-400 mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={inputClasses}
            rows={2}
          />
        </div>

        <div className="flex gap-3">
          <div className="flex-1">
            <label className="block text-sm text-slate-400 mb-1">Due Date</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              required
              className={inputClasses}
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm text-slate-400 mb-1">Topic</label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              required
              className={inputClasses}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="text-sm text-slate-400 hover:text-slate-200 px-4 py-2 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-500 transition-colors"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}