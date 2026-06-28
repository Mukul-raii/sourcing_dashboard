import { NextResponse } from 'next/server';
import { mockDataroomStatus } from '@/lib/mockData';

export async function GET() {
  return NextResponse.json(mockDataroomStatus);
}
