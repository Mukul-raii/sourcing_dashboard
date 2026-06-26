"use client";

import React, { useState, useEffect } from 'react';

interface ErrorEntry {
  id: string;
  error_type: string;
  workflow_name: string;
  count: number;
  last_seen: string;
  resolution_status: string;
}

export default function ErrorCenter() {
  const [errors, setErrors] = useState<ErrorEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    const fetchErrors = async () => {
      try {
        const res = await fetch('/api/errors');
        if (!res.ok) throw new Error('Failed to fetch errors');
        const data = await res.json();
        setErrors(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchErrors();
  }, []);

  const updateResolution = async (id: string, newStatus: string) => {
    setUpdating(id);
    try {
      const res = await fetch('/api/errors', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, resolution_status: newStatus })
      });
      if (res.ok) {
        setErrors(errors.map(e => e.id === id ? { ...e, resolution_status: newStatus } : e));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(null);
    }
  };

  if (loading) {
     return <div className="h-full flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F9A822]"></div></div>;
  }

  const activeErrors = errors.filter(e => e.resolution_status === 'pending' || e.resolution_status === 'investigating');
  const archivedErrors = errors.filter(e => e.resolution_status === 'resolved' || e.resolution_status === 'wontfix');

  const renderTable = (data: ErrorEntry[]) => (
    <table className="min-w-full text-sm text-left">
      <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-200">
        <tr>
          <th className="px-6 py-4">Error Type</th>
          <th className="px-6 py-4">Workflow</th>
          <th className="px-6 py-4 text-center">Count</th>
          <th className="px-6 py-4">Last Seen</th>
          <th className="px-6 py-4">Resolution</th>
          <th className="px-6 py-4 text-right">Action</th>
        </tr>
      </thead>
      <tbody>
        {data.map((err) => (
          <tr key={err.id} className="bg-white border-b border-gray-100 hover:bg-[#F7F6F6]">
            <td className="px-6 py-4 font-bold text-red-600">{err.error_type}</td>
            <td className="px-6 py-4 text-[#1A2340] font-medium">{err.workflow_name}</td>
            <td className="px-6 py-4 text-center font-bold">{err.count}</td>
            <td className="px-6 py-4 text-gray-500 text-xs">{new Date(err.last_seen).toLocaleString()}</td>
            <td className="px-6 py-4">
              <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                err.resolution_status === 'pending' ? 'bg-red-100 text-red-800' :
                err.resolution_status === 'investigating' ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {err.resolution_status}
              </span>
            </td>
            <td className="px-6 py-4 text-right">
              <select
                className="border border-gray-300 rounded px-2 py-1 text-xs bg-white focus:outline-none focus:border-[#F9A822] disabled:opacity-50"
                value={err.resolution_status}
                onChange={(e) => updateResolution(err.id, e.target.value)}
                disabled={updating === err.id}
              >
                <option value="pending">pending</option>
                <option value="investigating">investigating</option>
                <option value="resolved">resolved</option>
                <option value="wontfix">wontfix</option>
              </select>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <div className="flex flex-col h-full gap-8 overflow-auto pb-6">
      <div>
        <h3 className="font-bold text-lg text-[#1A2340] mb-4">Active Errors</h3>
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          {activeErrors.length > 0 ? renderTable(activeErrors) : <div className="p-6 text-center text-gray-500">No active errors.</div>}
        </div>
      </div>

      <div>
        <h3 className="font-bold text-lg text-gray-600 mb-4">Archived Errors</h3>
        <div className="border border-gray-200 rounded-lg overflow-hidden opacity-80">
           {archivedErrors.length > 0 ? renderTable(archivedErrors) : <div className="p-6 text-center text-gray-500">No archived errors.</div>}
        </div>
      </div>
    </div>
  );
}
