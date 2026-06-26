import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    runs_24h: 1245,
    success_rate_pct: 94.2,
    active_failures: 12,
    pending_retries: 5
  });
}
