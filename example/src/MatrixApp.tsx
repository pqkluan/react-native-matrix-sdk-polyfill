import React, {useState} from 'react';

import {UserProfile} from './UserProfile';
import {RoomsList} from './RoomsList';
import {ChatRoom} from './ChatRoom';

interface Props {
  onLogoutSuccess: () => void;
}

export function MatrixApp(props: Props): JSX.Element {
  const {onLogoutSuccess} = props;

  const [selectedRoomId, setSelectedRoomId] = useState<string>('');

  return (
    <>
      <UserProfile onLogoutSuccess={onLogoutSuccess} />
      <RoomsList onSelectRoomId={setSelectedRoomId} />

      {!!selectedRoomId && <ChatRoom roomId={selectedRoomId} />}
    </>
  );
}
