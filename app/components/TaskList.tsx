'use client';

import { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  useDroppable,
  useSensor,
  useSensors,
  PointerSensor,
  type DragStartEvent,
  type DragEndEvent,
} from '@dnd-kit/core';
import { Task, TaskStatus, SortField } from '@/lib/tasks';
import TaskCard from './TaskCard';
import DraggableTaskCard from './DraggableTaskCard';
import TaskEditModal from './TaskEditModal';

interface TaskListProps {
  tasks: Task[];
  sortBy: SortField;
  showArchived: boolean;
  onSortChange: (sortBy: SortField) => void;
  onToggleArchived: () => void;
  onStatusChange: (id: number, status: TaskStatus) => void;
  onArchive: (id: number) => void;
  onEdit: (id: number, updates: {
    title: string;
    description: string;
    due_date: string;
    topic: string;
  }) => void;
}

const columns: { status: TaskStatus; label: string; dot: string }[] = [
  { status: 'todo', label: 'Todo', dot: 'bg-slate-400' },
  { status: 'in_progress', label: 'In Progress', dot: 'bg-amber-400' },
  { status: 'complete', label: 'Complete', dot: 'bg-emerald-400' },
];

const sortOptions: { value: SortField; label: string }[] = [
  { value: 'due_date', label: 'Due Date' },
  { value: 'topic', label: 'Topic' },
];

function Column({
  status,
  label,
  dot,
  tasks,
  onArchive,
  onEditClick,
}: {
  status: TaskStatus;
  label: string;
  dot: string;
  tasks: Task[];
  onArchive: (id: number) => void;
  onEditClick: (task: Task) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: status });

  return (
    <div
      ref={setNodeRef}
      className={`flex-1 min-w-[260px] rounded-xl p-3 border transition-colors duration-150 ${
        isOver ? 'bg-blue-500/10 border-blue-500/50' : 'bg-slate-900/40 border-slate-800'
      }`}
    >
      <div className="flex items-center gap-2 mb-3 px-1">
        <span className={`w-2 h-2 rounded-full ${dot}`} />
        <h2 className="text-sm font-semibold text-slate-300">{label}</h2>
        <span className="text-xs text-slate-500 ml-auto">{tasks.length}</span>
      </div>

      <div className="space-y-2 min-h-[40px]">
        {tasks.length === 0 ? (
          <p className="text-xs text-slate-600 px-1">
            {isOver ? 'Drop here' : 'No tasks'}
          </p>
        ) : (
          tasks.map((task) => (
            <DraggableTaskCard
              key={task.id}
              task={task}
              onArchive={onArchive}
              onEdit={onEditClick}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default function TaskList({
  tasks,
  sortBy,
  showArchived,
  onSortChange,
  onToggleArchived,
  onStatusChange,
  onArchive,
  onEdit,
}: TaskListProps) {
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    })
  );

  function handleDragStart(event: DragStartEvent) {
    const task = tasks.find((t) => t.id === event.active.id);
    setActiveTask(task ?? null);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const newStatus = over.id as TaskStatus;
    const task = tasks.find((t) => t.id === active.id);

    if (task && task.status !== newStatus) {
      onStatusChange(task.id, newStatus);
    }
  }

  function handleSaveEdit(id: number, updates: {
    title: string;
    description: string;
    due_date: string;
    topic: string;
  }) {
    onEdit(id, updates);
    setEditingTask(null);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <label className="text-sm text-slate-400">Sort by</label>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as SortField)}
            className="border border-slate-700 rounded-md px-2 py-1 text-sm text-slate-200 bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={onToggleArchived}
          className="text-sm text-slate-400 hover:text-slate-200 border border-slate-700 rounded-md px-3 py-1 transition-colors"
        >
          {showArchived ? '← Back to board' : 'Show archived'}
        </button>
      </div>

      {showArchived ? (
        <div className="space-y-2">
          {tasks.length === 0 ? (
            <p className="text-slate-500 text-sm">No archived tasks.</p>
          ) : (
            tasks.map((task) => (
              <TaskCard key={task.id} task={task} onArchive={onArchive} />
            ))
          )}
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="flex gap-4 overflow-x-auto pb-4">
            {columns.map((col) => (
              <Column
                key={col.status}
                status={col.status}
                label={col.label}
                dot={col.dot}
                tasks={tasks.filter((t) => t.status === col.status)}
                onArchive={onArchive}
                onEditClick={setEditingTask}
              />
            ))}
          </div>

          <DragOverlay>
            {activeTask ? (
              <TaskCard task={activeTask} onArchive={onArchive} isOverlay />
            ) : null}
          </DragOverlay>
        </DndContext>
      )}

      {editingTask && (
        <TaskEditModal
          task={editingTask}
          onSave={handleSaveEdit}
          onClose={() => setEditingTask(null)}
        />
      )}
    </div>
  );
}