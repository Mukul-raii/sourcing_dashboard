"use client";

import React, { useState, useEffect } from 'react';
import KanbanBoard from '@/components/KanbanBoard';
import PipelineTable from '@/components/PipelineTable';
import DealDetailPanel from '@/components/DealDetailPanel';
import { Deal } from './api/deals/route';

export default function Home() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStage, setSelectedStage] = useState('');

  useEffect(() => {
    const fetchDeals = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (searchQuery) queryParams.append('search', searchQuery);
        if (selectedStage) queryParams.append('stage', selectedStage);

        const res = await fetch(`/api/deals?${queryParams.toString()}`);
        if (!res.ok) throw new Error('Failed to fetch deals');
        const data = await res.json();
        setDeals(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDeals();
  }, [searchQuery, selectedStage]);

  return (
    <div className="h-full flex flex-col relative overflow-hidden">
      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <input
            type="text"
            placeholder="Search company or founder..."
            className="border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-brand-yellow w-full md:w-64"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <select
            className="border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-brand-yellow bg-white"
            value={selectedStage}
            onChange={(e) => setSelectedStage(e.target.value)}
          >
            <option value="">All Stages</option>
            <option value="Sourced">Sourced</option>
            <option value="C1 Screening">C1 Screening</option>
            <option value="C1 Call">C1 Call</option>
            <option value="Stage 2">Stage 2</option>
            <option value="Stage 2 Call">Stage 2 Call</option>
            <option value="Stage 3">Stage 3</option>
            <option value="Portfolio">Portfolio</option>
            <option value="Passed">Passed</option>
          </select>
        </div>

        <div className="flex bg-gray-100 p-1 rounded-lg">
          <button
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${viewMode === 'kanban' ? 'bg-white shadow text-brand-navy' : 'text-gray-500 hover:text-brand-navy'}`}
            onClick={() => setViewMode('kanban')}
          >
            Kanban
          </button>
          <button
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${viewMode === 'table' ? 'bg-white shadow text-brand-navy' : 'text-gray-500 hover:text-brand-navy'}`}
            onClick={() => setViewMode('table')}
          >
            Table
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden min-h-0 relative">
        {loading ? (
          <div className="h-full flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-yellow"></div>
          </div>
        ) : (
          viewMode === 'kanban' ? (
            <KanbanBoard deals={deals} onDealClick={setSelectedDeal} />
          ) : (
            <PipelineTable deals={deals} onDealClick={setSelectedDeal} />
          )
        )}
      </div>

      {/* Slide-in Panel */}
      {selectedDeal && (
        <>
          <div
            className="fixed inset-0 bg-black/20 z-40 transition-opacity"
            onClick={() => setSelectedDeal(null)}
          />
          <DealDetailPanel deal={selectedDeal} onClose={() => setSelectedDeal(null)} />
        </>
      )}
    </div>
  );
}
