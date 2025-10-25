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
      .eq('activity_type', 'twilio')
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) throw error;

    return NextResponse.json({ activities });
  } catch (error) {
    console.error('Twilio API error:', error);
    return NextResponse.json({ error: 'Failed to fetch Twilio activities' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { dealId, from, body: messageBody, direction, sid } = body;

    if (!dealId || !messageBody) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { data: activity, error } = await supabase
      .from('deal_activities')
      .insert({
        deal_id: dealId,
        activity_type: 'twilio',
        title: `SMS ${direction === 'inbound' ? 'received' : 'sent'}`,
        description: messageBody,
        metadata: {
          from,
          direction,
          sid,
          timestamp: new Date().toISOString(),
        },
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ activity });
  } catch (error) {
    console.error('Twilio webhook error:', error);
    return NextResponse.json({ error: 'Failed to process Twilio event' }, { status: 500 });
  }
}
