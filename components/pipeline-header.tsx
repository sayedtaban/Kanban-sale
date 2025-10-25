'use client';

import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface PipelineHeaderProps {
  totalPipeline: number;
  totalMargin: number;
  dealCount: number;
  onAddDeal: () => void;
}

export function PipelineHeader({ totalPipeline, totalMargin, dealCount, onAddDeal }: PipelineHeaderProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Sales Pipeline</h1>
          <div className="flex items-center gap-8">
            <div>
              <div className="text-sm text-gray-500 mb-1">Total Pipeline</div>
              <div className="text-2xl font-bold text-gray-900">{formatCurrency(totalPipeline)}</div>
            </div>
            <div className="h-12 w-px bg-gray-200" />
            <div>
              <div className="text-sm text-gray-500 mb-1">Margin</div>
              <div className="text-2xl font-bold text-green-600">{formatCurrency(totalMargin)}</div>
            </div>
            <div className="h-12 w-px bg-gray-200" />
            <div>
              <div className="text-sm text-gray-500 mb-1">Deals</div>
              <div className="text-2xl font-bold text-gray-900">{dealCount}</div>
            </div>
          </div>
        </div>
        <Button onClick={onAddDeal} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2">
          <Plus className="w-4 h-4 mr-2" />
          Add Deal
        </Button>
      </div>
    </div>
  );
}
