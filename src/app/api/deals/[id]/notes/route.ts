import { NextResponse } from 'next/server';
import { mockDealNotes } from '../../../../../lib/mockData';

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  const params = await context.params;
  const id = params?.id;

  if (!id || typeof id !== 'string') {
    return NextResponse.json([], { status: 400 });
  }

  const notes = mockDealNotes[id] || [];
  return NextResponse.json(notes);
}
