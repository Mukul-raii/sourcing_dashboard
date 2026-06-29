import React, { useState, useEffect } from 'react';
import { Deal, StageHistoryEvent, InteractionEvent, DealNote } from '@/lib/mockData';

interface DealDetailPanelProps {
  deal: Deal | null;
  onClose: () => void;
}

type TabType = 'Overview' | 'Stage History' | 'Interactions' | 'Deal Notes' | 'Automation';

export default function DealDetailPanel({ deal, onClose }: DealDetailPanelProps) {
  const [activeTab, setActiveTab] = useState<TabType>('Overview');

  const [stageHistory, setStageHistory] = useState<StageHistoryEvent[]>([]);
  const [interactions, setInteractions] = useState<InteractionEvent[]>([]);
  const [dealNotes, setDealNotes] = useState<DealNote[]>([]);
  const [logs, setLogs] = useState<Record<string, unknown>[]>([]);
  const [dataroom, setDataroom] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    if (deal?.id) {
      // Fetch details based on tab or fetch all initially
      Promise.all([
        fetch(`/api/deals/${deal.id}/stage-history`).then(res => res.json()),
        fetch(`/api/deals/${deal.id}/interactions`).then(res => res.json()),
        fetch(`/api/deals/${deal.id}/notes`).then(res => res.json()),
        fetch(`/api/deals/${deal.id}/logs`).then(res => res.json()),
        fetch(`/api/deals/${deal.id}/dataroom`).then(res => res.json())
      ]).then(([h, i, n, l, d]) => {
        setStageHistory(h);
        setInteractions(i);
        setDealNotes(n);
        setLogs(l);
        setDataroom(d);
      }).catch(console.error);
    }
  }, [deal?.id]);

  if (!deal) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-[560px] bg-brand-white shadow-2xl z-50 flex flex-col transform transition-transform duration-300">
      <div className="flex justify-between items-center p-6 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-brand-black">{deal.company_name}</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-brand-yellow font-bold text-xl">
          &times;
        </button>
      </div>

      <div className="p-6 overflow-y-auto flex-1 text-brand-black">
        <div className="mb-6 flex gap-2 flex-wrap">
          <span className="bg-brand-navy text-brand-white px-3 py-1 rounded-full text-sm font-medium">
            {deal.stage}
          </span>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            deal.overall_score >= 7 ? 'bg-green-100 text-green-800' :
            deal.overall_score >= 5 ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
            Score: {deal.overall_score}
          </span>
          <span className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
            {deal.verdict_recommendation}
          </span>
        </div>

        <div className="flex border-b border-gray-200 mb-6 overflow-x-auto hide-scrollbar">
          {(['Overview', 'Stage History', 'Interactions', 'Deal Notes', 'Automation'] as TabType[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`whitespace-nowrap py-2 px-4 text-sm font-bold border-b-2 transition-colors ${
                activeTab === tab
                  ? 'border-brand-yellow text-brand-navy'
                  : 'border-transparent text-gray-500 hover:text-brand-navy'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="space-y-6">
          {activeTab === 'Overview' && (
            <section>
              <h3 className="text-lg font-bold text-brand-navy mb-4">Overview</h3>
              <p className="text-sm mb-2"><span className="font-semibold">Founder:</span> {deal.founder_name} ({deal.email})</p>
              <p className="text-sm mb-2"><span className="font-semibold">Data Room Status:</span> {deal.dataroom_status}</p>
              <p className="text-sm mb-2"><span className="font-semibold">Expected Files:</span> {deal.expected_files}</p>
              <p className="text-sm mb-2"><span className="font-semibold">Files Logged:</span> {deal.files_logged}</p>
            </section>
          )}

          {activeTab === 'Stage History' && (
            <section>
              <h3 className="text-lg font-bold text-brand-navy mb-4">Stage History</h3>
              {stageHistory.length === 0 ? (
                <p className="text-sm text-gray-500">No stage history found.</p>
              ) : (
                <div className="border-l-2 border-brand-yellow pl-4 py-2 space-y-4">
                  {stageHistory.map((sh: StageHistoryEvent, idx) => (
                    <div key={idx}>
                      <p className="text-xs text-gray-500">{new Date(sh.timestamp).toLocaleString()}</p>
                      <p className="text-sm font-medium">Moved from <span className="font-bold">{sh.from}</span> to <span className="font-bold">{sh.to}</span></p>
                      <p className="text-xs text-gray-500">By {sh.changed_by} {sh.reason ? `- ${sh.reason}` : ''}</p>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          {activeTab === 'Interactions' && (
            <section>
              <h3 className="text-lg font-bold text-brand-navy mb-4">Interactions</h3>
              {interactions.length === 0 ? (
                <p className="text-sm text-gray-500">No interactions found.</p>
              ) : (
                <div className="space-y-4">
                  {interactions.map((i: InteractionEvent, idx) => (
                    <div key={idx} className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                      <div className="flex justify-between items-start mb-2">
                         <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs font-bold">{i.type}</span>
                         <span className="text-xs text-gray-500">{new Date(i.date).toLocaleDateString()}</span>
                      </div>
                      <p className="text-sm">Q&A Answered: {i.q_and_a_answered}</p>
                      <a href={i.doc_link} className="text-brand-amber text-sm hover:underline mt-2 inline-block">View Document</a>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          {activeTab === 'Deal Notes' && (
            <section>
              <h3 className="text-lg font-bold text-brand-navy mb-4">Deal Notes Versions</h3>
              {dealNotes.length === 0 ? (
                <p className="text-sm text-gray-500">No deal notes found.</p>
              ) : (
                <div className="space-y-4">
                  {dealNotes.map((n: DealNote, idx) => (
                    <div key={idx} className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                      <h4 className="font-bold text-sm mb-1">{n.version}</h4>
                      <p className="text-sm text-gray-700 mb-2">{n.content}</p>
                      <div className="flex gap-4 text-xs text-gray-500">
                        <span>Model: {n.model_used}</span>
                        <span>Words: {n.word_count}</span>
                      </div>
                      <a href={n.doc_link} className="text-brand-amber text-sm hover:underline mt-2 inline-block">View Google Doc</a>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          {activeTab === 'Automation' && (
            <section>
              <h3 className="text-lg font-bold text-brand-navy mb-4">Automation & Logs</h3>
              <div className="mb-6 p-4 border rounded-lg bg-gray-50">
                <h4 className="font-bold text-sm mb-2">Data Room Status</h4>
                {dataroom ? (
                  <>
                    <p className="text-sm">Files: {String(dataroom.files_logged)} / {String(dataroom.expected_files)}</p>
                    <p className="text-sm">Last Analysis: {new Date(String(dataroom.last_triggered_at)).toLocaleString()}</p>
                    <p className="text-sm">Model: {String(dataroom.model_used)}</p>
                  </>
                ) : (
                  <p className="text-sm text-gray-500">No data room linked.</p>
                )}
              </div>

              <h4 className="font-bold text-sm mb-2">Workflow Logs</h4>
              {logs.length === 0 ? (
                <p className="text-sm text-gray-500">No logs found.</p>
              ) : (
                <div className="space-y-2">
                  {logs.map((log: Record<string, unknown>) => (
                    <div key={String(log.id)} className="p-3 border rounded text-sm bg-white">
                      <div className="flex justify-between mb-1">
                        <span className="font-bold">{String(log.workflow_name)}</span>
                        <span className={`px-2 py-0.5 rounded text-xs font-bold ${log.status === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {String(log.status)}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">{new Date(String(log.trigger_timestamp)).toLocaleString()} ({String(log.duration_ms)}ms)</p>
                      {log.error_message ? <p className="text-xs text-red-600 mt-1">{String(log.error_message)}</p> : null}
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
