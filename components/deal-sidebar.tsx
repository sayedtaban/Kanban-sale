'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { DealWithDetails } from '@/lib/types';
import { X, Plus, Package, DollarSign, CreditCard, CheckSquare, ArrowRight } from 'lucide-react';

interface DealSidebarProps {
  open: boolean;
  onClose: () => void;
  onSave: (deal: Partial<DealWithDetails>) => Promise<void>;
  deal?: DealWithDetails | null;
}

export function DealSidebar({ open, onClose, onSave, deal }: DealSidebarProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await onSave({});
      onClose();
    } catch (error) {
      console.error('Error saving deal:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        onClose();
      }
    };

    if (open) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [open, onClose]);

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div 
        className={`fixed top-0 right-0 h-full w-full max-w-2xl bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Deal Details</h2>
              <p className="text-sm text-gray-600 mt-1">
                Master Order Number: MON-2025-002
              </p>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="contact" className="text-sm font-medium">Contact</Label>
                <Input id="contact" value="Michael Chen" readOnly className="h-10" />
              </div>
              <div>
                <Label htmlFor="interested-product" className="text-sm font-medium">Interested Product</Label>
                <Input id="interested-product" value="Omega Seamaster Diver 300M" readOnly className="h-10" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="estimated-budget" className="text-sm font-medium">Estimated Budget</Label>
                <Input id="estimated-budget" value="$12,960" readOnly className="h-10" />
              </div>
              <div>
                <Label htmlFor="margin" className="text-sm font-medium">Margin</Label>
                <Input id="margin" value="$3,120" readOnly className="h-10" />
              </div>
            </div>

            {/* Products Section */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Products
                </h3>
                <Button variant="outline" size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Product
                </Button>
              </div>
              
              <div className="space-y-3">
                <div className="border border-gray-200 rounded-lg p-3">
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div>
                      <Label className="text-sm font-medium">Product Title</Label>
                      <Input value="Omega Seamaster Diver 300M" readOnly className="h-10" />
                    </div>
                    <div>
                      <Label className="text-sm font-medium">SKU</Label>
                      <Input value="OMG-SEA-300-BLU" readOnly className="h-10" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div>
                      <Label className="text-sm font-medium">Dealer</Label>
                      <Input value="Tourbillon Boutique" readOnly className="h-10" />
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Sourcing Country</Label>
                      <Select defaultValue="Hong Kong">
                        <SelectTrigger className="h-10">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Hong Kong">Hong Kong</SelectItem>
                          <SelectItem value="Switzerland">Switzerland</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 mb-3">
                    <Checkbox id="dropship" defaultChecked />
                    <Label htmlFor="dropship" className="text-sm">Dropship</Label>
                  </div>
                  <div className="grid grid-cols-4 gap-3">
                    <div>
                      <Label className="text-sm font-medium">Quantity</Label>
                      <Input type="number" value="1" readOnly className="h-10" />
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Price ($)</Label>
                      <Input type="number" value="12960" readOnly className="h-10" />
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Cost ($)</Label>
                      <Input type="number" value="9840" readOnly className="h-10" />
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Subtotal</Label>
                      <Input value="$12,960" readOnly className="h-10" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Totals Section */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                <DollarSign className="w-5 h-5" />
                Totals
              </h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Total Price</span>
                    <span className="text-sm font-semibold">$12,960</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Total Cost</span>
                    <span className="text-sm font-semibold">$9,840</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Margin</span>
                    <span className="text-sm font-semibold text-green-600">$3,120</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Expected Shipment Date</Label>
                  <div className="flex gap-2">
                    <Input type="number" placeholder="MM" className="w-16 h-10" />
                    <Input type="number" placeholder="DD" className="w-16 h-10" />
                    <Input type="number" placeholder="YYYY" className="w-20 h-10" />
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Tracking Section */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Payment Tracking
                </h3>
                <Button variant="outline" size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Payment
                </Button>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Total Price</span>
                  <span className="text-sm font-medium">$12,960</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Trade-In Credit</span>
                  <span className="text-sm font-medium">$1,800</span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Net Total</span>
                    <span className="text-sm font-semibold">$11,160</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Total Paid</span>
                    <span className="text-sm font-medium">$0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Remaining</span>
                    <span className="text-sm font-semibold">$11,160</span>
                  </div>
                </div>
              </div>
              <div className="text-center py-8 text-gray-500">
                <p className="text-sm">No payments recorded yet. Click "Add Payment" to track payments.</p>
              </div>
            </div>

            {/* Task List Section */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <CheckSquare className="w-5 h-5" />
                  Task List
                </h3>
                <Button variant="outline" size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Task
                </Button>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
                  <Checkbox />
                  <Input value="Schedule boutique viewing" readOnly className="h-10" />
                  <Input type="date" value="2025-11-20" className="w-40 h-10" />
                </div>
              </div>
            </div>

            {/* Trade-In Section */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                <ArrowRight className="w-5 h-5" />
                Trade-In
              </h3>
              <div className="flex items-center space-x-2 mb-4">
                <Checkbox id="trade-in" />
                <Label htmlFor="trade-in" className="text-sm font-medium">Trade-In</Label>
              </div>
              <div className="space-y-4 pl-6 border-l-2 border-gray-200">
                <div>
                  <Label className="text-sm font-medium">Title</Label>
                  <Input value="Tag Heuer Aquaracer WAY111A" readOnly className="h-10" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Trade-In Value</Label>
                    <Input type="number" value="1800" readOnly className="h-10" />
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Year</Label>
                    <Input value="2019" readOnly className="h-10" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Condition</Label>
                    <Select defaultValue="Good">
                      <SelectTrigger className="h-10">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Excellent">Excellent</SelectItem>
                        <SelectItem value="Good">Good</SelectItem>
                        <SelectItem value="Fair">Fair</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Completeness</Label>
                    <Select defaultValue="Complete Set">
                      <SelectTrigger className="h-10">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Complete Set">Complete Set</SelectItem>
                        <SelectItem value="Watch Only">Watch Only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Stage</Label>
                  <Select defaultValue="Negotiation">
                    <SelectTrigger className="h-10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Negotiation">Negotiation</SelectItem>
                      <SelectItem value="Evaluation">Evaluation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-sm font-medium">Notes</Label>
                  <Textarea placeholder="Additional notes about the trade-in..." rows={3} />
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
            <Button variant="outline" onClick={onClose} className="px-6">
              Cancel
            </Button>
            <Button variant="outline" onClick={onClose} className="px-6">
              Close
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting} className="px-6 bg-blue-600 hover:bg-blue-700">
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
