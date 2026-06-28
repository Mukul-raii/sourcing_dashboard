import { NextResponse } from 'next/server';
import { mockWorkflows } from '@/lib/mockData';

export async function GET() {
  return NextResponse.json(mockWorkflows);
}
