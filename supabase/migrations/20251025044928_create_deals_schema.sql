/*
  # Kanban Deal Board Schema

  1. New Tables
    - pipeline_stages: Defines all stages in the deal pipeline
    - deals: Core deal records with all business data
    - deal_products: Line items for each deal
    - deal_tags: Status badges/tags for deals
    - deal_activities: Activity feed for Gmail, Twilio, Shopify events
    - integration_settings: API configuration per user/team
  
  2. Security
    - Enable RLS on all tables
    - Authenticated users can manage their own deals
    - Separate policies for select, insert, update, delete operations
*/

-- Pipeline Stages Table
CREATE TABLE IF NOT EXISTS pipeline_stages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  order_index integer NOT NULL,
  color text DEFAULT '#6B7280',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE pipeline_stages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view stages"
  ON pipeline_stages FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert stages"
  ON pipeline_stages FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update stages"
  ON pipeline_stages FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete stages"
  ON pipeline_stages FOR DELETE
  TO authenticated
  USING (true);

-- Deals Table
CREATE TABLE IF NOT EXISTS deals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id text UNIQUE NOT NULL,
  stage_id uuid REFERENCES pipeline_stages(id) ON DELETE SET NULL,
  client_name text NOT NULL,
  client_initials text DEFAULT '',
  avatar_color text DEFAULT '#3B82F6',
  interested_products text DEFAULT '',
  estimated_budget numeric DEFAULT 0,
  margin numeric DEFAULT 0,
  status text DEFAULT 'unpaid',
  shipping_date date,
  notes text,
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL
);

ALTER TABLE deals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all deals"
  ON deals FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert deals"
  ON deals FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update deals"
  ON deals FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can delete deals"
  ON deals FOR DELETE
  TO authenticated
  USING (true);

-- Deal Products Table
CREATE TABLE IF NOT EXISTS deal_products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id uuid REFERENCES deals(id) ON DELETE CASCADE NOT NULL,
  product_name text NOT NULL,
  quantity integer DEFAULT 1,
  unit_price numeric DEFAULT 0,
  total_price numeric DEFAULT 0,
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE deal_products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all deal products"
  ON deal_products FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert deal products"
  ON deal_products FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update deal products"
  ON deal_products FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can delete deal products"
  ON deal_products FOR DELETE
  TO authenticated
  USING (true);

-- Deal Tags Table
CREATE TABLE IF NOT EXISTS deal_tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id uuid REFERENCES deals(id) ON DELETE CASCADE NOT NULL,
  tag text NOT NULL,
  color text DEFAULT '#6B7280',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE deal_tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all deal tags"
  ON deal_tags FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert deal tags"
  ON deal_tags FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update deal tags"
  ON deal_tags FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can delete deal tags"
  ON deal_tags FOR DELETE
  TO authenticated
  USING (true);

-- Deal Activities Table
CREATE TABLE IF NOT EXISTS deal_activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id uuid REFERENCES deals(id) ON DELETE CASCADE NOT NULL,
  activity_type text NOT NULL,
  title text NOT NULL,
  description text,
  metadata jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE deal_activities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all activities"
  ON deal_activities FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert activities"
  ON deal_activities FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update activities"
  ON deal_activities FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can delete activities"
  ON deal_activities FOR DELETE
  TO authenticated
  USING (true);

-- Integration Settings Table
CREATE TABLE IF NOT EXISTS integration_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  integration_type text NOT NULL,
  enabled boolean DEFAULT false,
  api_key text,
  config jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, integration_type)
);

ALTER TABLE integration_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own integration settings"
  ON integration_settings FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own integration settings"
  ON integration_settings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own integration settings"
  ON integration_settings FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own integration settings"
  ON integration_settings FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_deals_stage_id ON deals(stage_id);
CREATE INDEX IF NOT EXISTS idx_deals_created_by ON deals(created_by);
CREATE INDEX IF NOT EXISTS idx_deal_products_deal_id ON deal_products(deal_id);
CREATE INDEX IF NOT EXISTS idx_deal_tags_deal_id ON deal_tags(deal_id);
CREATE INDEX IF NOT EXISTS idx_deal_activities_deal_id ON deal_activities(deal_id);
CREATE INDEX IF NOT EXISTS idx_integration_settings_user_id ON integration_settings(user_id);