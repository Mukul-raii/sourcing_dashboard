"use client";

import React, { useState, useEffect } from 'react';

interface RetryEntry {
  id: string;
  log_id: string;
  workflow_name: string;
  deal_id: string | null;
  retry_count: number;
  max_retries: number;
  scheduled_for: string;
  retry_status: string;
  error_message: string;
}

export default function RetryQueue() {
  const [retries, setRetries] = useState<RetryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRetries = async () => {
      try {
        const res = await fetch('/api/retries/pending');
        if (!res.ok) throw new Error('Failed to fetch retries');
        const data = await res.json();
        // Sort most overdue first
        setRetries(data.sort((a: RetryEntry, b: RetryEntry) => new Date(a.scheduled_for).getTime() - new Date(b.scheduled_for).getTime()));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRetries();
  }, []);

  const handleAction = (id: string, _action: 'run' | 'cancel') => {
     // Mock optimistic update
     setRetries(retries.filter(r => r.id !== id));
  };

  if (loading) {
     return <div className="h-full flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F9A822]"></div></div>;
  }

  if (retries.length === 0) {
      return (
          <div className="h-full flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg text-gray-500">
             No pending retries.
          </div>
      )
  }

  return (
    <div className="overflow-auto h-full border border-gray-200 rounded-lg">
      <table className="min-w-full text-sm text-left">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-200 sticky top-0">
          <tr>
            <th className="px-6 py-4">Workflow</th>
            <th className="px-6 py-4">Deal ID</th>
            <th className="px-6 py-4 text-center">Attempt</th>
            <th className="px-6 py-4">Scheduled For</th>
            <th className="px-6 py-4">Error Context</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {retries.map((rt) => {
            const isOverdue = new Date(rt.scheduled_for).getTime() < new Date().getTime();
            return (
              <tr key={rt.id} className="bg-white border-b border-gray-100 hover:bg-[#F7F6F6]">
                <td className="px-6 py-4 font-bold text-[#1A2340]">
                    {rt.workflow_name}
                    <span className="block text-xs font-normal text-gray-400">Log: {rt.log_id}</span>
                </td>
                <td className="px-6 py-4 text-gray-500">
                    {rt.deal_id ? <span className="underline cursor-pointer hover:text-[#F9A822]">{rt.deal_id}</span> : '-'}
                </td>
                <td className="px-6 py-4 text-center">
                    <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs font-bold">
                        {rt.retry_count} / {rt.max_retries}
                    </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`font-medium ${isOverdue ? 'text-[#F9A822]' : 'text-gray-600'}`}>
                    {new Date(rt.scheduled_for).toLocaleString()}
                  </span>
                  {isOverdue && <span className="ml-2 text-xs text-[#F9A822] font-bold uppercase tracking-wider">Overdue</span>}
                </td>
                <td className="px-6 py-4">
                    <p className="text-xs text-red-600 truncate max-w-[200px]" title={rt.error_message}>
                        {rt.error_message}
                    </p>
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                   <button
                      onClick={() => handleAction(rt.id, 'cancel')}
                      className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded text-xs font-medium hover:bg-gray-200 transition-colors"
                   >
                       Cancel
                   </button>
                   <button
                      onClick={() => handleAction(rt.id, 'run')}
                      className="px-3 py-1.5 bg-[#1A2340] text-[#F7F6F6] rounded text-xs font-bold hover:bg-opacity-90 transition-colors"
                   >
                       Run Now
                   </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
