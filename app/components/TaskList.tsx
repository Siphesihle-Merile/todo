'use client';

import { Task, TaskStatus, SortField } from '@/lib/tasks';
import TaskCard from './TaskCard';

interface TaskListProps {
  tasks: Task[];
  sortBy: SortField;
  onSortChange: (sortBy: SortField) => void;
  onStatusChange: (id: number, status: TaskStatus) => void;
  onArchive: (id: number) => void;
}

const sortOptions: { value: SortField; label: string }[] = [
  { value: 'due_date', label: 'Due Date' },
  { value: 'topic', label: 'Topic' },
  { value: 'status', label: 'Status' },
];

export default function TaskList({
  tasks,
  sortBy,
  onSortChange,
  onStatusChange,
  onArchive,
}: TaskListProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <label className="text-sm text-gray-600">Sort by:</label>
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value as SortField)}
          className="border rounded px-2 py-1 text-sm"
        >
          {sortOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {tasks.length === 0 ? (
        <p className="text-gray-500 text-sm">No tasks yet — add one above.</p>
      ) : (
        <div className="space-y-2">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onStatusChange={onStatusChange}
              onArchive={onArchive}
            />
          ))}
        </div>
      )}
    </div>
  );
}