import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getSupabase } from '@/lib/supabase-server';
import { signAccessToken, signRefreshToken, refreshExpireDate } from '@/lib/auth-server';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ detail: 'Email и пароль обязательны' }, { status: 400 });
    }

    const db = getSupabase();
    const { data: admin } = await db.from('admins').select('*').eq('email', email).single();
    if (!admin) {
      return NextResponse.json({ detail: 'Неверный email или пароль' }, { status: 401 });
    }

    const valid = await bcrypt.compare(password, admin.password_hash);
    if (!valid) {
      return NextResponse.json({ detail: 'Неверный email или пароль' }, { status: 401 });
    }

    const access_token = await signAccessToken(admin.id);
    const refresh_token = await signRefreshToken(admin.id);

    await db.from('refresh_tokens').insert({
      token: refresh_token,
      admin_id: admin.id,
      expires_at: refreshExpireDate().toISOString(),
    });

    return NextResponse.json({ access_token, refresh_token, token_type: 'bearer' });
  } catch (e) {
    return NextResponse.json({ detail: String(e) }, { status: 500 });
  }
}
