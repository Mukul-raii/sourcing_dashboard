import { NextResponse } from 'next/server';
import { mockErrors } from '@/lib/mockData';

export async function GET() {
  return NextResponse.json(mockErrors);
}
