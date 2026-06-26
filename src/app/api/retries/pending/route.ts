import { NextResponse } from 'next/server';

export async function GET() {
  const retries = [
    { id: 'r1', log_id: 'log-0', workflow_name: 'data_room_analysis', deal_id: 'd1', retry_count: 1, max_retries: 3, scheduled_for: new Date(Date.now() - 3600000).toISOString(), retry_status: 'pending', error_message: 'Timeout waiting for gas execution' },
    { id: 'r2', log_id: 'log-5', workflow_name: 'notion_stage_router', deal_id: null, retry_count: 2, max_retries: 5, scheduled_for: new Date(Date.now() + 600000).toISOString(), retry_status: 'pending', error_message: 'API rate limit exceeded' },
    { id: 'r3', log_id: 'log-10', workflow_name: 'dealnote_update_subworkflow', deal_id: 'd3', retry_count: 3, max_retries: 3, scheduled_for: new Date(Date.now() - 86400000).toISOString(), retry_status: 'pending', error_message: 'Connection reset by peer' },
  ];
  return NextResponse.json(retries);
}
