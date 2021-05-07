import React from 'react';
import { StatusBar } from 'react-native';

import { RoomsList } from 'src/components/room/RoomList';
import { UserProfile } from 'src/components/UserProfile';

interface Props {}

export function HomeScreen(props: Props): JSX.Element {
  const {} = props;

  return (
    <>
      <StatusBar barStyle={'light-content'} />

      <UserProfile />

      <RoomsList />
    </>
  );
}
