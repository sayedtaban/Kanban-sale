# Kanban Deal Board - Developer Guide

## Overview

A production-ready Kanban pipeline management system for tracking deals through various stages. Built with Next.js 13, Supabase, and modern React patterns.

## Tech Stack

- **Framework**: Next.js 13 (App Router)
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth (Email/Password)
- **UI Components**: shadcn/ui + Radix UI
- **Drag & Drop**: @dnd-kit
- **Styling**: Tailwind CSS
- **Real-time**: Supabase Realtime subscriptions

## Architecture

### Database Schema

#### Tables

1. **pipeline_stages**
   - Defines all pipeline stages (Leads, First Contact, Negotiation, etc.)
   - Ordered by `order_index` for display

2. **deals**
   - Core deal records with client info, budget, margin
   - Links to pipeline stage via `stage_id`
   - Tracks payment status, shipping dates, notes

3. **deal_products**
   - Line items for each deal
   - Quantity, pricing, and product details

4. **deal_tags**
   - Status badges (DOMED, DROPSHIP, etc.)
   - Customizable colors

5. **deal_activities**
   - Activity feed for integrations (Gmail, Twilio, Shopify)
   - Stores metadata as JSONB

6. **integration_settings**
   - User-specific API configuration
   - Encrypted API keys and integration toggles

### Component Structure

```
components/
├── auth-form.tsx          # Sign in/up form
├── auth-wrapper.tsx       # Auth state management
├── deal-card.tsx          # Individual deal card UI
├── deal-modal.tsx         # Add/Edit deal form
├── kanban-column.tsx      # Pipeline stage column
├── pipeline-header.tsx    # Stats bar with totals
├── settings-panel.tsx     # Integration settings UI
└── sortable-deal-card.tsx # Drag-enabled card wrapper
```

### Key Features

1. **Drag & Drop**
   - Move deals between stages
   - Real-time updates on drop
   - Visual feedback during drag

2. **Real-time Updates**
   - Supabase subscriptions on deals, products, tags
   - Automatic UI refresh on changes
   - Multi-user support

3. **Authentication**
   - Email/password sign up/in
   - Session management
   - Protected routes

4. **Integrations**
   - Gmail: Email activity tracking
   - Twilio: SMS event logging
   - Shopify: Order sync
   - Webhook endpoints for external events

## API Routes

### Gmail Integration
- **GET** `/api/integrations/gmail?dealId={id}` - Fetch Gmail activities
- **POST** `/api/integrations/gmail` - Log email event

### Twilio Integration
- **GET** `/api/integrations/twilio?dealId={id}` - Fetch SMS activities
- **POST** `/api/integrations/twilio` - Log SMS event

### Shopify Integration
- **GET** `/api/integrations/shopify?dealId={id}` - Fetch order activities
- **POST** `/api/integrations/shopify` - Log order event

## Setup Instructions

### 1. Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 2. Database Setup

The database schema is already applied via migrations:
- `create_deals_schema` - Core tables and RLS policies
- `seed_initial_data` - Sample pipeline data

### 3. Install Dependencies

```bash
npm install
```

### 4. Run Development Server

```bash
npm run dev
```

### 5. Build for Production

```bash
npm run build
npm start
```

## Deployment to Vercel

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

## Security

### Row Level Security (RLS)

All tables have RLS enabled with policies:
- Users can view all deals (collaborative workspace)
- Users can only insert deals with their own `created_by`
- Updates and deletes allowed for authenticated users
- Integration settings isolated per user

### API Keys

Integration API keys stored encrypted in `integration_settings` table.

## Customization

### Adding a New Pipeline Stage

1. Insert into `pipeline_stages` table:
```sql
INSERT INTO pipeline_stages (name, order_index, color)
VALUES ('New Stage', 12, '#HEXCOLOR');
```

2. UI automatically updates via real-time subscription

### Modifying Deal Fields

1. Add column to `deals` table via migration
2. Update TypeScript types in `lib/types.ts`
3. Add field to `deal-modal.tsx` form
4. Update `handleSaveDeal` in `app/page.tsx`

### Custom Integrations

1. Create new API route: `app/api/integrations/[name]/route.ts`
2. Follow existing Gmail/Twilio/Shopify patterns
3. Add to `integration_settings` table enum
4. Update `settings-panel.tsx` UI

## Data Flow

### Creating a Deal

1. User clicks "Add Deal" button
2. `DealModal` opens with empty form
3. User fills details, products, tags
4. Form submits to `handleSaveDeal` function
5. Inserts into `deals`, `deal_products`, `deal_tags`
6. Real-time subscription triggers reload
7. UI updates with new deal card

### Moving a Deal

1. User drags `SortableDealCard`
2. `handleDragEnd` fires on drop
3. Updates `stage_id` in database
4. Real-time subscription triggers reload
5. Deal appears in new column

## Testing

### Manual Testing Checklist

- [ ] Sign up new user
- [ ] Sign in existing user
- [ ] Create new deal with products and tags
- [ ] Edit existing deal
- [ ] Drag deal between stages
- [ ] View pipeline stats update
- [ ] Configure integrations in settings
- [ ] Sign out

### Future Enhancements

- Unit tests with Vitest
- E2E tests with Playwright
- Webhook testing utilities

## Performance Considerations

### Optimization Strategies

1. **Database Queries**
   - Single query loads all deals with nested data
   - Indexes on foreign keys (`stage_id`, `deal_id`)
   - Real-time subscriptions limited to necessary tables

2. **Client-Side**
   - React memo for complex cards
   - Lazy loading for large deal lists
   - Optimistic updates on drag

3. **Build**
   - Static generation where possible
   - API routes for dynamic data
   - Tree shaking unused UI components

## Troubleshooting

### Common Issues

**Issue**: Deals not loading
- Check Supabase connection
- Verify RLS policies allow access
- Check browser console for errors

**Issue**: Drag and drop not working
- Ensure `@dnd-kit` packages installed
- Check sensors configuration
- Verify card IDs are unique

**Issue**: Real-time updates not working
- Check Supabase Realtime enabled
- Verify subscription channel names
- Check network tab for websocket connection

## Support & Maintenance

### Code Style
- TypeScript strict mode
- ESLint rules enforced
- Prettier for formatting

### Git Workflow
- Main branch for production
- Feature branches for new work
- PR reviews required

### Monitoring
- Vercel Analytics for performance
- Supabase dashboard for database metrics
- Error tracking via Sentry (to be added)

## License

Proprietary - All rights reserved

---

**Last Updated**: 2025-10-25
**Version**: 1.0.0
**Maintainer**: Development Team
