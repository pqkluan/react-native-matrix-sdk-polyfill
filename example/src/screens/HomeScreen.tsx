import React from 'react';

import { RoomsList } from 'src/components/RoomsList';
import { UserProfile } from 'src/components/UserProfile';

interface Props {}

export function HomeScreen(props: Props): JSX.Element {
  const {} = props;

  return (
    <>
      <UserProfile />
      <RoomsList />
    </>
  );
}
