import { NextResponse } from 'next/server';

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const params = await context.params;
  const id = params?.id;
  const body = await request.json();

  // Mock action
  return NextResponse.json({ success: true, id, updated_status: body.resolution_status });
}
