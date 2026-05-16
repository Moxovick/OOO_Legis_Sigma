import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase-server';

export const revalidate = 0;

export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const db = getSupabase();
    const { data } = await db.from('page_content').select('*').eq('slug', slug).single();
    return NextResponse.json(data ?? { slug, data: '{}' });
  } catch {
    return NextResponse.json({ slug: '', data: '{}' });
  }
}
