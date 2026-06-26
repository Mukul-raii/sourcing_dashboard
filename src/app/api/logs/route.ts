import { NextResponse } from 'next/server';

export interface LogEntry {
  id: string;
  workflow_name: string;
  source: string;
  status: 'success' | 'failed' | 'running' | 'retrying' | 'cancelled';
  trigger_timestamp: string;
  duration_ms: number;
  deal_id: string | null;
  notion_page_id: string | null;
  input_payload: unknown;
  output_payload: unknown;
  error_message: string | null;
}

const mockLogs: LogEntry[] = Array.from({ length: 50 }).map((_, i) => {
  const isError = i % 5 === 0;
  return {
    id: `log-${i}`,
    workflow_name: i % 2 === 0 ? 'data_room_analysis' : 'notion_stage_router',
    source: i % 3 === 0 ? 'google_script' : 'n8n',
    status: isError ? 'failed' : 'success',
    trigger_timestamp: new Date(Date.now() - i * 1000 * 60 * 15).toISOString(),
    duration_ms: Math.floor(Math.random() * 5000) + 100,
    deal_id: i % 4 !== 0 ? `d${(i % 5) + 1}` : null,
    notion_page_id: i % 4 !== 0 ? `notion-page-${i}` : null,
    input_payload: { trigger: 'webhook', data: { file_id: `f${i}` } },
    output_payload: isError ? null : { success: true, parsed_rows: Math.floor(Math.random() * 10) },
    error_message: isError ? 'Timeout waiting for gas execution' : null
  };
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const statusFilter = searchParams.get('status');
  const workflowFilter = searchParams.get('workflow');

  let result = [...mockLogs];

  if (statusFilter) {
    result = result.filter(l => l.status === statusFilter);
  }
  if (workflowFilter) {
    result = result.filter(l => l.workflow_name === workflowFilter);
  }

  return NextResponse.json(result);
}
