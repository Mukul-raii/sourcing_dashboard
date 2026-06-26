import React from 'react';
import { Deal } from '../app/api/deals/route';

interface DealDetailPanelProps {
  deal: Deal | null;
  onClose: () => void;
}

export default function DealDetailPanel({ deal, onClose }: DealDetailPanelProps) {
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

        <div className="space-y-6">
          <section>
            <h3 className="text-lg font-bold text-brand-navy mb-2">Overview</h3>
            <p className="text-sm"><span className="font-semibold">Founder:</span> {deal.founder_name} ({deal.email})</p>
            <p className="text-sm"><span className="font-semibold">Data Room Status:</span> {deal.dataroom_status}</p>
          </section>

          <section>
            <h3 className="text-lg font-bold text-brand-navy mb-2">Stage History (Mocked)</h3>
            <div className="border-l-2 border-brand-yellow pl-4 py-2 space-y-4">
               <div>
                  <p className="text-sm text-gray-500">{new Date(deal.last_stage_change).toLocaleDateString()}</p>
                  <p className="text-sm font-medium">Moved to {deal.stage}</p>
               </div>
               <div>
                  <p className="text-sm text-gray-500">Earlier...</p>
                  <p className="text-sm font-medium">Previous stages</p>
               </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
