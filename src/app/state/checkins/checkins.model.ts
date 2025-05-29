export interface CheckinModel {
  id: number | string;
  memberId: number;
  gymId: number;
  checkinDate: string;
  checkOutTimestamp?: string;

 timestamp: string;       // ⏱ Fecha/hora del check-in (como ISO string)
  createdBy: string;    
  createdAt?: string;
  updatedAt?: string;
  isSynced?: boolean;
  syncError?: boolean;
  tempId?: string;
}
export interface FormattedCheckin {
  name: string;
  img: string;
  time: string;
  date: string;
  inside: boolean;
}