export interface Promotion {
  id: number; // Unique identifier for the promotion
  name: string; // Name of the promotion
  description?: string; // Optional description of the promotion
  price: number; // Price of the promotion
  img?: string; // Optional image URL for the promotion
  active: boolean; // Status of the promotion (active/inactive)
  promotionTypeId: number; // Type ID associated with the promotion
  gymId?: number; // Optional gym ID, if the promotion is tied to a specific gym
  createdAt: Date; // Timestamp of when the promotion was created
  updatedAt: Date; // Timestamp of the last update to the promotion
}
