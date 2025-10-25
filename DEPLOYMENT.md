# Deployment Guide

## Vercel Deployment

### Required Environment Variables

Add these environment variables in your Vercel dashboard:

1. Go to your Vercel project dashboard
2. Navigate to Settings → Environment Variables
3. Add the following variables:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Getting Supabase Credentials

1. Go to your Supabase project dashboard
2. Navigate to Settings → API
3. Copy the following values:
   - **Project URL** → Use as `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → Use as `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Deployment Steps

1. **Fork/Clone the repository**
2. **Connect to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
3. **Add Environment Variables:**
   - In Vercel dashboard, go to Settings → Environment Variables
   - Add the Supabase credentials
4. **Deploy:**
   - Click "Deploy" button
   - Vercel will automatically build and deploy your project

### Database Setup

1. **Run Migrations:**
   - Go to your Supabase dashboard
   - Navigate to SQL Editor
   - Run the migration files from `supabase/migrations/`

2. **Seed Data:**
   - Run the seed data script from `supabase/migrations/20251025045508_seed_initial_data.sql`

### Troubleshooting

**Build Error: "supabaseUrl is required"**
- Ensure environment variables are set in Vercel
- Check that variable names match exactly (case-sensitive)
- Redeploy after adding environment variables

**Database Connection Issues**
- Verify Supabase project is active
- Check that RLS policies are properly configured
- Ensure migrations have been run

### Local Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Create `.env.local` file:**
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

3. **Run development server:**
   ```bash
   npm run dev
   ```
