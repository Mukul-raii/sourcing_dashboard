import { NextResponse } from 'next/server';

export async function GET() {
  const workflows = [
    { id: 'w1', workflow_name: 'data_room_analysis', workflow_type: 'analysis', status: 'Degraded', total_runs: 450, success_rate_pct: 92.5, avg_duration_ms: 15000, expected_duration_ms: 8000, last_run_at: new Date(Date.now() - 600000).toISOString() },
    { id: 'w2', workflow_name: 'notion_stage_router', workflow_type: 'routing', status: 'Healthy', total_runs: 1200, success_rate_pct: 99.1, avg_duration_ms: 450, expected_duration_ms: 500, last_run_at: new Date(Date.now() - 120000).toISOString() },
    { id: 'w3', workflow_name: 'dealnote_update_subworkflow', workflow_type: 'sync', status: 'Failing', total_runs: 85, success_rate_pct: 74.0, avg_duration_ms: 3200, expected_duration_ms: 3000, last_run_at: new Date(Date.now() - 3600000).toISOString() },
  ];
  return NextResponse.json(workflows);
}
