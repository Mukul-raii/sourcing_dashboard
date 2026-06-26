"use client";

import React, { useState, useMemo } from 'react';
import { Deal } from '../app/api/deals/route';

interface PipelineTableProps {
  deals: Deal[];
  onDealClick: (deal: Deal) => void;
}

type SortField = keyof Deal | null;

export default function PipelineTable({ deals, onDealClick }: PipelineTableProps) {
  const [sortField, setSortField] = useState<SortField>('last_stage_change');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const handleSort = (field: keyof Deal) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedDeals = useMemo(() => {
    if (!sortField) return deals;

    return [...deals].sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];

      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [deals, sortField, sortDirection]);

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden h-full flex flex-col">
      <div className="overflow-x-auto flex-1">
        <table className="min-w-full text-sm text-left">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
            <tr>
              <th scope="col" className="px-6 py-3 cursor-pointer hover:bg-gray-100" onClick={() => handleSort('company_name')}>
                Company {sortField === 'company_name' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th scope="col" className="px-6 py-3 cursor-pointer hover:bg-gray-100" onClick={() => handleSort('stage')}>
                Stage {sortField === 'stage' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th scope="col" className="px-6 py-3">
                Founder
              </th>
              <th scope="col" className="px-6 py-3 cursor-pointer hover:bg-gray-100" onClick={() => handleSort('overall_score')}>
                Score {sortField === 'overall_score' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th scope="col" className="px-6 py-3 cursor-pointer hover:bg-gray-100" onClick={() => handleSort('verdict_recommendation')}>
                Verdict {sortField === 'verdict_recommendation' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                Data Room
              </th>
              <th scope="col" className="px-6 py-3 text-center cursor-pointer hover:bg-gray-100" onClick={() => handleSort('last_stage_change')}>
                Last Change {sortField === 'last_stage_change' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedDeals.map((deal) => (
              <tr
                key={deal.id}
                className="bg-white border-b hover:bg-[#F7F6F6] cursor-pointer transition-colors"
                onClick={() => onDealClick(deal)}
              >
                <td className="px-6 py-4 font-bold text-[#1A2340]">
                  {deal.company_name}
                </td>
                <td className="px-6 py-4">
                  <span className="bg-[#1A2340] text-white px-2.5 py-1 rounded-full text-xs whitespace-nowrap">
                    {deal.stage}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {deal.founder_name}
                </td>
                <td className="px-6 py-4">
                  <span className={`font-bold ${
                    deal.overall_score >= 7 ? 'text-green-600' :
                    deal.overall_score >= 5 ? 'text-yellow-600' :
                    'text-red-600'
                  }`}>
                    {deal.overall_score.toFixed(1)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap">
                    {deal.verdict_recommendation}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col items-center">
                    <span className="text-xs text-gray-500 mb-1">{deal.files_logged} / {deal.expected_files}</span>
                    <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${deal.dataroom_status === 'complete' ? 'bg-green-500' : deal.dataroom_status === 'partial' ? 'bg-yellow-500' : 'bg-transparent'}`}
                        style={{ width: `${deal.expected_files ? (deal.files_logged / deal.expected_files) * 100 : 0}%` }}
                      ></div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-center text-gray-500 text-xs">
                  {new Date(deal.last_stage_change).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
