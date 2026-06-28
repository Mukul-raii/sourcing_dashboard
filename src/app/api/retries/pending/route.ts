import { NextResponse } from 'next/server';
import { mockRetries } from '@/lib/mockData';

export async function GET() {
  const pending = mockRetries.filter(r => r.status === 'pending');
  return NextResponse.json(pending);
}
