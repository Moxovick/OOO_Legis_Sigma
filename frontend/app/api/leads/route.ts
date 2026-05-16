import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase-server';

const VALID_FORM_TYPES = ['main', 'call', 'order', 'consult', 'contract', 'contacts'];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, phone, message, form_type } = body;

    if (!phone || typeof phone !== 'string') {
      return NextResponse.json(
        { detail: [{ msg: 'Номер телефона обязателен' }] },
        { status: 422 }
      );
    }
    const ft = VALID_FORM_TYPES.includes(form_type) ? form_type : 'main';

    const db = getSupabase();
    const { error } = await db.from('leads').insert({
      name: name ?? null,
      phone: phone.trim(),
      message: message ?? null,
      form_type: ft,
    });
    if (error) throw error;
    return NextResponse.json({ ok: true, message: 'Заявка принята' });
  } catch (e) {
    return NextResponse.json({ detail: String(e) }, { status: 500 });
  }
}
