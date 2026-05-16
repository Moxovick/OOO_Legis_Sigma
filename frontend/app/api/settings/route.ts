import { NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase-server';

export const revalidate = 0;

export async function GET() {
  try {
    const db = getSupabase();
    const { data, error } = await db.from('settings').select('*');
    if (error) throw error;
    return NextResponse.json(data ?? []);
  } catch (e: any) {
    const msg = e?.message ?? e?.code ?? JSON.stringify(e) ?? String(e);
    return NextResponse.json({ detail: msg }, { status: 500 });
  }
}
