import create from 'zustand';

interface AppState {
  userId?: string;
  roomId?: string;
  setUserId: (userId?: string) => void;
  setRoomId: (roomId?: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  userId: undefined,
  roomId: undefined,
  setUserId: (userId) => set(() => ({ userId })),
  setRoomId: (roomId) => set(() => ({ roomId })),
}));
