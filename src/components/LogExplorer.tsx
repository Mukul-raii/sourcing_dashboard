"use client";

import React, { useState, useEffect } from 'react';
import { LogEntry } from '../app/api/logs/route';

export default function LogExplorer() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  // Filters
  const [statusFilter, setStatusFilter] = useState('');
  const [workflowFilter, setWorkflowFilter] = useState('');

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (statusFilter) params.append('status', statusFilter);
        if (workflowFilter) params.append('workflow', workflowFilter);

        const res = await fetch(`/api/logs?${params.toString()}`);
        if (!res.ok) throw new Error('Failed to fetch logs');
        const data = await res.json();
        setLogs(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, [statusFilter, workflowFilter]);

  const toggleRow = (id: string) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  return (
    <div className="flex flex-col h-full gap-4">
      {/* Filter Bar */}
      <div className="flex gap-4">
        <select
          className="border border-gray-300 rounded px-3 py-1.5 text-sm"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="success">Success</option>
          <option value="failed">Failed</option>
          <option value="running">Running</option>
          <option value="retrying">Retrying</option>
          <option value="cancelled">Cancelled</option>
        </select>

        <select
          className="border border-gray-300 rounded px-3 py-1.5 text-sm"
          value={workflowFilter}
          onChange={(e) => setWorkflowFilter(e.target.value)}
        >
          <option value="">All Workflows</option>
          <option value="data_room_analysis">data_room_analysis</option>
          <option value="notion_stage_router">notion_stage_router</option>
          <option value="dealnote_update_subworkflow">dealnote_update_subworkflow</option>
        </select>
      </div>

      {/* Log Table */}
      <div className="flex-1 overflow-auto border border-gray-200 rounded-lg">
        {loading ? (
           <div className="h-full flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F9A822]"></div></div>
        ) : (
          <table className="min-w-full text-sm text-left">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-200 sticky top-0">
              <tr>
                <th className="px-6 py-4">Time</th>
                <th className="px-6 py-4">Workflow</th>
                <th className="px-6 py-4">Source</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Duration</th>
                <th className="px-6 py-4">Deal ID</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <React.Fragment key={log.id}>
                  <tr
                    className={`border-b border-gray-100 hover:bg-[#F7F6F6] cursor-pointer ${expandedRow === log.id ? 'bg-[#F7F6F6]' : 'bg-white'}`}
                    onClick={() => toggleRow(log.id)}
                  >
                    <td className="px-6 py-4 text-xs text-gray-500 whitespace-nowrap">{new Date(log.trigger_timestamp).toLocaleString()}</td>
                    <td className="px-6 py-4 font-bold text-[#1A2340]">{log.workflow_name}</td>
                    <td className="px-6 py-4 text-gray-500">{log.source}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        log.status === 'success' ? 'bg-green-100 text-green-800' :
                        log.status === 'failed' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {log.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500">{log.duration_ms} ms</td>
                    <td className="px-6 py-4 text-gray-500">{log.deal_id || '-'}</td>
                  </tr>
                  {/* Expanded Detail Row */}
                  {expandedRow === log.id && (
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <td colSpan={6} className="px-6 py-4">
                        <div className="grid grid-cols-2 gap-6">
                          <div>
                            <h4 className="font-bold text-sm mb-2 text-[#1A2340]">Input Payload</h4>
                            <pre className="bg-[#1A2340] text-[#F7F6F6] p-4 rounded text-xs overflow-x-auto">
                              {JSON.stringify(log.input_payload, null, 2)}
                            </pre>
                          </div>
                          <div>
                            <h4 className="font-bold text-sm mb-2 text-[#1A2340]">Output Payload</h4>
                            <pre className="bg-[#1A2340] text-[#F7F6F6] p-4 rounded text-xs overflow-x-auto">
                              {JSON.stringify(log.output_payload, null, 2)}
                            </pre>
                          </div>
                        </div>
                        {log.error_message && (
                          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded">
                            <h4 className="font-bold text-sm text-red-800 mb-1">Error Message</h4>
                            <p className="text-sm text-red-600">{log.error_message}</p>
                          </div>
                        )}
                        <div className="mt-4 flex gap-3">
                           {log.deal_id && <button className="px-3 py-1.5 bg-gray-200 text-gray-800 rounded text-sm hover:bg-gray-300">View Deal</button>}
                           {log.status === 'failed' && <button className="px-3 py-1.5 bg-[#F9A822] text-[#1A2340] font-bold rounded text-sm hover:bg-[#F5A623]">Retry</button>}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
