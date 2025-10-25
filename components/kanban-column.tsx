'use client';

import { StageWithDeals, DealWithDetails } from '@/lib/types';
import { DealCard } from './deal-card';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableDealCard } from './sortable-deal-card';
import { cn } from '@/lib/utils';

interface KanbanColumnProps {
  stage: StageWithDeals;
  onEditDeal?: (deal: DealWithDetails) => void;
  onViewDeal?: (deal: DealWithDetails) => void;
}

export function KanbanColumn({ stage, onEditDeal, onViewDeal }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: stage.id,
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="flex-shrink-0 w-80">
      <div className="bg-gray-50 rounded-lg h-full flex flex-col">
        <div className="p-4 border-b border-gray-200 bg-white rounded-t-lg">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-semibold text-sm text-gray-900">{stage.name}</h2>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-gray-500">
                {stage.deal_count}
              </span>
            </div>
          </div>
          <div className="text-sm font-semibold text-gray-700">
            {formatCurrency(stage.total_value)}
          </div>
        </div>

        <div
          ref={setNodeRef}
          className={cn(
            'flex-1 p-4 overflow-y-auto min-h-[200px]',
            isOver && 'bg-blue-50'
          )}
        >
          <SortableContext
            items={stage.deals.map((d) => d.id)}
            strategy={verticalListSortingStrategy}
          >
            {stage.deals.map((deal) => (
              <SortableDealCard
                key={deal.id}
                deal={deal}
                onEdit={onEditDeal}
                onView={onViewDeal}
              />
            ))}
          </SortableContext>
        </div>
      </div>
    </div>
  );
}
