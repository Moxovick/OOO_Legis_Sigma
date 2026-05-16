import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase-server';
import { requireAuth } from '@/lib/auth-server';

export async function GET(req: NextRequest) {
  try {
    await requireAuth(req);
    const db = getSupabase();
    const { data, error } = await db.from('stats').select('*').order('sort_order');
    if (error) throw error;
    return NextResponse.json(data ?? []);
  } catch (e: any) {
    const status = e?.message === 'Unauthorized' ? 401 : 500;
    return NextResponse.json({ detail: e?.message }, { status });
  }
}
