import {Room} from 'matrix-js-sdk';
import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import {matrixService} from './matrix.service';

interface Props {
  roomId: string;
  onPress: (roomId: string) => void;
}

export function RoomRow(props: Props): JSX.Element {
  const {roomId, onPress} = props;

  const [room, setRoom] = useState<Room>();

  useEffect(() => {
    const r = matrixService.getRoom(roomId);
    if (r) setRoom(r);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!room) {
    return <View />;
  }

  return (
    <TouchableOpacity onPress={() => onPress(roomId)} style={styles.container}>
      <Text>{room.name}</Text>
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
  },
});
