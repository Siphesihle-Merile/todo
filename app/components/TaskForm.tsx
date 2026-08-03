'use client';

import { useState } from 'react';

interface TaskFormProps {
  onCreate: (task: {
    title: string;
    description: string;
    due_date: string;
    topic: string;
  }) => void;
}

export default function TaskForm({ onCreate }: TaskFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [topic, setTopic] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!title.trim() || !dueDate || !topic.trim()) {
      return;
    }

    onCreate({ title, description, due_date: dueDate, topic });

    setTitle('');
    setDescription('');
    setDueDate('');
    setTopic('');
  }

  const inputClasses =
    'w-full border border-slate-700 rounded-md px-3 py-2 text-sm text-slate-100 bg-slate-800 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500';

  return (
    <form
      onSubmit={handleSubmit}
      className="border border-slate-700 rounded-xl p-5 bg-slate-800/50 space-y-3 shadow-lg"
    >
      <h2 className="font-semibold text-lg text-slate-100">New Task</h2>

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

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-500 transition-colors"
      >
        + Add Task
      </button>
    </form>
  );
}