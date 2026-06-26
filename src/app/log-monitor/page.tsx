"use client";

import React, { useState } from 'react';
import SummaryStats from '@/components/SummaryStats';
import WorkflowHealthGrid from '@/components/WorkflowHealthGrid';
import LogExplorer from '@/components/LogExplorer';
import ErrorCenter from '@/components/ErrorCenter';
import RetryQueue from '@/components/RetryQueue';

type Tab = 'workflows' | 'logs' | 'errors' | 'retries';

export default function LogMonitorPage() {
  const [activeTab, setActiveTab] = useState<Tab>('workflows');

  return (
    <div className="h-full flex flex-col relative overflow-hidden space-y-6">
      {/* KPI Stats (Always Visible) */}
      <SummaryStats />

      {/* Main Content Area */}
      <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-100 flex flex-col overflow-hidden">
        {/* Horizontal Tab Bar */}
        <div className="border-b border-gray-200 px-6 py-2 flex gap-6 bg-gray-50">
          <button
            className={`py-3 font-medium text-sm border-b-2 ${activeTab === 'workflows' ? 'border-[#F9A822] text-[#1A2340]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('workflows')}
          >
            Workflow Health
          </button>
          <button
            className={`py-3 font-medium text-sm border-b-2 ${activeTab === 'logs' ? 'border-[#F9A822] text-[#1A2340]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('logs')}
          >
            Log Explorer
          </button>
          <button
            className={`py-3 font-medium text-sm border-b-2 ${activeTab === 'errors' ? 'border-[#F9A822] text-[#1A2340]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('errors')}
          >
            Error Center
          </button>
          <button
            className={`py-3 font-medium text-sm border-b-2 ${activeTab === 'retries' ? 'border-[#F9A822] text-[#1A2340]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('retries')}
          >
            Retry Queue
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-hidden p-6 relative">
          {activeTab === 'workflows' && <WorkflowHealthGrid />}
          {activeTab === 'logs' && <LogExplorer />}
          {activeTab === 'errors' && <ErrorCenter />}
          {activeTab === 'retries' && <RetryQueue />}
        </div>
      </div>
    </div>
  );
}
