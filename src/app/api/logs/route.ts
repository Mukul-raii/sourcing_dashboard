import { NextResponse } from 'next/server';
import { mockLogs } from '@/lib/mockData';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const statusFilter = searchParams.get('status');
  const workflowFilter = searchParams.get('workflow');

  let result = [...mockLogs];
  if (statusFilter) result = result.filter(l => l.status === statusFilter);
  if (workflowFilter) result = result.filter(l => l.workflow_name === workflowFilter);

  return NextResponse.json(result);
}
