
export enum InspectionStatus {
  EXCELLENT = 'Excelente',
  GOOD = 'Bom',
  ACCEPTABLE = 'Aceitável',
  REPLACE = 'Substituição',
  OK = 'OK',
  LOW = 'Baixo',
  CHANGE_REQUIRED = 'Sujeito a Troca',
  MINOR_DEFECT = 'Defeito Leve',
  MAJOR_DEFECT = 'Defeito Grave'
}

export interface ClientInfo {
  name: string;
  phone: string;
}

export interface VehicleInfo {
  brandModel: string;
  year: string;
  plate: string;
  mileage: string;
}

export interface InspectionData {
  id: string;
  date: string;
  client: ClientInfo;
  vehicle: VehicleInfo;
  tires: {
    grooves: InspectionStatus;
    pressure: InspectionStatus;
    spare: InspectionStatus;
  };
  fluids: {
    engineOil: InspectionStatus;
    brakeFluid: InspectionStatus;
    transmissionFluid: InspectionStatus;
    coolant: InspectionStatus;
    wiperFluid: InspectionStatus;
  };
  electrical: {
    batteryHealth: number;
    alternator: InspectionStatus;
    belts: InspectionStatus;
    dashboardLights: boolean;
  };
  safety: {
    headlights: InspectionStatus;
    tailLights: InspectionStatus;
    turnSignals: InspectionStatus;
    wipers: InspectionStatus;
    horn: boolean;
  };
  equipment: {
    triangle: boolean;
    extinguisher: boolean;
    tireWrench: boolean;
    jack: boolean;
  };
  checkout: {
    testDrive: boolean;
    wheelTorque: boolean;
    cleaning: boolean;
    personalObjects: boolean;
  };
  partsUsed: string;
  observations: string;
}
