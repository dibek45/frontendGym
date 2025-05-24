export interface UserSessionState {
  userId: number | null;
  userName: string | null;
  gymId: number | null;
  gymName: string | null;
  role: string | null;
  currentBalance: number;
  cajaStatus: 'open' | 'closed' | 'unknown';
}

export const initialUserSessionState: UserSessionState = {
  userId: null,
  userName: null,
  gymId: null,
  gymName: null,
  role: null,
  currentBalance: 0,
  cajaStatus: 'unknown'
};
