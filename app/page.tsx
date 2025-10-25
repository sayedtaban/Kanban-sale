'use client';

import { useState, useEffect } from 'react';
import { DndContext, DragEndEvent, DragOverlay, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { supabase } from '@/lib/supabase';
import { StageWithDeals, DealWithDetails, PipelineStage } from '@/lib/types';
import { KanbanColumn } from '@/components/kanban-column';
import { PipelineHeader } from '@/components/pipeline-header';
import { DealModal } from '@/components/deal-modal';
import { DealSidebar } from '@/components/deal-sidebar';
import { DealCard } from '@/components/deal-card';
import { AuthWrapper } from '@/components/auth-wrapper';
import { useToast } from '@/hooks/use-toast';

function KanbanBoard() {
  const [stages, setStages] = useState<StageWithDeals[]>([]);
  const [allStages, setAllStages] = useState<PipelineStage[]>([]);
  const [activeDeal, setActiveDeal] = useState<DealWithDetails | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [editingDeal, setEditingDeal] = useState<DealWithDetails | null>(null);
  const [viewingDeal, setViewingDeal] = useState<DealWithDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3, // Reduced distance for more responsive drag
      },
    })
  );

  const loadData = async () => {
    try {
      console.log('Loading data...');
      const { data: stagesData, error: stagesError } = await supabase
        .from('pipeline_stages')
        .select('*')
        .order('order_index');

      if (stagesError) {
        console.error('Stages error:', stagesError);
        throw stagesError;
      }

      setAllStages(stagesData || []);

      const { data: dealsData, error: dealsError } = await supabase
        .from('deals')
        .select(`
          *,
          products:deal_products(*),
          tags:deal_tags(*),
          activities:deal_activities(*)
        `)
        .order('order_index');

      if (dealsError) {
        console.error('Deals error:', dealsError);
        throw dealsError;
      }

      const stagesWithDeals: StageWithDeals[] = (stagesData || []).map((stage) => {
        const stageDeals = (dealsData || []).filter((deal) => deal.stage_id === stage.id);
        const total = stageDeals.reduce((sum, deal) => sum + Number(deal.estimated_budget), 0);

        return {
          ...stage,
          deals: stageDeals,
          total_value: total,
          deal_count: stageDeals.length,
        };
      });

      setStages(stagesWithDeals);
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load pipeline data',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    const dealsChannel = supabase
      .channel('deals-changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'deals' 
      }, (payload) => {
        console.log('Deals table changed:', payload);
        loadData();
      })
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'deal_products' 
      }, (payload) => {
        console.log('Deal products table changed:', payload);
        loadData();
      })
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'deal_tags' 
      }, (payload) => {
        console.log('Deal tags table changed:', payload);
        loadData();
      })
      .subscribe((status) => {
        console.log('Subscription status:', status);
      });

    return () => {
      supabase.removeChannel(dealsChannel);
    };
  }, []);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveDeal(null);

    if (!over) return;

    const dealId = active.id as string;
    const newStageId = over.id as string;

    // Find the current deal to check if it's already in the target stage
    const currentDeal = stages
      .flatMap((s) => s.deals)
      .find((d) => d.id === dealId);
    
    if (!currentDeal) {
      console.error('Deal not found:', dealId);
      return;
    }

    // If the deal is already in the target stage, don't do anything
    if (currentDeal.stage_id === newStageId) {
      return;
    }

    // Optimistic update - immediately update the UI
    setStages(prevStages => {
      return prevStages.map(stage => {
        if (stage.id === newStageId) {
          // Add the deal to the new stage
          const updatedDeal = { ...currentDeal, stage_id: newStageId };
          return {
            ...stage,
            deals: [...stage.deals, updatedDeal],
            total_value: stage.total_value + currentDeal.estimated_budget,
            deal_count: stage.deal_count + 1
          };
        } else if (stage.id === currentDeal.stage_id) {
          // Remove the deal from the old stage
          return {
            ...stage,
            deals: stage.deals.filter(deal => deal.id !== dealId),
            total_value: stage.total_value - currentDeal.estimated_budget,
            deal_count: stage.deal_count - 1
          };
        }
        return stage;
      });
    });

    // Update database in the background
    try {
      const { error } = await supabase
        .from('deals')
        .update({ 
          stage_id: newStageId, 
          updated_at: new Date().toISOString() 
        })
        .eq('id', dealId);

      if (error) {
        console.error('Supabase error:', error);
        // Revert optimistic update on error
        loadData();
        toast({
          title: 'Error',
          description: 'Failed to move deal',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Success',
          description: 'Deal moved successfully',
        });
      }
    } catch (error) {
      console.error('Error moving deal:', error);
      // Revert optimistic update on error
      loadData();
      toast({
        title: 'Error',
        description: 'Failed to move deal',
        variant: 'destructive',
      });
    }
  };

  const handleDragStart = (event: DragEndEvent) => {
    const dealId = event.active.id as string;
    const deal = stages
      .flatMap((s) => s.deals)
      .find((d) => d.id === dealId);
    setActiveDeal(deal || null);
  };

  const handleDragOver = (event: DragEndEvent) => {
    // Optional: Add visual feedback during drag over
    // This can help with better UX
  };

  const handleSaveDeal = async (dealData: Partial<DealWithDetails>) => {
    try {
      const { data: userData } = await supabase.auth.getUser();

      if (dealData.id) {
        const { error: dealError } = await supabase
          .from('deals')
          .update({
            deal_id: dealData.deal_id,
            stage_id: dealData.stage_id,
            client_name: dealData.client_name,
            client_initials: dealData.client_initials,
            avatar_color: dealData.avatar_color,
            interested_products: dealData.interested_products,
            estimated_budget: dealData.estimated_budget,
            margin: dealData.margin,
            status: dealData.status,
            shipping_date: dealData.shipping_date,
            notes: dealData.notes,
            updated_at: new Date().toISOString(),
          })
          .eq('id', dealData.id);

        if (dealError) throw dealError;

        await supabase.from('deal_products').delete().eq('deal_id', dealData.id);
        await supabase.from('deal_tags').delete().eq('deal_id', dealData.id);

        if (dealData.products && dealData.products.length > 0) {
          const { error: productsError } = await supabase
            .from('deal_products')
            .insert(dealData.products.map((p: any) => ({ ...p, deal_id: dealData.id })));
          if (productsError) throw productsError;
        }

        if (dealData.tags && dealData.tags.length > 0) {
          const { error: tagsError } = await supabase
            .from('deal_tags')
            .insert(dealData.tags.map((t: any) => ({ ...t, deal_id: dealData.id })));
          if (tagsError) throw tagsError;
        }

        toast({
          title: 'Success',
          description: 'Deal updated successfully',
        });
      } else {
        const { data: newDeal, error: dealError } = await supabase
          .from('deals')
          .insert({
            deal_id: dealData.deal_id,
            stage_id: dealData.stage_id,
            client_name: dealData.client_name,
            client_initials: dealData.client_initials,
            avatar_color: dealData.avatar_color,
            interested_products: dealData.interested_products,
            estimated_budget: dealData.estimated_budget,
            margin: dealData.margin,
            status: dealData.status,
            shipping_date: dealData.shipping_date,
            notes: dealData.notes,
            created_by: userData.user?.id,
            order_index: 0,
          })
          .select()
          .single();

        if (dealError) throw dealError;

        if (dealData.products && dealData.products.length > 0) {
          const { error: productsError } = await supabase
            .from('deal_products')
            .insert(dealData.products.map((p: any) => ({ ...p, deal_id: newDeal.id })));
          if (productsError) throw productsError;
        }

        if (dealData.tags && dealData.tags.length > 0) {
          const { error: tagsError } = await supabase
            .from('deal_tags')
            .insert(dealData.tags.map((t: any) => ({ ...t, deal_id: newDeal.id })));
          if (tagsError) throw tagsError;
        }

        toast({
          title: 'Success',
          description: 'Deal created successfully',
        });
      }

      loadData();
    } catch (error) {
      console.error('Error saving deal:', error);
      toast({
        title: 'Error',
        description: 'Failed to save deal',
        variant: 'destructive',
      });
    }
  };

  const totalPipeline = stages.reduce((sum, stage) => sum + stage.total_value, 0);
  const totalMargin = stages
    .flatMap((s) => s.deals)
    .reduce((sum, deal) => sum + Number(deal.margin), 0);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg text-gray-600">Loading pipeline...</div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gray-100">
      <PipelineHeader
        totalPipeline={totalPipeline}
        totalMargin={totalMargin}
        dealCount={stages.reduce((sum, stage) => sum + stage.deal_count, 0)}
        onAddDeal={() => {
          setEditingDeal(null);
          setIsModalOpen(true);
        }}
      />

      <div className="flex-1 overflow-x-auto overflow-y-hidden">
        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="flex gap-4 p-6 h-full">
            {stages.map((stage) => (
              <KanbanColumn
                key={stage.id}
                stage={stage}
                onEditDeal={(deal) => {
                  setEditingDeal(deal);
                  setIsModalOpen(true);
                }}
                onViewDeal={(deal) => {
                  setViewingDeal(deal);
                  setIsDetailModalOpen(true);
                }}
              />
            ))}
          </div>
          <DragOverlay>
            {activeDeal ? <DealCard deal={activeDeal} /> : null}
          </DragOverlay>
        </DndContext>
      </div>

      <DealModal
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingDeal(null);
        }}
        onSave={handleSaveDeal}
        deal={editingDeal}
        stages={allStages}
      />

      <DealSidebar
        open={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setViewingDeal(null);
        }}
        onSave={handleSaveDeal}
        deal={viewingDeal}
      />
    </div>
  );
}

export default function Home() {
  return (
    <AuthWrapper>
      <KanbanBoard />
    </AuthWrapper>
  );
}
