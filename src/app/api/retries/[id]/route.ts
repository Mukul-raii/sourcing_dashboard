import { NextResponse } from 'next/server';

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const params = await context.params;
  const id = params?.id;
  // Mock action for cancel
  return NextResponse.json({ success: true, id, status: 'cancelled' });
}
