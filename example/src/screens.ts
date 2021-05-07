export const screens = {
  Login: 'Login',
  Home: 'Home',
  ChatRoom: 'ChatRoom',
} as const;

export type RootStackParamList = {
  [screens.Login]: undefined;
  [screens.Home]: undefined;
  [screens.ChatRoom]: { roomId: string };
};
