import { NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase-server';

export const revalidate = 0;

export async function GET() {
  try {
    const db = getSupabase();
    const { data, error } = await db
      .from('services')
      .select('id,slug,title,description,icon_url,image_url,sort_order,is_active,meta_title,meta_description')
      .eq('is_active', true)
      .order('sort_order');
    if (error) throw error;
    return NextResponse.json(data ?? []);
  } catch (e) {
    return NextResponse.json({ detail: String(e) }, { status: 500 });
  }
}
