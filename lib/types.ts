export interface PipelineStage {
  id: string;
  name: string;
  order_index: number;
  color: string;
  created_at: string;
}

export interface Deal {
  id: string;
  deal_id: string;
  stage_id: string;
  client_name: string;
  client_initials: string;
  avatar_color: string;
  interested_products: string;
  estimated_budget: number;
  margin: number;
  status: 'paid' | 'unpaid';
  shipping_date: string | null;
  notes: string | null;
  order_index: number;
  created_at: string;
  updated_at: string;
  created_by: string;
}

export interface DealProduct {
  id: string;
  deal_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  order_index: number;
  created_at: string;
}

export interface DealTag {
  id: string;
  deal_id: string;
  tag: string;
  color: string;
  created_at: string;
}

export interface DealActivity {
  id: string;
  deal_id: string;
  activity_type: 'gmail' | 'twilio' | 'shopify' | 'note';
  title: string;
  description: string | null;
  metadata: Record<string, any> | null;
  created_at: string;
}

export interface IntegrationSetting {
  id: string;
  user_id: string;
  integration_type: 'gmail' | 'twilio' | 'shopify';
  enabled: boolean;
  api_key: string | null;
  config: Record<string, any> | null;
  created_at: string;
  updated_at: string;
}

export interface DealWithDetails extends Deal {
  products?: DealProduct[];
  tags?: DealTag[];
  activities?: DealActivity[];
}

export interface StageWithDeals extends PipelineStage {
  deals: DealWithDetails[];
  total_value: number;
  deal_count: number;
}
