import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase-server';
import { verifyToken, signAccessToken, signRefreshToken, refreshExpireDate } from '@/lib/auth-server';

export async function POST(req: NextRequest) {
  try {
    const { refresh_token } = await req.json();
    if (!refresh_token) {
      return NextResponse.json({ detail: 'Refresh token required' }, { status: 400 });
    }

    const adminId = await verifyToken(refresh_token, 'refresh');

    const db = getSupabase();
    const { data: stored } = await db
      .from('refresh_tokens')
      .select('*')
      .eq('token', refresh_token)
      .gt('expires_at', new Date().toISOString())
      .single();

    if (!stored) {
      return NextResponse.json({ detail: 'Сессия истекла' }, { status: 401 });
    }

    // Delete old token, issue new pair
    await db.from('refresh_tokens').delete().eq('token', refresh_token);

    const access_token = await signAccessToken(adminId);
    const new_refresh_token = await signRefreshToken(adminId);

    await db.from('refresh_tokens').insert({
      token: new_refresh_token,
      admin_id: adminId,
      expires_at: refreshExpireDate().toISOString(),
    });

    return NextResponse.json({ access_token, refresh_token: new_refresh_token, token_type: 'bearer' });
  } catch {
    return NextResponse.json({ detail: 'Сессия истекла' }, { status: 401 });
  }
}
