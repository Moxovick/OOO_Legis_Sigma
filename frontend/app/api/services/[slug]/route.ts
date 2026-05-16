import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase-server';

export const revalidate = 0;

export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const db = getSupabase();
    const { data, error } = await db
      .from('services')
      .select('*')
      .eq('slug', slug)
      .single();
    if (error || !data) return NextResponse.json({ detail: 'Not found' }, { status: 404 });
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json({ detail: String(e) }, { status: 500 });
  }
}
