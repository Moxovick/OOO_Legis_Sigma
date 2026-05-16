import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase-server';
import { requireAuth } from '@/lib/auth-server';

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAuth(req);
    const { id } = await params;
    const db = getSupabase();
    await db.from('leads').delete().eq('id', id);
    return new NextResponse(null, { status: 204 });
  } catch (e: any) {
    const status = e?.message === 'Unauthorized' ? 401 : 500;
    return NextResponse.json({ detail: e?.message }, { status });
  }
}
