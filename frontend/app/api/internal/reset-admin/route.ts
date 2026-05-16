import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getSupabase } from '@/lib/supabase-server';

export async function POST(req: NextRequest) {
  const secret = req.headers.get('x-seed-secret');
  if (!secret || secret !== process.env.SEED_SECRET) {
    return NextResponse.json({ ok: false, error: 'Forbidden' }, { status: 403 });
  }

  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ ok: false, error: 'Email and password required' }, { status: 400 });
    }

    const password_hash = await bcrypt.hash(password, 12);
    const db = getSupabase();
    const { data: existing } = await db.from('admins').select('id').eq('email', email).single();

    if (existing) {
      await db.from('admins').update({ password_hash }).eq('email', email);
    } else {
      await db.from('admins').insert({ email, password_hash });
    }

    return NextResponse.json({ ok: true, email });
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
  }
}
