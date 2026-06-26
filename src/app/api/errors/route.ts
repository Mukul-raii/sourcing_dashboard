import { NextResponse } from 'next/server';

const mockErrors = [
  { id: 'e1', error_type: 'api_error', workflow_name: 'data_room_analysis', count: 3, last_seen: new Date(Date.now() - 7200000).toISOString(), resolution_status: 'pending' },
  { id: 'e2', error_type: 'timeout', workflow_name: 'dealnote_update_subworkflow', count: 1, last_seen: new Date(Date.now() - 21600000).toISOString(), resolution_status: 'wontfix' },
  { id: 'e3', error_type: 'auth_error', workflow_name: 'notion_stage_router', count: 15, last_seen: new Date(Date.now() - 300000).toISOString(), resolution_status: 'investigating' },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const resolutionFilter = searchParams.get('resolution');

  let result = [...mockErrors];

  if (resolutionFilter) {
    result = result.filter(e => e.resolution_status === resolutionFilter);
  }

  return NextResponse.json(result);
}

export async function PATCH(request: Request) {
  // Mock PATCH behavior
  try {
    const data = await request.json();
    return NextResponse.json({ success: true, updated: data });
  } catch (_) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }
}
