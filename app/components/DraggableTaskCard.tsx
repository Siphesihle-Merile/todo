'use client';

import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { Task } from '@/lib/tasks';
import TaskCard from './TaskCard';

interface DraggableTaskCardProps {
  task: Task;
  onArchive: (id: number) => void;
  onEdit: (task: Task) => void;
}

export default function DraggableTaskCard({ task, onArchive, onEdit }: DraggableTaskCardProps) {
  const isArchived = !!task.archived_at;

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
    disabled: isArchived,
  });

  const style: React.CSSProperties = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.3 : 1,
  };

  return (
    <TaskCard
      ref={setNodeRef}
      task={task}
      onArchive={onArchive}
      onEdit={onEdit}
      style={style}
      attributes={isArchived ? undefined : (attributes as unknown as Record<string, unknown>)}
      listeners={isArchived ? undefined : listeners}
    />
  );
}