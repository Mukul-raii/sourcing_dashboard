"use client";

import React from 'react';
import { Deal } from '../app/api/deals/route';

const STAGES = [
  'Sourced',
  'C1 Screening',
  'C1 Call',
  'Stage 2',
  'Stage 2 Call',
  'Stage 3',
  'Portfolio',
  'Passed'
];

interface KanbanBoardProps {
  deals: Deal[];
  onDealClick: (deal: Deal) => void;
}

export default function KanbanBoard({ deals, onDealClick }: KanbanBoardProps) {
  const getDealsByStage = (stage: string) => deals.filter(d => d.stage === stage);

  return (
    <div className="flex h-full gap-4 overflow-x-auto pb-4">
      {STAGES.map(stage => {
        const stageDeals = getDealsByStage(stage);

        return (
          <div key={stage} className="flex-shrink-0 w-80 flex flex-col bg-gray-100 rounded-md p-3">
            <div className="flex justify-between items-center mb-4 px-1">
              <h3 className="font-bold text-sm text-[#1A2340] uppercase tracking-wide">{stage}</h3>
              <span className="text-xs bg-gray-300 px-2 py-0.5 rounded-full font-medium">{stageDeals.length}</span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {stageDeals.map(deal => (
                <div
                  key={deal.id}
                  onClick={() => onDealClick(deal)}
                  className="bg-white p-4 rounded shadow-sm cursor-pointer hover:shadow-md hover:border-[#F9A822] border border-transparent transition-all"
                >
                  <h4 className="font-bold text-[#1A2340] mb-1">{deal.company_name}</h4>
                  <p className="text-xs text-gray-500 mb-3">{deal.founder_name} &middot; {deal.email}</p>

                  <div className="flex justify-between items-center">
                    <span className={`text-xs font-bold px-2 py-1 rounded ${
                      deal.overall_score >= 7 ? 'bg-green-100 text-green-800' :
                      deal.overall_score >= 5 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {deal.overall_score.toFixed(1)}
                    </span>
                    <span className="text-xs font-medium px-2 py-1 bg-gray-100 rounded-full">
                      {deal.verdict_recommendation}
                    </span>

                    <div className="flex items-center gap-1" title={`Data Room: ${deal.dataroom_status}`}>
                      <div className={`w-2.5 h-2.5 rounded-full ${
                        deal.dataroom_status === 'complete' ? 'bg-green-500' :
                        deal.dataroom_status === 'partial' ? 'bg-yellow-500' :
                        'bg-gray-300'
                      }`} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
