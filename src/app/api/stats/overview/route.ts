import { NextResponse } from 'next/server';
import { mockLogs, mockRetries } from '@/lib/mockData';

export async function GET() {
  const stats = {
    runs_24h: mockLogs.length,
    success_rate: 95,
    active_failures: mockLogs.filter(l => l.status === 'failed').length,
    pending_retries: mockRetries.filter(r => r.status === 'pending').length
  };
  return NextResponse.json(stats);
}
