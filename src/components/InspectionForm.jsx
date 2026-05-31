import React, { useState, useEffect } from 'react';
import { INITIAL_FORM_STATE } from '../constants';

const OPTIONS_STATUS = ['OK', 'Atenção', 'Urgente'];
const OPTIONS_YES_NO = ['Sim', 'Não'];
const OPTIONS_SCAN = ['Realizado', 'Pendente', 'N/A'];
const OPTIONS_TIRE = ['Bom', 'Aceitável', 'Substituir'];

const InspectionForm = ({ initialData = INITIAL_FORM_STATE, onSubmit }) => {
  const [data, setData] = useState({ ...INITIAL_FORM_STATE, ...initialData });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => setData(prev => ({ ...prev, ...initialData })), [initialData]);

  const handleChange = (path, value) => {
    const parts = path.split('.');
    setData(prev => {
      const next = { ...prev };
      let cur = next;
      for (let i = 0; i < parts.length - 1; i++) {
        const p = parts[i];
        cur[p] = { ...(cur[p] || {}) };
        cur = cur[p];
      }
      cur[parts[parts.length - 1]] = value;
      return next;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!data.client?.name || !data.vehicle?.brandModel || !data.vehicle?.plate) {
      alert('Preencha os campos obrigatórios: Nome, Veículo e Placa');
      return;
    }

    try {
      setIsLoading(true);
      const payload = {
        ...data,
        id: data.id || Date.now(),
        date: data.date || new Date().toISOString(),
      };
      if (onSubmit) await onSubmit(payload);
    } catch (err) {
      console.error('❌ Erro ao submeter formulário:', err);
      alert('Erro ao salvar inspeção. Verifique sua conexão.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderSelect = (label, path, options) => (
    <label className="block">
      <span className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-200">{label}</span>
      <select
        className="w-full p-3 rounded-xl border bg-white dark:bg-slate-900"
        value={path.split('.').reduce((obj, key) => obj?.[key], data) ?? ''}
        onChange={(e) => handleChange(path, e.target.value)}
        disabled={isLoading}
      >
        {options.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </label>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-[2rem] bg-white dark:bg-slate-900 p-6 shadow-xl border border-slate-100 dark:border-slate-800">
        <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-4">Checklist de Inspeção Veicular</h2>

        <section className="mb-6">
          <h3 className="text-lg font-bold mb-4">1. Dados do Cliente</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <input
              className="w-full p-3 rounded-xl border bg-white dark:bg-slate-900"
              placeholder="Nome Completo *"
              value={data.client?.name || ''}
              onChange={(e) => handleChange('client.name', e.target.value)}
              disabled={isLoading}
              required
            />
            <input
              className="w-full p-3 rounded-xl border bg-white dark:bg-slate-900"
              placeholder="WhatsApp / Telefone"
              value={data.client?.phone || ''}
              onChange={(e) => handleChange('client.phone', e.target.value)}
              disabled={isLoading}
            />
          </div>
        </section>

        <section className="mb-6">
          <h3 className="text-lg font-bold mb-4">2. Dados do Veículo</h3>
          <div className="grid gap-4 sm:grid-cols-3">
            <input
              className="w-full p-3 rounded-xl border bg-white dark:bg-slate-900"
              placeholder="Marca / Modelo / Ano *"
              value={data.vehicle?.brandModel || ''}
              onChange={(e) => handleChange('vehicle.brandModel', e.target.value)}
              disabled={isLoading}
              required
            />
            <input
              className="w-full p-3 rounded-xl border bg-white dark:bg-slate-900"
              placeholder="Placa *"
              value={data.vehicle?.plate || ''}
              onChange={(e) => handleChange('vehicle.plate', e.target.value)}
              disabled={isLoading}
              required
            />
            <input
              className="w-full p-3 rounded-xl border bg-white dark:bg-slate-900"
              placeholder="Quilometragem (KM)"
              value={data.vehicle?.mileage || ''}
              onChange={(e) => handleChange('vehicle.mileage', e.target.value)}
              disabled={isLoading}
            />
          </div>
        </section>

        <section className="mb-6 grid gap-4 lg:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-5">
            <h3 className="text-base font-bold mb-4">3. Mecânica</h3>
            {renderSelect('Filtro de Ar', 'mechanics.airFilter', OPTIONS_STATUS)}
            {renderSelect('Vazamentos (Motor/Câmbio)', 'mechanics.leaks', OPTIONS_STATUS)}
          </div>
          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-5">
            <h3 className="text-base font-bold mb-4">4. Sistema de Freios</h3>
            {renderSelect('Pastilhas e Lonas', 'brakes.pads', OPTIONS_STATUS)}
            {renderSelect('Discos e Tambores', 'brakes.discs', OPTIONS_STATUS)}
          </div>
        </section>

        <section className="mb-6 grid gap-4 lg:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-5">
            <h3 className="text-base font-bold mb-4">5. Scanner e Diagnóstico</h3>
            {renderSelect('Reset de Serviço', 'scanner.serviceReset', OPTIONS_SCAN)}
            {renderSelect('Leitura de Erros (DTC)', 'scanner.dtcs', OPTIONS_SCAN)}
          </div>
          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-5">
            <h3 className="text-base font-bold mb-4">6. Suspensão e Direção</h3>
            {renderSelect('Caixa de Direção / Folgas', 'suspension.steering', ['OK', 'Folga', 'Urgente'])}
            {renderSelect('Amortecedores / Suspensão', 'suspension.shocks', ['OK', 'Folga', 'Urgente'])}
          </div>
        </section>

        <section className="mb-6 grid gap-4 lg:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-5">
            <h3 className="text-base font-bold mb-4">7. Rodagem e Pneus</h3>
            {renderSelect('Sulcos dos Pneus', 'tires.grooves', OPTIONS_TIRE)}
            {renderSelect('Pressão / Calibragem', 'tires.pressure', OPTIONS_TIRE)}
            {renderSelect('Estado do Estepe', 'tires.spare', OPTIONS_TIRE)}
          </div>
          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-5">
            <h3 className="text-base font-bold mb-4">8. Verificação de Fluidos</h3>
            {renderSelect('Óleo do Motor', 'fluids.engineOil', OPTIONS_STATUS)}
            {renderSelect('Fluido de Freio', 'fluids.brakeFluid', OPTIONS_STATUS)}
            {renderSelect('Líquido de Arrefecimento', 'fluids.coolant', OPTIONS_STATUS)}
            {renderSelect('Limpador de Para-brisa', 'fluids.wiperFluid', OPTIONS_STATUS)}
            {renderSelect('Fluido de Transmissão', 'fluids.transmissionFluid', OPTIONS_STATUS)}
          </div>
        </section>

        <section className="mb-6 grid gap-4 lg:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-5">
            <h3 className="text-base font-bold mb-4">9. Segurança e Iluminação</h3>
            {renderSelect('Faróis Principais', 'safety.headlights', OPTIONS_STATUS)}
            {renderSelect('Lanternas Traseiras', 'safety.tailLights', OPTIONS_STATUS)}
            {renderSelect('Setas / Piscas', 'safety.turnSignals', OPTIONS_STATUS)}
            {renderSelect('Limpadores / Palhetas', 'safety.wipers', OPTIONS_STATUS)}
            {renderSelect('Buzina', 'safety.horn', OPTIONS_YES_NO)}
          </div>
          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-5">
            <h3 className="text-base font-bold mb-4">10. Sistema Elétrico</h3>
            <label className="block">
              <span className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-200">Saúde da Bateria</span>
              <input
                type="range"
                min="1"
                max="5"
                value={data.electrical?.batteryHealth ?? 3}
                onChange={(e) => handleChange('electrical.batteryHealth', Number(e.target.value))}
                disabled={isLoading}
                className="w-full"
              />
              <div className="text-sm text-slate-500 dark:text-slate-400 mt-2">{data.electrical?.batteryHealth || 3} / 5</div>
            </label>
            {renderSelect('Carga do Alternador', 'electrical.alternator', OPTIONS_STATUS)}
            {renderSelect('Estado das Correias', 'electrical.belts', OPTIONS_STATUS)}
          </div>
        </section>

        <section className="mb-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-5">
          <h3 className="text-base font-bold mb-4">11. Checkout Final</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            {renderSelect('Test Drive Realizado', 'checkout.testDrive', OPTIONS_YES_NO)}
            {renderSelect('Torque de Rodas OK', 'checkout.wheelTorque', OPTIONS_YES_NO)}
            {renderSelect('Limpeza Externa/Interna', 'checkout.cleaning', OPTIONS_YES_NO)}
            {renderSelect('Sem Objetos Esquecidos', 'checkout.noForgottenItems', OPTIONS_YES_NO)}
          </div>
        </section>

        <section className="mb-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-5">
          <h3 className="text-base font-bold mb-4">12. Resumo</h3>
          <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-200">Peças Utilizadas</label>
          <textarea
            className="w-full p-3 rounded-xl border bg-white dark:bg-slate-900 mb-4"
            rows={3}
            value={data.partsUsed || ''}
            onChange={(e) => handleChange('partsUsed', e.target.value)}
            disabled={isLoading}
          />
          <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-200">Observações Adicionais</label>
          <textarea
            className="w-full p-3 rounded-xl border bg-white dark:bg-slate-900 mb-4"
            rows={4}
            value={data.observations || ''}
            onChange={(e) => handleChange('observations', e.target.value)}
            disabled={isLoading}
          />
          <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-200">Valor Total (R$)</label>
          <input
            className="w-full p-3 rounded-xl border bg-white dark:bg-slate-900"
            placeholder="0,00"
            value={data.totalValue || ''}
            onChange={(e) => handleChange('totalValue', e.target.value)}
            disabled={isLoading}
          />
        </section>

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={isLoading}
            className={`flex-1 py-4 ${isLoading ? 'bg-slate-400' : 'bg-[#1D63BD] hover:bg-[#154A8D]'} text-white rounded-[1.5rem] font-bold transition-colors`}
          >
            {isLoading ? 'Salvando...' : 'Salvar Inspeção'}
          </button>
        </div>
      </div>
    </form>
  );
};

export default InspectionForm;
