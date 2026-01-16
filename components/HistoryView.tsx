
import React, { useState } from 'react';
import { InspectionData } from '../types';

interface Props {
  history: InspectionData[];
  onDelete: (id: string) => void;
  onViewReport: (data: InspectionData) => void;
}

const HistoryView: React.FC<Props> = ({ history, onDelete, onViewReport }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = history.filter(item => 
    item.client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.vehicle.plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.vehicle.brandModel.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleToggleExpand = (id: string) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  return (
    <div className="space-y-6">
      <div className="relative">
        <i className="fas fa-search absolute left-5 top-1/2 -translate-y-1/2 text-slate-300"></i>
        <input 
          type="text"
          placeholder="Buscar por cliente, placa ou modelo..."
          className="w-full pl-12 pr-6 py-4 bg-white border border-slate-100 rounded-2xl shadow-sm focus:ring-2 focus:ring-[#1D63BD] outline-none font-medium text-slate-900"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-[2.5rem] border border-dashed border-slate-200">
          <i className="fas fa-folder-open text-4xl text-slate-200 mb-4"></i>
          <p className="text-slate-400 font-medium">Nenhum registro encontrado.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((item) => (
            <div 
              key={item.id}
              className={`bg-white border transition-all duration-300 overflow-hidden ${
                expandedId === item.id 
                  ? 'rounded-[2rem] border-blue-200 shadow-xl shadow-blue-50' 
                  : 'rounded-2xl border-slate-100 hover:border-blue-100 shadow-sm'
              }`}
            >
              {/* Header do Card */}
              <div 
                className="p-5 flex items-center justify-between cursor-pointer select-none"
                onClick={() => handleToggleExpand(item.id)}
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${expandedId === item.id ? 'bg-[#1D63BD] text-white' : 'bg-blue-50 text-[#1D63BD]'}`}>
                    <i className="fas fa-car"></i>
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-slate-800 truncate">{item.client.name}</h4>
                    <p className="text-xs text-slate-400 font-medium truncate">{item.vehicle.brandModel} • <span className="font-mono uppercase">{item.vehicle.plate || "S/P"}</span></p>
                  </div>
                </div>
                
                <div className="flex flex-col items-end space-y-1 shrink-0 ml-4">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">
                    {new Date(item.date).toLocaleDateString('pt-BR')}
                  </span>
                  <i className={`fas fa-chevron-down text-slate-300 transition-transform ${expandedId === item.id ? 'rotate-180 text-[#1D63BD]' : ''}`}></i>
                </div>
              </div>

              {/* Conteúdo Expandido */}
              {expandedId === item.id && (
                <div className="px-5 pb-5 pt-2 border-t border-slate-50 animate-in slide-in-from-top-2 duration-300">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6 pt-4">
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">Status Pneus</p>
                      <p className="text-xs font-bold text-slate-700">{item.tires.grooves}</p>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">Bateria</p>
                      <p className="text-xs font-bold text-slate-700">{item.electrical.batteryHealth}/5</p>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">Óleo Motor</p>
                      <p className="text-xs font-bold text-slate-700">{item.fluids.engineOil}</p>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">Placa</p>
                      <p className="text-xs font-bold text-slate-700">{item.vehicle.plate || "S/P"}</p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <button 
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onViewReport(item);
                      }}
                      className="flex-[2] py-3.5 bg-[#1D63BD] text-white text-xs font-bold rounded-xl hover:bg-[#154A8D] transition-all flex items-center justify-center space-x-2 shadow-lg shadow-blue-100"
                    >
                      <i className="fas fa-file-invoice"></i>
                      <span>Ver Relatório Completo</span>
                    </button>
                    <button 
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(item.id);
                      }}
                      className="flex-1 py-3.5 bg-red-50 text-red-500 text-xs font-bold rounded-xl hover:bg-red-500 hover:text-white transition-all flex items-center justify-center space-x-2 border border-red-100"
                    >
                      <i className="fas fa-trash-alt"></i>
                      <span>Excluir</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoryView;
