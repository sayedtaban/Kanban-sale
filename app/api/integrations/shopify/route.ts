import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const dealId = request.nextUrl.searchParams.get('dealId');

    if (!dealId) {
      return NextResponse.json({ error: 'Deal ID is required' }, { status: 400 });
    }

    const { data: activities, error } = await supabase
      .from('deal_activities')
      .select('*')
      .eq('deal_id', dealId)
      .eq('activity_type', 'shopify')
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) throw error;

    return NextResponse.json({ activities });
  } catch (error) {
    console.error('Shopify API error:', error);
    return NextResponse.json({ error: 'Failed to fetch Shopify activities' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { dealId, orderId, orderName, customer, totalPrice, fulfillmentStatus } = body;

    if (!dealId || !orderId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { data: activity, error } = await supabase
      .from('deal_activities')
      .insert({
        deal_id: dealId,
        activity_type: 'shopify',
        title: `Order ${orderName || orderId}`,
        description: `Order by ${customer} - $${totalPrice}`,
        metadata: {
          orderId,
          orderName,
          customer,
          totalPrice,
          fulfillmentStatus,
          timestamp: new Date().toISOString(),
        },
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ activity });
  } catch (error) {
    console.error('Shopify webhook error:', error);
    return NextResponse.json({ error: 'Failed to process Shopify event' }, { status: 500 });
  }
}
