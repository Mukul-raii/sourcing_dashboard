export interface Deal {
  id: string;
  company_name: string;
  founder_name: string;
  email: string;
  stage: string;
  overall_score: number;
  verdict_recommendation: string;
  dataroom_status: 'none' | 'partial' | 'complete';
  last_stage_change: string;
  interactions: number;
  stage_transitions: number;
  expected_files: number;
  files_logged: number;
  deal_note_versions: number;
}

export const mockDeals: Deal[] = [
  {
    id: 'd1',
    company_name: 'Acme Fintech',
    founder_name: 'Priya Mehta',
    email: 'priya@acme.in',
    stage: 'Stage 2',
    overall_score: 8.4,
    verdict_recommendation: 'Strong Buy',
    dataroom_status: 'complete',
    last_stage_change: new Date(Date.now() - 86400000 * 2).toISOString(),
    interactions: 5,
    stage_transitions: 3,
    expected_files: 6,
    files_logged: 6,
    deal_note_versions: 3,
  },
  {
    id: 'd2',
    company_name: 'Bharat Agritech',
    founder_name: 'Rahul Sharma',
    email: 'rahul@bharatagri.com',
    stage: 'C1 Screening',
    overall_score: 5.2,
    verdict_recommendation: 'Pass',
    dataroom_status: 'none',
    last_stage_change: new Date(Date.now() - 86400000 * 5).toISOString(),
    interactions: 1,
    stage_transitions: 1,
    expected_files: 4,
    files_logged: 0,
    deal_note_versions: 1,
  },
  {
    id: 'd3',
    company_name: 'NextGen Health',
    founder_name: 'Anita Desai',
    email: 'anita@nextgen.in',
    stage: 'C1 Call',
    overall_score: 6.8,
    verdict_recommendation: 'Buy',
    dataroom_status: 'partial',
    last_stage_change: new Date(Date.now() - 86400000 * 1).toISOString(),
    interactions: 2,
    stage_transitions: 2,
    expected_files: 5,
    files_logged: 2,
    deal_note_versions: 2,
  },
  {
    id: 'd4',
    company_name: 'Rural Edu',
    founder_name: 'Vikram Singh',
    email: 'vikram@ruraledu.org',
    stage: 'Sourced',
    overall_score: 0,
    verdict_recommendation: 'Pending',
    dataroom_status: 'none',
    last_stage_change: new Date(Date.now() - 86400000 * 10).toISOString(),
    interactions: 0,
    stage_transitions: 0,
    expected_files: 3,
    files_logged: 0,
    deal_note_versions: 0,
  },
  {
    id: 'd5',
    company_name: 'Urban Mobility',
    founder_name: 'Sanjay Kumar',
    email: 'sanjay@urban.in',
    stage: 'Portfolio',
    overall_score: 9.1,
    verdict_recommendation: 'Strong Buy',
    dataroom_status: 'complete',
    last_stage_change: new Date(Date.now() - 86400000 * 30).toISOString(),
    interactions: 12,
    stage_transitions: 6,
    expected_files: 10,
    files_logged: 10,
    deal_note_versions: 5,
  }
];

export interface StageHistoryEvent {
  from: string;
  to: string;
  changed_by: string;
  timestamp: string;
  reason: string;
}

export const mockStageHistory: Record<string, StageHistoryEvent[]> = {
  'd1': [
    { from: 'C1 Call', to: 'Stage 2', changed_by: 'Automation', timestamp: new Date(Date.now() - 86400000 * 2).toISOString(), reason: 'AI Score > 8' },
    { from: 'C1 Screening', to: 'C1 Call', changed_by: 'Automation', timestamp: new Date(Date.now() - 86400000 * 5).toISOString(), reason: 'Manual override' },
    { from: 'Sourced', to: 'C1 Screening', changed_by: 'System', timestamp: new Date(Date.now() - 86400000 * 10).toISOString(), reason: '' },
  ],
  'd2': [
    { from: 'Sourced', to: 'C1 Screening', changed_by: 'System', timestamp: new Date(Date.now() - 86400000 * 5).toISOString(), reason: 'Intake form complete' },
  ]
};

export interface InteractionEvent {
  type: string;
  date: string;
  q_and_a_answered: number;
  doc_link: string;
}

