import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase-server';
import { requireAuth } from '@/lib/auth-server';

export async function GET(req: NextRequest) {
  try {
    await requireAuth(req);
    const url = new URL(req.url);
    const page = Math.max(1, parseInt(url.searchParams.get('page') || '1', 10));
    const per_page = Math.min(100, Math.max(1, parseInt(url.searchParams.get('per_page') || '25', 10)));
    const is_read = url.searchParams.get('is_read');
    const form_type = url.searchParams.get('form_type');

    const from = (page - 1) * per_page;
    const to = from + per_page - 1;

    const db = getSupabase();
    let query = db
      .from('leads')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to);

    if (is_read !== null) query = query.eq('is_read', is_read === 'true');
    if (form_type) query = query.eq('form_type', form_type);

    const { data, error, count } = await query;
    if (error) throw error;

    return NextResponse.json({ items: data ?? [], total: count ?? 0, page, per_page });
  } catch (e: any) {
    const status = e?.message === 'Unauthorized' ? 401 : 500;
    return NextResponse.json({ detail: e?.message }, { status });
  }
}
