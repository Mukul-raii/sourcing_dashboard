import { NextResponse } from 'next/server';

export async function GET() {
  const cohorts = [
    {
      id: 'Q1-2026',
      cohort: 'Q1 2026',
      sourced: 42,
      c1_pass: 18,
      stage2: 7,
      stage3: 3,
      portfolio: 1,
      c1_to_s2_rate: '39%'
    },
    {
      id: 'Q2-2026',
      cohort: 'Q2 2026',
      sourced: 38,
      c1_pass: 21,
      stage2: 9,
      stage3: 2,
      portfolio: 0,
      c1_to_s2_rate: '55%'
    }
  ];
  return NextResponse.json(cohorts);
}
