/*
  # Seed Initial Pipeline Data

  1. Pipeline Stages
    - Creates 12 pipeline stages as specified: Leads, First Contact, Negotiation, Invoice, Paid, Product Sourced, Awaiting Shipment, Ready to Ship, Shipped, Closed, Dead, Follow-up
  
  2. Sample Deals
    - Populates sample deals matching the specification with exact values
    - Includes client information, budgets, margins, and statuses
  
  3. Deal Products
    - Adds product line items for deals with detailed pricing
  
  4. Deal Tags
    - Creates status badges like DOMED, DROPSHIP, etc.
*/

-- Insert Pipeline Stages
INSERT INTO pipeline_stages (name, order_index, color) VALUES
  ('Leads', 0, '#94A3B8'),
  ('First Contact', 1, '#60A5FA'),
  ('Negotiation', 2, '#F59E0B'),
  ('Invoice', 3, '#8B5CF6'),
  ('Paid', 4, '#10B981'),
  ('Product Sourced', 5, '#06B6D4'),
  ('Awaiting Shipment', 6, '#EC4899'),
  ('Ready to Ship', 7, '#6366F1'),
  ('Shipped', 8, '#14B8A6'),
  ('Closed', 9, '#22C55E'),
  ('Dead', 10, '#EF4444'),
  ('Follow-up', 11, '#F97316')
ON CONFLICT DO NOTHING;

-- Get stage IDs
DO $$
DECLARE
  leads_id uuid;
  first_contact_id uuid;
  negotiation_id uuid;
  invoice_id uuid;
  paid_id uuid;
  closed_id uuid;
  dead_id uuid;
  followup_id uuid;
  deal1_id uuid;
  deal2_id uuid;
  deal3_id uuid;
  deal4_id uuid;
  deal5_id uuid;
  deal6_id uuid;
  deal7_id uuid;
  deal8_id uuid;
  deal9_id uuid;
  deal10_id uuid;
  deal11_id uuid;
