export interface userModel{
  id: number;
  gymName?: string;  // Opcional si no siempre recibes el nombre
  gymId: number;  // Opcional si no siempre recibes el nombre
  roll?: number; // Opcional si no siempre recibes el email
  token?: string; // Opcional si lo usas para manejar autenticación
}