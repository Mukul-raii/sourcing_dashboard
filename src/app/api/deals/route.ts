import { NextResponse } from 'next/server';
import { mockDeals, Deal } from '../../../lib/mockData';

export type { Deal };

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const stageFilter = searchParams.get('stage');
  const searchFilter = searchParams.get('search');
  const cohortFilter = searchParams.get('cohort');

  let result = [...mockDeals];

  if (cohortFilter) {
    // Basic mock logic for cohort filtering (assuming Q1 for d1, d2, d3 and Q2 for others)
    if (cohortFilter === 'Q1-2026') {
      result = result.filter(d => ['d1', 'd2', 'd3'].includes(d.id));
    } else if (cohortFilter === 'Q2-2026') {
      result = result.filter(d => ['d4', 'd5'].includes(d.id));
    }
  }

  if (stageFilter) {
    result = result.filter(d => d.stage === stageFilter);
  }

  if (searchFilter) {
    const s = searchFilter.toLowerCase();
    result = result.filter(d =>
      d.company_name.toLowerCase().includes(s) ||
      d.founder_name.toLowerCase().includes(s)
    );
  }

  return NextResponse.json(result);
}
