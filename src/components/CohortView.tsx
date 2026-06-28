import React, { useState, useEffect } from 'react';

export interface CohortData {
  id: string;
  cohort: string;
  sourced: number;
  c1_pass: number;
  stage2: number;
  stage3: number;
  portfolio: number;
  c1_to_s2_rate: string;
}

interface CohortViewProps {
  onCohortClick: (cohortId: string | null) => void;
  selectedCohort: string | null;
}

export default function CohortView({ onCohortClick, selectedCohort }: CohortViewProps) {
  const [cohorts, setCohorts] = useState<CohortData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/cohorts')
      .then((res) => res.json())
      .then((data) => {
        setCohorts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-yellow"></div>
      </div>
    );
  }

  return (
    <div className="bg-brand-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h2 className="text-xl font-bold text-brand-navy mb-4">Cohort Analysis (Intake Quarter)</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b-2 border-gray-200">
              <th className="py-3 px-4 font-bold text-brand-navy">Cohort</th>
              <th className="py-3 px-4 font-bold text-brand-navy">Sourced</th>
              <th className="py-3 px-4 font-bold text-brand-navy">C1 Pass</th>
              <th className="py-3 px-4 font-bold text-brand-navy">Stage 2</th>
              <th className="py-3 px-4 font-bold text-brand-navy">Stage 3</th>
              <th className="py-3 px-4 font-bold text-brand-navy">Portfolio</th>
              <th className="py-3 px-4 font-bold text-brand-navy">C1→S2 Rate</th>
            </tr>
          </thead>
          <tbody>
            {cohorts.map((c) => (
              <tr
                key={c.id}
                onClick={() => onCohortClick(selectedCohort === c.id ? null : c.id)}
                className={`border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${selectedCohort === c.id ? 'bg-yellow-50' : ''}`}
              >
                <td className="py-3 px-4 font-medium text-brand-navy">{c.cohort}</td>
                <td className="py-3 px-4">{c.sourced}</td>
                <td className="py-3 px-4">{c.c1_pass}</td>
                <td className="py-3 px-4">{c.stage2}</td>
                <td className="py-3 px-4">{c.stage3}</td>
                <td className="py-3 px-4">{c.portfolio}</td>
                <td className="py-3 px-4 font-medium text-brand-amber">{c.c1_to_s2_rate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
