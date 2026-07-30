'use client';

import { Task, TaskStatus } from '@/lib/tasks';

interface TaskCardProps {
  task: Task;
  onStatusChange: (id: number, status: TaskStatus) => void;
  onArchive: (id: number) => void;
}

const statusLabels: Record<TaskStatus, string> = {
  todo: 'Todo',
  in_progress: 'In Progress',
  complete: 'Complete',
};

export default function TaskCard({ task, onStatusChange, onArchive }: TaskCardProps) {
  return (
    <div className="border rounded-lg p-4 flex justify-between items-start gap-4 bg-white">
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-lg">{task.title}</h3>
          {task.is_overdue && (
            <span className="text-xs font-medium text-red-600 bg-red-100 px-2 py-0.5 rounded">
              Overdue
            </span>
          )}
        </div>
        {task.description && (
          <p className="text-gray-600 text-sm mt-1">{task.description}</p>
        )}
        <div className="flex gap-4 text-sm text-gray-500 mt-2">
          <span>Topic: {task.topic}</span>
          <span>Due: {task.due_date}</span>
        </div>
      </div>

      <div className="flex flex-col gap-2 items-end">
        <select
          value={task.status}
          onChange={(e) => onStatusChange(task.id, e.target.value as TaskStatus)}
          className="border rounded px-2 py-1 text-sm"
        >
          {Object.entries(statusLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>

        {!task.archived_at && (
          <button
            onClick={() => onArchive(task.id)}
            className="text-xs text-gray-500 hover:text-red-600"
          >
            Archive
          </button>
        )}
      </div>
    </div>
  );
}