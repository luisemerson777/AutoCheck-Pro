
export const InspectionStatus = {
  EXCELLENT: 'Excelente',
  GOOD: 'Bom',
  ACCEPTABLE: 'Aceitável',
  URGENT: 'Urgente',
  OK: 'OK',
  ATTENTION: 'Atenção',
  LOW: 'Baixo',
  CHANGE_REQUIRED: 'Troca Necessária',
  MINOR_DEFECT: 'Defeito Leve',
  MAJOR_DEFECT: 'Defeito Grave'
};

export const INITIAL_FORM_STATE = {
  id: Date.now(),
  date: new Date().toISOString(),
  client: { name: '', phone: '' },
  vehicle: { brandModel: '', plate: '', mileage: '' },
  mechanics: { airFilter: 'OK', leaks: 'OK' },
  brakes: { pads: 'OK', discs: 'OK' },
  scanner: { serviceReset: 'N/A', dtcs: 'N/A' },
  suspension: { steering: 'OK', shocks: 'OK' },
  tires: { grooves: 'Bom', pressure: 'Bom', spare: 'Bom' },
  fluids: { engineOil: 'OK', brakeFluid: 'OK', coolant: 'OK', wiperFluid: 'OK', transmissionFluid: 'OK' },
  safety: { headlights: 'OK', tailLights: 'OK', turnSignals: 'OK', wipers: 'OK', horn: 'Sim' },
  electrical: { batteryHealth: 3, alternator: 'OK', belts: 'OK' },
  checkout: { testDrive: 'Não', wheelTorque: 'Não', cleaning: 'Não', noForgottenItems: 'Não' },
  partsUsed: '',
  observations: '',
  totalValue: '0,00'
};
