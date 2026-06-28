"use client";

import React, { useState, useEffect } from 'react';

type TabType = 'Summary Stats' | 'Workflow Health' | 'Log Explorer' | 'Error Center' | 'Retry Queue';

export default function LogsPage() {
  const [activeTab, setActiveTab] = useState<TabType>('Summary Stats');

  const [stats, setStats] = useState<Record<string, unknown> | null>(null);
  const [workflows, setWorkflows] = useState<Record<string, unknown>[]>([]);
  const [logs, setLogs] = useState<Record<string, unknown>[]>([]);
  const [errors, setErrors] = useState<Record<string, unknown>[]>([]);
  const [retries, setRetries] = useState<Record<string, unknown>[]>([]);

  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);

  const fetchErrors = async () => {
    const res = await fetch('/api/errors');
    setErrors(await res.json());
  };

  const fetchRetries = async () => {
    const res = await fetch('/api/retries/pending');
    setRetries(await res.json());
  };

  useEffect(() => {
    let mounted = true;

    const initialFetch = async () => {
      try {
        const [statsRes, wfRes, logsRes, errorsRes, retriesRes] = await Promise.all([
          fetch('/api/stats/overview'),
          fetch('/api/workflows'),
          fetch('/api/logs'),
          fetch('/api/errors'),
          fetch('/api/retries/pending')
        ]);

        const [statsData, wfData, logsData, errorsData, retriesData] = await Promise.all([
          statsRes.json(),
          wfRes.json(),
          logsRes.json(),
          errorsRes.json(),
          retriesRes.json()
        ]);

        if (mounted) {
          setStats(statsData);
          setWorkflows(wfData);
          setLogs(logsData);
          setErrors(errorsData);
          setRetries(retriesData);
        }
      } catch (e) {
        console.error(e);
      }
    };

    initialFetch();

    const interval = setInterval(async () => {
      try {
        const res = await fetch('/api/stats/overview');
        const data = await res.json();
        if (mounted) setStats(data);
      } catch (e) {
        console.error(e);
      }
    }, 30000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  const handleUpdateErrorResolution = async (id: string, status: string) => {
    try {
      await fetch(`/api/errors/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resolution_status: status })
      });
      fetchErrors();
    } catch(e) { console.error(e) }
  };

  const handleRetryRun = async (id: string) => {
    try {
      await fetch(`/api/retries/${id}/run`, { method: 'POST' });
      fetchRetries();
    } catch(e) { console.error(e) }
  };

  const handleRetryCancel = async (id: string) => {
    try {
      await fetch(`/api/retries/${id}`, { method: 'PATCH' });
      fetchRetries();
    } catch(e) { console.error(e) }
  };

  return (
    <div className="h-full flex flex-col relative overflow-hidden bg-brand-white">
      <div className="flex border-b border-gray-200 mb-6 overflow-x-auto hide-scrollbar bg-white pt-4 px-6 shadow-sm">
        {(['Summary Stats', 'Workflow Health', 'Log Explorer', 'Error Center', 'Retry Queue'] as TabType[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`whitespace-nowrap py-3 px-6 text-sm font-bold border-b-2 transition-colors ${
              activeTab === tab
                ? 'border-brand-yellow text-brand-navy'
                : 'border-transparent text-gray-500 hover:text-brand-navy'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-auto p-6">
        {/* KPI Cards always visible at top */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 border-l-4 border-l-blue-500">
             <p className="text-sm text-gray-500 font-medium">Runs (24h)</p>
             <p className="text-2xl font-bold text-brand-navy">{stats ? String(stats.runs_24h) : 0}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 border-l-4 border-l-green-500">
             <p className="text-sm text-gray-500 font-medium">Success Rate</p>
             <p className="text-2xl font-bold text-brand-navy">{stats ? String(stats.success_rate) : 0}%</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 border-l-4 border-l-red-500">
             <p className="text-sm text-gray-500 font-medium">Active Failures</p>
             <p className="text-2xl font-bold text-brand-navy">{stats ? String(stats.active_failures) : 0}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 border-l-4 border-l-yellow-500">
             <p className="text-sm text-gray-500 font-medium">Pending Retries</p>
             <p className="text-2xl font-bold text-brand-navy">{stats ? String(stats.pending_retries) : 0}</p>
          </div>
        </div>

        {activeTab === 'Summary Stats' && (
          <div className="text-gray-500 text-sm">
            Overview statistics are shown above. Select another tab for details.
          </div>
        )}

        {activeTab === 'Workflow Health' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="py-3 px-4 font-bold text-brand-navy text-sm">Workflow</th>
                  <th className="py-3 px-4 font-bold text-brand-navy text-sm">Type</th>
                  <th className="py-3 px-4 font-bold text-brand-navy text-sm">Status</th>
                  <th className="py-3 px-4 font-bold text-brand-navy text-sm">Runs (30d)</th>
                  <th className="py-3 px-4 font-bold text-brand-navy text-sm">Success Rate</th>
                  <th className="py-3 px-4 font-bold text-brand-navy text-sm">Avg Duration</th>
                  <th className="py-3 px-4 font-bold text-brand-navy text-sm">Last Run</th>
                </tr>
              </thead>
              <tbody>
                {workflows.map((wf: Record<string, unknown>) => {
                  const successRate = Number(wf.success_rate_pct) || 0;
                  const avgDuration = Number(wf.avg_duration_ms) || 0;
                  const expectedDuration = Number(wf.expected_duration_ms) || 1;
                  const status = successRate >= 95 ? 'Healthy' : successRate >= 80 ? 'Degraded' : 'Failing';
                  const statusColor = status === 'Healthy' ? 'text-green-600 bg-green-50' : status === 'Degraded' ? 'text-yellow-600 bg-yellow-50' : 'text-red-600 bg-red-50';
                  const durationColor = avgDuration > expectedDuration * 2 ? 'text-red-600' : 'text-gray-800';

                  return (
                    <tr key={String(wf.id)} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium text-brand-navy">{String(wf.workflow_name)}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">{String(wf.workflow_type)}</td>
                      <td className="py-3 px-4 text-sm">
                         <span className={`px-2 py-1 rounded font-bold ${statusColor}`}>{status}</span>
                      </td>
                      <td className="py-3 px-4 text-sm">{String(wf.total_runs)}</td>
                      <td className="py-3 px-4 text-sm font-medium">{String(wf.success_rate_pct)}%</td>
                      <td className={`py-3 px-4 text-sm font-medium ${durationColor}`}>{String(wf.avg_duration_ms)}ms</td>
                      <td className="py-3 px-4 text-sm text-gray-500">{new Date(String(wf.last_run_at)).toLocaleString()}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'Log Explorer' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="py-3 px-4 font-bold text-brand-navy text-sm">Status</th>
                  <th className="py-3 px-4 font-bold text-brand-navy text-sm">Workflow</th>
                  <th className="py-3 px-4 font-bold text-brand-navy text-sm">Deal ID</th>
                  <th className="py-3 px-4 font-bold text-brand-navy text-sm">Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log: Record<string, unknown>) => (
                  <React.Fragment key={String(log.id)}>
                    <tr
                      className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                      onClick={() => setExpandedLogId(expandedLogId === String(log.id) ? null : String(log.id))}
                    >
                      <td className="py-3 px-4 text-sm">
                        <span className={`px-2 py-0.5 rounded font-bold text-xs ${log.status === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {String(log.status)}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm font-medium">{String(log.workflow_name)}</td>
                      <td className="py-3 px-4 text-sm font-mono text-gray-500">{String(log.notion_page_id)}</td>
                      <td className="py-3 px-4 text-sm text-gray-500">{new Date(String(log.trigger_timestamp)).toLocaleString()}</td>
                    </tr>
                    {expandedLogId === String(log.id) && (
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <td colSpan={4} className="p-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="font-bold text-xs text-gray-500 mb-1">Input Payload</p>
                              <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto max-h-40">{JSON.stringify(log.input_payload, null, 2)}</pre>
                            </div>
                            <div>
                              <p className="font-bold text-xs text-gray-500 mb-1">Output Payload</p>
                              <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto max-h-40">{JSON.stringify(log.output_payload, null, 2)}</pre>
                            </div>
                          </div>
                          {log.error_message ? (
                            <div className="mt-4 p-3 bg-red-50 text-red-700 rounded text-sm font-medium border border-red-200">
                              Error: {String(log.error_message)}
                            </div>
                          ) : null}
                          {log.status === 'failed' && (
                            <div className="mt-4">
                              <button className="bg-brand-yellow text-brand-black px-4 py-1.5 rounded text-sm font-bold shadow-sm hover:bg-brand-amber transition-colors">
                                Retry Now
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'Error Center' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="py-3 px-4 font-bold text-brand-navy text-sm">Error Type</th>
                  <th className="py-3 px-4 font-bold text-brand-navy text-sm">Workflow</th>
                  <th className="py-3 px-4 font-bold text-brand-navy text-sm">Count</th>
                  <th className="py-3 px-4 font-bold text-brand-navy text-sm">Last Seen</th>
                  <th className="py-3 px-4 font-bold text-brand-navy text-sm">Resolution</th>
                </tr>
              </thead>
              <tbody>
                {errors.map((err: Record<string, unknown>) => (
                  <tr key={String(err.id)} className="border-b border-gray-100">
                    <td className="py-3 px-4 text-sm font-mono text-red-600 bg-red-50 inline-block m-2 rounded px-2 py-1">{String(err.error_type)}</td>
                    <td className="py-3 px-4 text-sm font-medium">{String(err.workflow_name)}</td>
                    <td className="py-3 px-4 text-sm">{String(err.count)}</td>
                    <td className="py-3 px-4 text-sm text-gray-500">{new Date(String(err.last_seen)).toLocaleString()}</td>
                    <td className="py-3 px-4 text-sm">
                      <select
                        className="border border-gray-300 rounded px-2 py-1 text-sm bg-white"
                        value={String(err.resolution_status)}
                        onChange={(e) => handleUpdateErrorResolution(String(err.id), e.target.value)}
                      >
                        <option value="pending">Pending</option>
                        <option value="investigating">Investigating</option>
                        <option value="resolved">Resolved</option>
                        <option value="wontfix">Won&apos;t Fix</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'Retry Queue' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="py-3 px-4 font-bold text-brand-navy text-sm">Workflow</th>
                  <th className="py-3 px-4 font-bold text-brand-navy text-sm">Deal ID</th>
                  <th className="py-3 px-4 font-bold text-brand-navy text-sm">Retry #</th>
                  <th className="py-3 px-4 font-bold text-brand-navy text-sm">Scheduled For</th>
                  <th className="py-3 px-4 font-bold text-brand-navy text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {retries.map((r: Record<string, unknown>) => (
                  <tr key={String(r.id)} className="border-b border-gray-100">
                    <td className="py-3 px-4 text-sm font-medium">{String(r.workflow_name)}</td>
                    <td className="py-3 px-4 text-sm font-mono text-gray-500">{String(r.deal_id)}</td>
                    <td className="py-3 px-4 text-sm">{String(r.retry_count)} / {String(r.max_retries)}</td>
                    <td className="py-3 px-4 text-sm">
                       <span className="text-yellow-600 font-medium">{new Date(String(r.scheduled_for)).toLocaleString()} (Overdue)</span>
                    </td>
                    <td className="py-3 px-4 text-sm flex gap-2">
                      <button onClick={() => handleRetryRun(String(r.id))} className="bg-brand-navy text-white px-3 py-1 rounded text-xs font-bold hover:opacity-90 transition-opacity">Run Now</button>
                      <button onClick={() => handleRetryCancel(String(r.id))} className="border border-gray-300 text-gray-600 px-3 py-1 rounded text-xs font-bold hover:bg-gray-50 transition-colors">Cancel</button>
                    </td>
                  </tr>
                ))}
                {retries.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-gray-500 text-sm">No pending retries.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
