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
      return; // basic guard, browser 'required' attrs also enforce this
    }

    onCreate({ title, description, due_date: dueDate, topic });

    // Reset the form after a successful submit
    setTitle('');
    setDescription('');
    setDueDate('');
    setTopic('');
  }

  return (
    <form onSubmit={handleSubmit} className="border rounded-lg p-4 bg-white space-y-3">
      <h2 className="font-semibold text-lg">New Task</h2>

      <div>
        <label className="block text-sm text-gray-600 mb-1">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full border rounded px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="block text-sm text-gray-600 mb-1">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border rounded px-3 py-2 text-sm"
          rows={2}
        />
      </div>

      <div className="flex gap-3">
        <div className="flex-1">
          <label className="block text-sm text-gray-600 mb-1">Due Date</label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            required
            className="w-full border rounded px-3 py-2 text-sm"
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm text-gray-600 mb-1">Topic</label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            required
            className="w-full border rounded px-3 py-2 text-sm"
          />
        </div>
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700"
      >
        Add Task
      </button>
    </form>
  );
}