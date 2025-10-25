'use client';

import { DealWithDetails } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Calendar, Package, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface DealCardProps {
  deal: DealWithDetails;
  onEdit?: (deal: DealWithDetails) => void;
  onView?: (deal: DealWithDetails) => void;
}

export function DealCard({ deal, onEdit, onView }: DealCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Card
      className="p-4 mb-3 cursor-grab hover:shadow-md transition-shadow bg-white border border-gray-200 active:cursor-grabbing"
      onClick={() => onView?.(deal)}
    >
      <div className="flex items-start gap-3 mb-3">
        <Avatar className="w-10 h-10" style={{ backgroundColor: deal.avatar_color }}>
          <AvatarFallback className="text-white font-semibold text-sm">
            {deal.client_initials || deal.client_name.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-gray-500">{deal.deal_id}</span>
            {deal.status === 'paid' && (
              <Badge className="bg-green-100 text-green-700 hover:bg-green-100 text-xs px-2 py-0">
                PAID
              </Badge>
            )}
          </div>
          <h3 className="font-semibold text-sm text-gray-900 mb-1">{deal.client_name}</h3>
          <p className="text-xs text-gray-600 line-clamp-1">{deal.interested_products}</p>
        </div>
      </div>

      {deal.tags && deal.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {deal.tags.map((tag) => (
            <Badge
              key={tag.id}
              className="text-xs px-2 py-0"
              style={{ backgroundColor: tag.color, color: 'white' }}
            >
              {tag.tag}
            </Badge>
          ))}
        </div>
      )}

      <div className="space-y-2 mb-3">
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-500">Estimated Budget:</span>
          <span className="font-semibold text-gray-900">{formatCurrency(deal.estimated_budget)}</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-500 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            Margin:
          </span>
          <span className="font-semibold text-green-600">{formatCurrency(deal.margin)}</span>
        </div>
      </div>

      {deal.shipping_date && (
        <div className="flex items-center gap-1 text-xs text-gray-600 mb-3">
          <Calendar className="w-3 h-3" />
          <span>Ship: {new Date(deal.shipping_date).toLocaleDateString()}</span>
        </div>
      )}

      {isExpanded && deal.products && deal.products.length > 0 && (
        <div className="border-t pt-3 mt-3 space-y-2">
          <div className="flex items-center gap-1 text-xs font-semibold text-gray-700 mb-2">
            <Package className="w-3 h-3" />
            Products:
          </div>
          {deal.products.map((product) => (
            <div key={product.id} className="flex justify-between text-xs">
              <span className="text-gray-600">
                {product.quantity}x {product.product_name}
              </span>
              <span className="font-medium text-gray-900">{formatCurrency(product.total_price)}</span>
            </div>
          ))}
        </div>
      )}

      {deal.products && deal.products.length > 0 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsExpanded(!isExpanded);
          }}
          className="text-xs text-blue-600 hover:text-blue-700 font-medium mt-2"
        >
          {isExpanded ? 'Show less' : `Show ${deal.products.length} product${deal.products.length > 1 ? 's' : ''}`}
        </button>
      )}

      {deal.activities && deal.activities.length > 0 && (
        <div className="border-t pt-2 mt-3">
          <div className="text-xs text-gray-500">
            {deal.activities.length} recent {deal.activities.length === 1 ? 'activity' : 'activities'}
          </div>
        </div>
      )}
    </Card>
  );
}
