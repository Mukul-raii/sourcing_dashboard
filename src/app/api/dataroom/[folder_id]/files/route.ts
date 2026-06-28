import { NextResponse } from 'next/server';
import { mockDataroomFiles } from '@/lib/mockData';

export async function GET(request: Request, context: { params: Promise<{ folder_id: string }> }) {
  const params = await context.params;
  const folder_id = params?.folder_id;
  const files = mockDataroomFiles[folder_id] || [];
  return NextResponse.json(files);
}
