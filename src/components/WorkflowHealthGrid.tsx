"use client";

import React, { useState, useEffect } from 'react';

interface Workflow {
  id: string;
  workflow_name: string;
  workflow_type: string;
  status: string;
  total_runs: number;
  success_rate_pct: number;
  avg_duration_ms: number;
  expected_duration_ms: number;
  last_run_at: string;
}

export default function WorkflowHealthGrid() {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWorkflows = async () => {
      try {
        const res = await fetch('/api/workflows');
        if (!res.ok) throw new Error('Failed to fetch workflows');
        const data = await res.json();
        setWorkflows(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchWorkflows();
  }, []);

  if (loading) {
    return <div className="h-full flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F9A822]"></div></div>;
  }

  return (
    <div className="overflow-auto h-full">
      <table className="min-w-full text-sm text-left">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-200 sticky top-0">
          <tr>
            <th className="px-6 py-4">Workflow</th>
            <th className="px-6 py-4">Type</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4 text-right">Runs (30d)</th>
            <th className="px-6 py-4 text-right">Success Rate</th>
            <th className="px-6 py-4 text-right">Avg Duration</th>
            <th className="px-6 py-4">Last Run</th>
          </tr>
        </thead>
        <tbody>
          {workflows.map((wf) => (
            <tr key={wf.id} className="bg-white border-b border-gray-100 hover:bg-[#F7F6F6] transition-colors">
              <td className="px-6 py-4 font-bold text-[#1A2340]">{wf.workflow_name}</td>
              <td className="px-6 py-4 text-gray-500">{wf.workflow_type}</td>
              <td className="px-6 py-4">
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                  wf.status === 'Healthy' ? 'bg-green-100 text-green-800' :
                  wf.status === 'Degraded' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {wf.status}
                </span>
              </td>
              <td className="px-6 py-4 text-right font-medium">{wf.total_runs.toLocaleString()}</td>
              <td className={`px-6 py-4 text-right font-bold ${
                wf.success_rate_pct >= 95 ? 'text-green-600' :
                wf.success_rate_pct >= 80 ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {wf.success_rate_pct.toFixed(1)}%
              </td>
              <td className="px-6 py-4 text-right">
                <span className={wf.avg_duration_ms > wf.expected_duration_ms * 2 ? 'text-red-600 font-bold' : 'text-gray-600'}>
                  {wf.avg_duration_ms} ms
                </span>
                <span className="text-xs text-gray-400 block">vs {wf.expected_duration_ms} ms</span>
              </td>
              <td className="px-6 py-4 text-gray-500 text-xs">
                {new Date(wf.last_run_at).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