export const mockInteractions: Record<string, InteractionEvent[]> = {
  'd1': [
    { type: 'Stage 2 Call', date: new Date(Date.now() - 86400000 * 3).toISOString(), q_and_a_answered: 12, doc_link: '#' },
    { type: 'C1 Call', date: new Date(Date.now() - 86400000 * 8).toISOString(), q_and_a_answered: 5, doc_link: '#' },
  ]
};

export interface DealNote {
  version: string;
  content: string;
  word_count: number;
  model_used: string;
  doc_link: string;
}

export const mockDealNotes: Record<string, DealNote[]> = {
  'd1': [
    { version: 'stage2_call', content: 'Strong team, solid tech. High customer retention.', word_count: 450, model_used: 'claude-opus', doc_link: '#' },
    { version: 'initial', content: 'Initial impressions are good.', word_count: 120, model_used: 'gemini-pro', doc_link: '#' },
  ]
};

export const mockLogs = [
  {
    id: 'log1',
    workflow_name: 'stage2_bubble_up',
    status: 'success',
    duration_ms: 1200,
    trigger_timestamp: new Date(Date.now() - 3600000).toISOString(),
    notion_page_id: 'd1',
    input_payload: { deal_id: 'd1', action: 'score' },
    output_payload: { score: 8.4 },
    error_message: null
  },
  {
    id: 'log2',
    workflow_name: 'data_room_analysis',
    status: 'failed',
    duration_ms: 5000,
    trigger_timestamp: new Date(Date.now() - 7200000).toISOString(),
    notion_page_id: 'd2',
    input_payload: { folder_id: 'f2' },
    output_payload: null,
    error_message: 'API timeout from Notion'
  }
];

export const mockErrors = [
  {
    id: 'err1',
    error_type: 'api_error',
    workflow_name: 'data_room_analysis',
    count: 3,
    last_seen: new Date(Date.now() - 7200000).toISOString(),
    resolution_status: 'pending',
    log_id: 'log2'
  }
];

export const mockRetries = [
  {
    id: 'ret1',
    workflow_name: 'data_room_analysis',
    deal_id: 'd2',
    retry_count: 1,
    max_retries: 3,
    scheduled_for: new Date(Date.now() - 1800000).toISOString(), // 30 mins ago (overdue)
    status: 'pending',
    error_message: 'API timeout from Notion'
  }
];

export const mockWorkflows = [
  { id: 'wf1', workflow_name: 'stage2_bubble_up', workflow_type: 'screening', total_runs: 150, success_rate_pct: 98, avg_duration_ms: 1100, expected_duration_ms: 1500, last_run_at: new Date(Date.now() - 3600000).toISOString() },
  { id: 'wf2', workflow_name: 'data_room_analysis', workflow_type: 'analysis', total_runs: 45, success_rate_pct: 75, avg_duration_ms: 5500, expected_duration_ms: 2000, last_run_at: new Date(Date.now() - 7200000).toISOString() },
  { id: 'wf3', workflow_name: 'file_sync', workflow_type: 'file_sync', total_runs: 300, success_rate_pct: 99, avg_duration_ms: 300, expected_duration_ms: 500, last_run_at: new Date().toISOString() }
];

export const mockDataroomStatus = [
  { folder_id: 'f1', deal_id: 'd1', company_name: 'Acme Fintech', expected_files: 6, files_logged: 6, last_file_at: new Date(Date.now() - 86400000 * 2).toISOString(), times_triggered: 3, last_triggered_at: new Date(Date.now() - 86400000 * 1).toISOString(), model_used: 'claude-opus-4', analysis_sheet_url: '#' },
  { folder_id: 'f2', deal_id: 'd3', company_name: 'NextGen Health', expected_files: 5, files_logged: 2, last_file_at: new Date(Date.now() - 86400000 * 5).toISOString(), times_triggered: 1, last_triggered_at: new Date(Date.now() - 86400000 * 4).toISOString(), model_used: 'gemini-2.5-pro', analysis_sheet_url: '#' }
];

export interface DataroomFile {
  file_name: string;
  mime_type: string;
  size: string;
  created_at: string;
}

export const mockDataroomFiles: Record<string, DataroomFile[]> = {
  'f1': [
    { file_name: 'Pitch Deck.pdf', mime_type: 'application/pdf', size: '2.4MB', created_at: new Date(Date.now() - 86400000 * 10).toISOString() },
    { file_name: 'Financials.xlsx', mime_type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', size: '1.1MB', created_at: new Date(Date.now() - 86400000 * 8).toISOString() }
  ]
};
