import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase-server';
import { requireAuth } from '@/lib/auth-server';

export async function POST(req: NextRequest) {
  try {
    await requireAuth(req);
    const { refresh_token } = await req.json();
    if (refresh_token) {
      const db = getSupabase();
      await db.from('refresh_tokens').delete().eq('token', refresh_token);
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: true }); // always succeed on logout
  }
}
