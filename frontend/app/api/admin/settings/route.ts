import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase-server';
import { requireAuth } from '@/lib/auth-server';

const ALLOWED_KEYS = [
  'phone', 'phone_href', 'email', 'address',
  'work_hours_weekdays', 'work_hours_friday',
  'map_lat', 'map_lon',
  'about_title', 'about_text',
  'meta_title', 'meta_description',
  'hero_title', 'hero_text',
  'seo_text_title', 'seo_text',
  'company_name', 'copyright_year',
  'yandex_maps_api_key',
];

export async function GET(req: NextRequest) {
  try {
    await requireAuth(req);
    const db = getSupabase();
    const { data, error } = await db.from('settings').select('*');
    if (error) throw error;
    return NextResponse.json(data ?? []);
  } catch (e: any) {
    const status = e?.message === 'Unauthorized' ? 401 : 500;
    return NextResponse.json({ detail: e?.message }, { status });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await requireAuth(req);
    const body = await req.json();
    const settings: Record<string, string> = body.settings ?? {};
    const db = getSupabase();

    for (const [key, value] of Object.entries(settings)) {
      if (!ALLOWED_KEYS.includes(key)) continue;
      if (typeof value !== 'string' || value.length > 2000) continue;
      await db.from('settings').upsert({ key, value, updated_at: new Date().toISOString() });
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    const status = e?.message === 'Unauthorized' ? 401 : 500;
    return NextResponse.json({ detail: e?.message }, { status });
  }
}
