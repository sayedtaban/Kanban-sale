'use client';

import { DealWithDetails } from '@/lib/types';
import { DealCard } from './deal-card';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface SortableDealCardProps {
  deal: DealWithDetails;
  onEdit?: (deal: DealWithDetails) => void;
  onView?: (deal: DealWithDetails) => void;
}

export function SortableDealCard({ deal, onEdit, onView }: SortableDealCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: deal.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: isDragging ? 'none' : transition, // Disable transition during drag for instant response
    opacity: isDragging ? 0.8 : 1,
    cursor: isDragging ? 'grabbing' : 'grab',
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <DealCard deal={deal} onEdit={onEdit} onView={onView} />
    </div>
  );
}
