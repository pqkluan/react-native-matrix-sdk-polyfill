import {useNavigation} from '@react-navigation/core';
import {Room} from 'matrix-js-sdk';
import React, {useCallback, useEffect, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {screens} from '../screens';
import {matrixService} from '../services/matrix.service';

interface Props {
  roomId: string;
}

export function RoomRow(props: Props): JSX.Element {
  const {roomId} = props;

  const navigation = useNavigation();

  const [room, setRoom] = useState<Room>();

  const handlePress = useCallback(() => {
    // TODO: strong type
    navigation.navigate(screens.ChatRoom, {roomId});
  }, [navigation, roomId]);

  useEffect(() => {
    const r = matrixService.getRoom(roomId);
    if (r) setRoom(r);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!room) {
    return <View />;
  }

  return (
    <TouchableOpacity onPress={handlePress} style={styles.container}>
      <Text>{room.name}</Text>
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
  },
});
