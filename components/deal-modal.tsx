'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DealWithDetails, PipelineStage } from '@/lib/types';
import { X, Plus } from 'lucide-react';

interface DealModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (deal: Partial<DealWithDetails>) => Promise<void>;
  deal?: DealWithDetails | null;
  stages: PipelineStage[];
}

interface ProductLine {
  product_name: string;
  quantity: number;
  unit_price: number;
}

export function DealModal({ open, onClose, onSave, deal, stages }: DealModalProps) {
  const [formData, setFormData] = useState({
    deal_id: '',
    client_name: '',
    client_initials: '',
    avatar_color: '#3B82F6',
    interested_products: '',
    estimated_budget: 0,
    margin: 0,
    status: 'unpaid',
    shipping_date: '',
    notes: '',
    stage_id: '',
  });

  const [products, setProducts] = useState<ProductLine[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (deal) {
      setFormData({
        deal_id: deal.deal_id,
        client_name: deal.client_name,
        client_initials: deal.client_initials,
        avatar_color: deal.avatar_color,
        interested_products: deal.interested_products,
        estimated_budget: deal.estimated_budget,
        margin: deal.margin,
        status: deal.status,
        shipping_date: deal.shipping_date || '',
        notes: deal.notes || '',
        stage_id: deal.stage_id,
      });
      setProducts(
        deal.products?.map((p) => ({
          product_name: p.product_name,
          quantity: p.quantity,
          unit_price: p.unit_price,
        })) || []
      );
      setTags(deal.tags?.map((t) => t.tag) || []);
    } else {
      setFormData({
        deal_id: `MON-2025-${Math.floor(Math.random() * 1000)}`,
        client_name: '',
        client_initials: '',
        avatar_color: '#3B82F6',
        interested_products: '',
        estimated_budget: 0,
        margin: 0,
        status: 'unpaid',
        shipping_date: '',
        notes: '',
        stage_id: stages[0]?.id || '',
      });
      setProducts([]);
      setTags([]);
    }
  }, [deal, open, stages]);

  const addProduct = () => {
    setProducts([...products, { product_name: '', quantity: 1, unit_price: 0 }]);
  };

  const updateProduct = (index: number, field: keyof ProductLine, value: any) => {
    const updated = [...products];
    updated[index] = { ...updated[index], [field]: value };
    setProducts(updated);
  };

  const removeProduct = (index: number) => {
    setProducts(products.filter((_, i) => i !== index));
  };

  const addTag = () => {
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
      setNewTag('');
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const dealData: any = {
        ...formData,
        estimated_budget: Number(formData.estimated_budget),
        margin: Number(formData.margin),
      };

      if (deal) {
        dealData.id = deal.id;
      }

      dealData.products = products.map((p, idx) => ({
        product_name: p.product_name,
        quantity: p.quantity,
        unit_price: p.unit_price,
        total_price: p.quantity * p.unit_price,
        order_index: idx,
      }));

      dealData.tags = tags.map((tag) => ({
        tag,
        color: '#6366F1',
      }));

      await onSave(dealData);
      onClose();
    } catch (error) {
      console.error('Error saving deal:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-xl font-bold">{deal ? 'Edit Deal' : 'Add New Deal'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="stage" className="text-sm font-medium">Stage</Label>
              <Select
                value={formData.stage_id}
                onValueChange={(value) => setFormData({ ...formData, stage_id: value })}
              >
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Select stage" />
                </SelectTrigger>
                <SelectContent>
                  {stages.map((stage) => (
                    <SelectItem key={stage.id} value={stage.id}>
                      {stage.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="deal_id" className="text-sm font-medium">Master Order Number</Label>
              <Input
                id="deal_id"
                value={formData.deal_id}
                onChange={(e) => setFormData({ ...formData, deal_id: e.target.value })}
                className="h-10"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="client_name" className="text-sm font-medium">Contact</Label>
              <Input
                id="client_name"
                value={formData.client_name}
                onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                className="h-10"
                required
              />
            </div>
            <div>
              <Label htmlFor="client_initials" className="text-sm font-medium">Client Initials</Label>
              <Input
                id="client_initials"
                value={formData.client_initials}
                onChange={(e) => setFormData({ ...formData, client_initials: e.target.value })}
                className="h-10"
                maxLength={2}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="interested_products" className="text-sm font-medium">Interested Product</Label>
            <Input
              id="interested_products"
              value={formData.interested_products}
              onChange={(e) => setFormData({ ...formData, interested_products: e.target.value })}
              className="h-10"
            />
          </div>

          <div>
            <Label htmlFor="estimated_budget" className="text-sm font-medium">Estimated Budget</Label>
            <Input
              id="estimated_budget"
              type="number"
              value={formData.estimated_budget}
              onChange={(e) => setFormData({ ...formData, estimated_budget: Number(e.target.value) })}
              className="h-10"
              required
            />
          </div>



          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <Button type="button" variant="outline" onClick={onClose} className="px-6">
              Cancel
            </Button>
            <Button type="button" variant="outline" onClick={onClose} className="px-6">
              Close
            </Button>
            <Button type="submit" disabled={isSubmitting} className="px-6 bg-blue-600 hover:bg-blue-700">
              {isSubmitting ? 'Saving...' : 'Add Deal'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
