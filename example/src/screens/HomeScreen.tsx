import React from 'react';

import {RoomsList} from '../components/RoomsList';
import {UserProfile} from '../components/UserProfile';

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
