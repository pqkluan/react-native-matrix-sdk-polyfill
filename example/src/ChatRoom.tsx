import {Room} from 'matrix-js-sdk';
import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';

import {matrixService} from './matrix.service';

interface Props {
  roomId: string;
}

export function ChatRoom(props: Props): JSX.Element {
  const {roomId} = props;

  const [room, setRoom] = useState<Room>();

  useEffect(() => {
    const r = matrixService.getRoom(roomId);
    if (r) setRoom(r);
  }, [roomId]);

  if (!room) {
    return <View />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{room.name}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    margin: 8,
    marginHorizontal: 16,

    shadowColor: '#000000',
    shadowOffset: {height: 2, width: 2},
    shadowRadius: 4,
    shadowOpacity: 0.2,
    borderRadius: 4,
  },
  errorWrap: {
    marginTop: 8,
    backgroundColor: '#B00020',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  error: {
    color: '#FFFFFF',
    fontWeight: '400',
  },
  flatList: {},
  title: {
    marginTop: 16,
    marginBottom: 8,
    color: '#2568ba',
    fontSize: 18,
  },
  separator: {
    backgroundColor: '#6495ed',
    height: StyleSheet.hairlineWidth,
  },
});
