"use client";

import React, { useState, useEffect } from 'react';

interface Stats {
  runs_24h: number;
  success_rate_pct: number;
  active_failures: number;
  pending_retries: number;
}

export default function SummaryStats() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/stats/overview');
        if (!res.ok) throw new Error('Failed to fetch stats');
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
    // Poll every 30s as per requirements
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading || !stats) {
    return <div className="h-24 bg-white rounded-lg shadow-sm animate-pulse"></div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 flex flex-col justify-center">
        <p className="text-sm text-gray-500 font-medium uppercase tracking-wide">Runs (24h)</p>
        <p className="text-3xl font-bold text-[#1A2340] mt-1">{stats.runs_24h.toLocaleString()}</p>
      </div>

      <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 flex flex-col justify-center">
        <p className="text-sm text-gray-500 font-medium uppercase tracking-wide">Success Rate</p>
        <p className={`text-3xl font-bold mt-1 ${stats.success_rate_pct >= 95 ? 'text-green-600' : stats.success_rate_pct >= 80 ? 'text-yellow-600' : 'text-red-600'}`}>
          {stats.success_rate_pct.toFixed(1)}%
        </p>
      </div>

      <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 flex flex-col justify-center">
        <p className="text-sm text-gray-500 font-medium uppercase tracking-wide">Active Failures</p>
        <p className={`text-3xl font-bold mt-1 ${stats.active_failures > 0 ? 'text-red-600' : 'text-green-600'}`}>
          {stats.active_failures}
        </p>
      </div>

      <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 flex flex-col justify-center">
        <p className="text-sm text-gray-500 font-medium uppercase tracking-wide">Pending Retries</p>
        <p className={`text-3xl font-bold mt-1 ${stats.pending_retries > 0 ? 'text-yellow-600' : 'text-gray-900'}`}>
          {stats.pending_retries}
        </p>
      </div>
    </div>
  );
}
