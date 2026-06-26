import { NextResponse } from 'next/server';

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

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const stageFilter = searchParams.get('stage');
  const searchFilter = searchParams.get('search');
<<<<<<< Updated upstream

  let result = [...mockDeals];

  if (stageFilter) {
    result = result.filter(d => d.stage === stageFilter);
  }

  if (searchFilter) {
    const s = searchFilter.toLowerCase();
    result = result.filter(d =>
      d.company_name.toLowerCase().includes(s) ||
=======

  let result = [...mockDeals];

  if (stageFilter) {
    result = result.filter(d => d.stage === stageFilter);
  }

  if (searchFilter) {
    const s = searchFilter.toLowerCase();
    result = result.filter(d =>
      d.company_name.toLowerCase().includes(s) ||
>>>>>>> Stashed changes
      d.founder_name.toLowerCase().includes(s)
    );
  }

  return NextResponse.json(result);
}
