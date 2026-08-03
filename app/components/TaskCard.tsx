'use client';

import { forwardRef } from 'react';
import { Task, TaskStatus } from '@/lib/tasks';

interface TaskCardProps {
  task: Task;
  onArchive: (id: number) => void;
  onEdit?: (task: Task) => void;
  isOverlay?: boolean;
  style?: React.CSSProperties;
  attributes?: Record<string, unknown>;
  listeners?: Record<string, unknown>;
}

const statusBadge: Record<TaskStatus, { label: string; color: string }> = {
  todo: { label: 'Todo', color: 'bg-slate-700 text-slate-300' },
  in_progress: { label: 'In Progress', color: 'bg-amber-500/20 text-amber-300' },
  complete: { label: 'Complete', color: 'bg-emerald-500/20 text-emerald-300' },
};

const topicColors = [
  'border-l-purple-400',
  'border-l-sky-400',
  'border-l-pink-400',
  'border-l-teal-400',
  'border-l-orange-400',
];

const topicBadgeColors = [
  'bg-purple-500/20 text-purple-300',
  'bg-sky-500/20 text-sky-300',
  'bg-pink-500/20 text-pink-300',
  'bg-teal-500/20 text-teal-300',
  'bg-orange-500/20 text-orange-300',
];

function topicIndex(topic: string) {
  const hash = topic.split('').reduce((sum, c) => sum + c.charCodeAt(0), 0);
  return hash % topicColors.length;
}

const TaskCard = forwardRef<HTMLDivElement, TaskCardProps>(function TaskCard(
  { task, onArchive, onEdit, isOverlay, style, attributes, listeners },
  ref
) {
  const isArchived = !!task.archived_at;
  const idx = topicIndex(task.topic);

  return (
    <div
      ref={ref}
      style={style}
      {...attributes}
      {...listeners}
      className={`
        group relative rounded-lg border-l-4 p-3 shadow-md select-none
        transition-shadow duration-200 ease-out
        ${isArchived ? 'bg-slate-800/40 opacity-60 border-l-slate-600 cursor-default' : `bg-slate-800 ${topicColors[idx]}`}
        ${!isArchived && !isOverlay ? 'cursor-grab active:cursor-grabbing hover:-translate-y-1 hover:shadow-xl hover:shadow-black/30' : ''}
        ${isOverlay ? 'shadow-2xl shadow-black/50 rotate-2 cursor-grabbing' : ''}
      `}
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-medium text-slate-100 text-sm leading-snug">
          {task.title}
        </h3>
        {task.is_overdue && (
          <span className="shrink-0 text-[10px] font-semibold text-red-300 bg-red-500/20 px-1.5 py-0.5 rounded">
            OVERDUE
          </span>
        )}
      </div>

      {task.description && (
        <p className="text-slate-400 text-xs mt-1.5 line-clamp-2">
          {task.description}
        </p>
      )}

      <div className="flex items-center justify-between mt-3">
        <span
          className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${topicBadgeColors[idx]}`}
        >
          {task.topic}
        </span>
        <span className="text-[10px] text-slate-500">{task.due_date}</span>
      </div>

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-700/60">
        <span
          className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${statusBadge[task.status].color}`}
        >
          {statusBadge[task.status].label}
        </span>

        {!isArchived && !isOverlay && (
          <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onPointerDown={(e) => e.stopPropagation()}
              onClick={() => onEdit?.(task)}
              className="text-[11px] text-slate-500 hover:text-blue-400 transition-colors"
            >
              Edit
            </button>
            <button
              onPointerDown={(e) => e.stopPropagation()}
              onClick={() => onArchive(task.id)}
              className="text-[11px] text-slate-500 hover:text-red-400 transition-colors"
            >
              Archive
            </button>
          </div>
        )}

        {isArchived && <span className="text-[10px] text-slate-500">Archived</span>}
      </div>
    </div>
  );
});

export default TaskCard;