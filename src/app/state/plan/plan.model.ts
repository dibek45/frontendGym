export interface Plan {
  id: number;
  name: string;
  actived: boolean;
  price: number;
  createdAt: string;
  updatedAt: string;
  gymId?: number;
}
