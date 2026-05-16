import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getSupabase } from '@/lib/supabase-server';

export async function POST(req: NextRequest) {
  const secret = req.headers.get('x-seed-secret');
  if (!secret || secret !== process.env.SEED_SECRET) {
    return NextResponse.json({ ok: false, error: 'Forbidden' }, { status: 403 });
  }

  try {
    const db = getSupabase();
    const inserted: string[] = [];

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    if (adminEmail && adminPassword) {
      const { data: existing } = await db.from('admins').select('id').eq('email', adminEmail).single();
      if (!existing) {
        const password_hash = await bcrypt.hash(adminPassword, 12);
        await db.from('admins').insert({ email: adminEmail, password_hash });
        inserted.push('admin');
      }
    }

    return NextResponse.json({ ok: true, inserted });
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
  }
}
