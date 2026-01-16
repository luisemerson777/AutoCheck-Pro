
import React, { useState, useEffect } from 'react';
import { InspectionData, InspectionStatus } from '../types';
import FormCard from './FormCard';
import RatingSelector from './RatingSelector';

interface Props {
  initialData: InspectionData;
  onSubmit: (data: InspectionData) => void;
}

const InspectionForm: React.FC<Props> = ({ initialData, onSubmit }) => {
  const [data, setData] = useState<InspectionData>(initialData);

  // Atualiza o estado interno se o initialData mudar (importante ao reabrir relatórios)
  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  const handleInputChange = (section: keyof InspectionData, field: string, value: any) => {
    setData(prev => {
      const sectionData = prev[section];
      if (typeof sectionData === 'object' && sectionData !== null && !Array.isArray(sectionData)) {
        return {
          ...prev,
          [section]: {
            ...sectionData,
            [field]: value
          }
        };
      }
      return { ...prev, [section]: value };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Preserva o ID e Data se já existirem (edição), senão cria novos
    const finalData: InspectionData = {
      ...data,
      id: data.id || `insp-${Date.now()}`,
      date: data.date || new Date().toISOString()
    };
    onSubmit(finalData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Dados do Cliente */}
      <FormCard title="Dados do Cliente" icon="fa-user-tie">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Nome Completo *</label>
            <input 
              required
              className="w-full px-5 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-[#1D63BD] outline-none transition-all placeholder:text-slate-300 font-semibold text-slate-900"
              placeholder="Ex: João da Silva"
              value={data.client.name}
              onChange={(e) => handleInputChange('client', 'name', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">WhatsApp / Telefone *</label>
            <input 
              required
              className="w-full px-5 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-[#1D63BD] outline-none transition-all placeholder:text-slate-300 font-semibold text-slate-900"
              placeholder="11 99999-9999"
              value={data.client.phone}
              onChange={(e) => handleInputChange('client', 'phone', e.target.value)}
            />
          </div>
        </div>
      </FormCard>

      {/* Dados do Veículo */}
      <FormCard title="Dados do Veículo" icon="fa-car-side">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Marca / Modelo / Ano *</label>
            <input 
              required
              className="w-full px-5 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-[#1D63BD] outline-none transition-all placeholder:text-slate-300 font-semibold text-slate-900"
              placeholder="Ex: BMW 320i M Sport 2023"
              value={data.vehicle.brandModel}
              onChange={(e) => handleInputChange('vehicle', 'brandModel', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Placa / KM</label>
            <div className="flex gap-2">
              <input 
                className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-[#1D63BD] outline-none font-mono font-bold uppercase text-slate-900"
                placeholder="ABC-1234"
                value={data.vehicle.plate}
                onChange={(e) => handleInputChange('vehicle', 'plate', e.target.value)}
              />
              <input 
                className="w-full px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-[#1D63BD] outline-none font-bold text-slate-900"
                placeholder="KM"
                value={data.vehicle.mileage}
                onChange={(e) => handleInputChange('vehicle', 'mileage', e.target.value)}
              />
            </div>
          </div>
        </div>
      </FormCard>

      {/* Fluidos */}
      <FormCard title="Verificação de Fluidos" icon="fa-oil-can">
        <div className="grid grid-cols-1 gap-3">
          {[
            { id: 'engineOil', label: 'Óleo do Motor' },
            { id: 'brakeFluid', label: 'Fluido de Freio' },
            { id: 'coolant', label: 'Líquido de Arrefecimento' },
            { id: 'wiperFluid', label: 'Limpador de Para-brisa' },
            { id: 'transmissionFluid', label: 'Fluido de Transmissão' }
          ].map(item => (
            <div key={item.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
              <span className="text-sm font-bold text-slate-700 mb-2 sm:mb-0">{item.label}</span>
              <div className="flex flex-wrap gap-2">
                {[InspectionStatus.OK, InspectionStatus.LOW, InspectionStatus.CHANGE_REQUIRED].map(status => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => handleInputChange('fluids', item.id, status)}
                    className={`px-4 py-2 text-[10px] font-bold rounded-xl border-2 transition-all ${
                      data.fluids[item.id as keyof typeof data.fluids] === status
                        ? 'bg-[#1D63BD] text-white border-[#1D63BD] shadow-md shadow-blue-100 scale-105'
                        : 'bg-white text-slate-400 border-slate-100 hover:border-blue-200'
                    }`}
                  >
                    {status.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </FormCard>

      {/* Elétrico */}
      <FormCard title="Sistema Elétrico" icon="fa-bolt">
        <div className="space-y-6">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <RatingSelector 
              label="Saúde da Bateria (Voltagem/Amperagem)" 
              value={data.electrical.batteryHealth} 
              onChange={(val) => handleInputChange('electrical', 'batteryHealth', val)} 
              labels={['Crítica', '2', '3', '4', '100% OK']}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
             {[
               { id: 'alternator', label: 'Carga do Alternador', icon: 'fa-charging-station' },
               { id: 'belts', label: 'Estado das Correias', icon: 'fa-life-ring' }
             ].map(item => (
               <div key={item.id} className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100 flex flex-col space-y-3">
                 <div className="flex items-center space-x-2">
                   <i className={`fas ${item.icon} text-[#1D63BD] text-xs`}></i>
                   <span className="text-xs font-bold text-slate-500 uppercase">{item.label}</span>
                 </div>
                 <div className="flex gap-2">
                   {[InspectionStatus.OK, InspectionStatus.MINOR_DEFECT, InspectionStatus.MAJOR_DEFECT].map(status => (
                     <button
                       key={status}
                       type="button"
                       onClick={() => handleInputChange('electrical', item.id, status)}
                       className={`flex-1 py-2 text-[9px] font-bold rounded-lg border transition-all ${
                         data.electrical[item.id as keyof typeof data.electrical] === status
                           ? 'bg-[#1D63BD] text-white border-[#1D63BD]'
                           : 'bg-white text-slate-400 border-slate-100'
                       }`}
                     >
                       {status.toUpperCase()}
                     </button>
                   ))}
                 </div>
               </div>
             ))}
          </div>
        </div>
      </FormCard>

      {/* Checkout Final */}
      <FormCard title="Checkout Final" icon="fa-clipboard-check">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { id: 'testDrive', label: 'Test Drive Realizado', icon: 'fa-gauge-high' },
            { id: 'wheelTorque', label: 'Torque de Rodas OK', icon: 'fa-wrench' },
            { id: 'cleaning', label: 'Limpeza Externa/Interna', icon: 'fa-sparkles' },
            { id: 'personalObjects', label: 'Sem Objetos Esquecidos', icon: 'fa-suitcase' }
          ].map(item => (
            <label key={item.id} className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all ${
              data.checkout[item.id as keyof typeof data.checkout] 
                ? 'border-[#1D63BD] bg-blue-50/50' 
                : 'border-slate-100 bg-white hover:border-slate-200'
            }`}>
              <div className="flex items-center space-x-3">
                <i className={`fas ${item.icon} ${data.checkout[item.id as keyof typeof data.checkout] ? 'text-[#1D63BD]' : 'text-slate-300'}`}></i>
                <span className={`text-sm font-bold ${data.checkout[item.id as keyof typeof data.checkout] ? 'text-slate-800' : 'text-slate-400'}`}>{item.label}</span>
              </div>
              <input 
                type="checkbox"
                className="w-5 h-5 accent-[#1D63BD]"
                checked={data.checkout[item.id as keyof typeof data.checkout]}
                onChange={(e) => handleInputChange('checkout', item.id, e.target.checked)}
              />
            </label>
          ))}
        </div>
      </FormCard>

      {/* Comentários */}
      <FormCard title="Resumo do Serviço" icon="fa-file-lines">
        <div className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Peças Utilizadas</label>
            <textarea 
              rows={3}
              className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-[#1D63BD] outline-none font-semibold text-slate-900 placeholder:text-slate-300"
              placeholder="Ex: Óleo 5W30, Filtro, Velas..."
              value={data.partsUsed}
              onChange={(e) => handleInputChange('partsUsed', '', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Notas Adicionais para o Cliente</label>
            <textarea 
              rows={3}
              className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-[#1D63BD] outline-none font-semibold text-slate-900 placeholder:text-slate-300"
              placeholder="Ex: Próxima troca em 10.000km..."
              value={data.observations}
              onChange={(e) => handleInputChange('observations', '', e.target.value)}
            />
          </div>
        </div>
      </FormCard>

      <div className="flex flex-col sm:flex-row gap-4 pt-4">
        <button 
          type="submit"
          className="flex-[2] py-5 bg-[#1D63BD] hover:bg-[#154A8D] text-white font-bold rounded-2xl shadow-xl shadow-blue-200 transition-all transform hover:-translate-y-1 active:scale-95 flex items-center justify-center space-x-3"
        >
          <i className="fas fa-check-double"></i>
          <span className="text-lg">Gerar Certificado de Inspeção</span>
        </button>
      </div>
    </form>
  );
};

export default InspectionForm;
