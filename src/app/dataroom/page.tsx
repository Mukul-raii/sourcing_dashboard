"use client";

import React, { useState, useEffect } from 'react';

export default function DataRoomPage() {
  const [datarooms, setDatarooms] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedFolder, setSelectedFolder] = useState<Record<string, unknown> | null>(null);
  const [files, setFiles] = useState<Record<string, unknown>[]>([]);

  useEffect(() => {
    fetch('/api/dataroom')
      .then(res => res.json())
      .then(data => {
        setDatarooms(data);
        setLoading(false);
      })
      .catch(console.error);
  }, []);

  const handleRowClick = async (folder: Record<string, unknown>) => {
    setSelectedFolder(folder);
    try {
      const res = await fetch(`/api/dataroom/${folder.folder_id}/files`);
      setFiles(await res.json());
    } catch(e) { console.error(e) }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-yellow"></div>
      </div>
    );
  }

  return (
    <div className="h-full flex relative overflow-hidden bg-brand-white">
      <div className="flex-1 p-6 overflow-auto">
        <h2 className="text-2xl font-bold text-brand-navy mb-6">Data Room Tracker</h2>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="py-3 px-4 font-bold text-brand-navy text-sm">Company</th>
                <th className="py-3 px-4 font-bold text-brand-navy text-sm">Files</th>
                <th className="py-3 px-4 font-bold text-brand-navy text-sm">Last File</th>
                <th className="py-3 px-4 font-bold text-brand-navy text-sm">Analyses Run</th>
                <th className="py-3 px-4 font-bold text-brand-navy text-sm">Last Analysis</th>
                <th className="py-3 px-4 font-bold text-brand-navy text-sm">Sheet</th>
              </tr>
            </thead>
            <tbody>
              {datarooms.map((dr: Record<string, unknown>) => {
                const filesLogged = Number(dr.files_logged) || 0;
                const expectedFiles = Number(dr.expected_files) || 1;
                const complete = filesLogged >= expectedFiles;
                return (
                  <tr
                    key={String(dr.folder_id)}
                    className={`border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${selectedFolder?.folder_id === dr.folder_id ? 'bg-yellow-50' : ''}`}
                    onClick={() => handleRowClick(dr)}
                  >
                    <td className="py-3 px-4 font-medium text-brand-navy">{String(dr.company_name)}</td>
                    <td className="py-3 px-4 text-sm">
                      <div className="flex items-center gap-2">
                         <span className="w-12">{filesLogged} / {expectedFiles}</span>
                         <div className="h-2 w-16 bg-gray-200 rounded overflow-hidden">
                            <div className={`h-full ${complete ? 'bg-green-500' : 'bg-brand-amber'}`} style={{ width: `${Math.min(100, (filesLogged/expectedFiles)*100)}%` }}></div>
                         </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-500">{new Date(String(dr.last_file_at)).toLocaleDateString()}</td>
                    <td className="py-3 px-4 text-sm">{String(dr.times_triggered)}</td>
                    <td className="py-3 px-4 text-sm">
                       <span className="block">{new Date(String(dr.last_triggered_at)).toLocaleDateString()}</span>
                       <span className="text-xs text-gray-500 bg-gray-100 px-1 rounded">{String(dr.model_used)}</span>
                    </td>
                    <td className="py-3 px-4 text-sm">
                       <a href={String(dr.analysis_sheet_url)} target="_blank" rel="noreferrer" className="text-brand-yellow hover:text-brand-amber" onClick={e => e.stopPropagation()}>View</a>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Slide-in Panel */}
      <div className={`fixed inset-y-0 right-0 w-[400px] bg-brand-white shadow-2xl z-50 transform transition-transform duration-300 border-l border-gray-200 ${selectedFolder ? 'translate-x-0' : 'translate-x-full'}`}>
        {selectedFolder && (
          <div className="flex flex-col h-full">
            <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-white">
              <h3 className="text-xl font-bold text-brand-black">{String(selectedFolder.company_name)} Files</h3>
              <button onClick={() => setSelectedFolder(null)} className="text-gray-500 hover:text-brand-yellow font-bold text-xl">&times;</button>
            </div>
            <div className="p-6 overflow-y-auto flex-1">
               {files.length === 0 ? (
                 <p className="text-sm text-gray-500">No files logged for this data room.</p>
               ) : (
                 <div className="space-y-4">
                   {files.map((f: Record<string, unknown>, idx) => (
                     <div key={idx} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                       <h4 className="font-bold text-sm text-brand-navy mb-1 break-all">{String(f.file_name)}</h4>
                       <p className="text-xs text-gray-500 mb-1">{String(f.mime_type)}</p>
                       <div className="flex justify-between text-xs text-gray-600 font-medium mt-2 pt-2 border-t border-gray-100">
                         <span>{String(f.size)}</span>
                         <span>{new Date(String(f.created_at)).toLocaleDateString()}</span>
                       </div>
                     </div>
                   ))}
                 </div>
               )}
            </div>
          </div>
        )}
      </div>
      {selectedFolder && (
        <div className="fixed inset-0 bg-black/10 z-40 lg:hidden" onClick={() => setSelectedFolder(null)}></div>
      )}
    </div>
  );
}
