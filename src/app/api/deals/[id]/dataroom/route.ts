import { NextResponse } from 'next/server';
import { mockDataroomStatus } from '../../../../../lib/mockData';

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  const params = await context.params;
  const id = params?.id;

  if (!id || typeof id !== 'string') {
    return NextResponse.json(null, { status: 400 });
  }

  const dataroom = mockDataroomStatus.find(ds => ds.deal_id === id) || null;
  return NextResponse.json(dataroom);
}
