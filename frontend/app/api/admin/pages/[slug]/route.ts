import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase-server';
import { requireAuth } from '@/lib/auth-server';

export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    await requireAuth(req);
    const { slug } = await params;
    const db = getSupabase();
    const { data } = await db.from('page_content').select('*').eq('slug', slug).single();
    return NextResponse.json(data ?? { slug, data: '{}' });
  } catch (e: any) {
    const status = e?.message === 'Unauthorized' ? 401 : 500;
    return NextResponse.json({ detail: e?.message }, { status });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    await requireAuth(req);
    const { slug } = await params;
    const body = await req.json();
    const dataStr = body.data;

    try { JSON.parse(dataStr); } catch {
      return NextResponse.json({ detail: 'Invalid JSON' }, { status: 400 });
    }

    const db = getSupabase();
    await db.from('page_content').upsert({
      slug,
      data: dataStr,
      updated_at: new Date().toISOString(),
    });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    const status = e?.message === 'Unauthorized' ? 401 : 500;
    return NextResponse.json({ detail: e?.message }, { status });
  }
}
