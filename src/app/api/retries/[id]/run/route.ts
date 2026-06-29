import { NextResponse } from 'next/server';

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const params = await context.params;
  const id = params?.id;
  // Mock action for run now
  return NextResponse.json({ success: true, id, status: 'running' });
}
