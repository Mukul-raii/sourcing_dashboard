import { NextResponse } from 'next/server';
import { mockLogs, mockErrors, mockRetries } from '@/lib/mockData';

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  const params = await context.params;
  const id = params?.id;
  const log = mockLogs.find(l => l.id === id);
  if (!log) return NextResponse.json(null, { status: 404 });

  const logErrors = mockErrors.filter(e => e.log_id === id);
  const logRetries = mockRetries.filter(r => mockLogs.find(ml => ml.id === id && ml.notion_page_id === r.deal_id));

  return NextResponse.json({
    ...log,
    automation_errors: logErrors,
    retry_queue: logRetries
  });
}