BEGIN
  -- Get stage IDs
  SELECT id INTO leads_id FROM pipeline_stages WHERE name = 'Leads';
  SELECT id INTO first_contact_id FROM pipeline_stages WHERE name = 'First Contact';
  SELECT id INTO negotiation_id FROM pipeline_stages WHERE name = 'Negotiation';
  SELECT id INTO invoice_id FROM pipeline_stages WHERE name = 'Invoice';
  SELECT id INTO paid_id FROM pipeline_stages WHERE name = 'Paid';
  SELECT id INTO closed_id FROM pipeline_stages WHERE name = 'Closed';
  SELECT id INTO dead_id FROM pipeline_stages WHERE name = 'Dead';
  SELECT id INTO followup_id FROM pipeline_stages WHERE name = 'Follow-up';

  -- Insert Leads Stage Deals
  INSERT INTO deals (deal_id, stage_id, client_name, client_initials, avatar_color, interested_products, estimated_budget, margin, status, order_index)
  VALUES 
    ('MON-2025-101', leads_id, 'David Martinez', 'DM', '#3B82F6', 'Rolex Daytona', 35000, 5000, 'unpaid', 0)
  RETURNING id INTO deal1_id;

  INSERT INTO deals (deal_id, stage_id, client_name, client_initials, avatar_color, interested_products, estimated_budget, margin, status, order_index)
  VALUES 
    ('MON-2025-102', leads_id, 'Emily Chen', 'EC', '#8B5CF6', 'Patek Philippe Nautilus', 75000, 12000, 'unpaid', 1)
  RETURNING id INTO deal2_id;

  INSERT INTO deals (deal_id, stage_id, client_name, client_initials, avatar_color, interested_products, estimated_budget, margin, status, order_index)
  VALUES 
    ('MON-2025-103', leads_id, 'Robert Williams', 'RW', '#10B981', 'Audemars Piguet Royal Oak', 55000, 8500, 'unpaid', 2)
  RETURNING id INTO deal3_id;

  -- First Contact
  INSERT INTO deals (deal_id, stage_id, client_name, client_initials, avatar_color, interested_products, estimated_budget, margin, status, order_index)
  VALUES 
    ('MON-2025-003', first_contact_id, 'Sarah Johnson', 'SJ', '#EC4899', 'Omega Seamaster', 4800, 800, 'unpaid', 0)
  RETURNING id INTO deal4_id;

  -- Negotiation
  INSERT INTO deals (deal_id, stage_id, client_name, client_initials, avatar_color, interested_products, estimated_budget, margin, status, shipping_date, order_index)
  VALUES 
    ('MON-2025-055', negotiation_id, 'Michael Brown', 'MB', '#F59E0B', 'Rolex Submariner', 58000, 9200, 'unpaid', '2025-11-15', 0)
  RETURNING id INTO deal5_id;

  INSERT INTO deals (deal_id, stage_id, client_name, client_initials, avatar_color, interested_products, estimated_budget, margin, status, shipping_date, order_index)
  VALUES 
    ('MON-2025-067', negotiation_id, 'Jessica Taylor', 'JT', '#6366F1', 'Cartier Santos', 48550, 7100, 'unpaid', '2025-11-20', 1)
  RETURNING id INTO deal6_id;

  -- Invoice
  INSERT INTO deals (deal_id, stage_id, client_name, client_initials, avatar_color, interested_products, estimated_budget, margin, status, shipping_date, order_index)
  VALUES 
    ('MON-2025-078', invoice_id, 'Daniel Kim', 'DK', '#14B8A6', 'IWC Pilot', 52850, 8900, 'unpaid', '2025-11-10', 0)
  RETURNING id INTO deal7_id;

  -- Paid
  INSERT INTO deals (deal_id, stage_id, client_name, client_initials, avatar_color, interested_products, estimated_budget, margin, status, shipping_date, order_index)
  VALUES 
    ('MON-2025-042', paid_id, 'Amanda Garcia', 'AG', '#22C55E', 'Tag Heuer Monaco', 15250, 2400, 'paid', '2025-11-05', 0)
  RETURNING id INTO deal8_id;

  -- Closed
  INSERT INTO deals (deal_id, stage_id, client_name, client_initials, avatar_color, interested_products, estimated_budget, margin, status, order_index)
  VALUES 
    ('MON-2025-031', closed_id, 'Christopher Lee', 'CL', '#10B981', 'Breitling Navitimer', 13400, 2100, 'paid', 0)
  RETURNING id INTO deal9_id;

  -- Dead
  INSERT INTO deals (deal_id, stage_id, client_name, client_initials, avatar_color, interested_products, estimated_budget, margin, status, order_index)
  VALUES 
    ('MON-2025-089', dead_id, 'Michelle Davis', 'MD', '#EF4444', 'Tudor Black Bay', 6800, 900, 'unpaid', 0)
  RETURNING id INTO deal10_id;

  -- Follow-up
  INSERT INTO deals (deal_id, stage_id, client_name, client_initials, avatar_color, interested_products, estimated_budget, margin, status, order_index)
  VALUES 
    ('MON-2025-095', followup_id, 'James Wilson', 'JW', '#F97316', 'Longines Master', 9200, 1500, 'unpaid', 0)
  RETURNING id INTO deal11_id;

  -- Insert Products for some deals
  INSERT INTO deal_products (deal_id, product_name, quantity, unit_price, total_price, order_index) VALUES
    (deal1_id, 'Rolex Daytona Stainless Steel', 1, 35000, 35000, 0),
    (deal2_id, 'Patek Philippe Nautilus 5711', 1, 75000, 75000, 0),
    (deal3_id, 'AP Royal Oak 15500ST', 1, 55000, 55000, 0),
    (deal5_id, 'Rolex Submariner 126610LN', 1, 58000, 58000, 0),
    (deal6_id, 'Cartier Santos Large', 1, 48550, 48550, 0),
    (deal7_id, 'IWC Big Pilot 43', 1, 52850, 52850, 0),
    (deal8_id, 'Tag Heuer Monaco Calibre 11', 1, 15250, 15250, 0);

  -- Insert Tags
  INSERT INTO deal_tags (deal_id, tag, color) VALUES
    (deal1_id, 'DOMED', '#6366F1'),
    (deal2_id, 'DROPSHIP', '#8B5CF6'),
    (deal5_id, 'DOMED', '#6366F1'),
    (deal8_id, 'PAID', '#10B981');

END $$;