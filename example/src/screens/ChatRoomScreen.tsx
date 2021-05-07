import { RouteProp } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';
import { RawEvent, Room } from 'matrix-js-sdk';
import React, { useEffect, useState } from 'react';
import { StatusBar, StyleSheet, Text, View } from 'react-native';

import { RootStackParamList } from 'src/navigation/screens';
import { matrixService } from 'src/services/matrix.service';

type ProfileScreenRouteProp = RouteProp<RootStackParamList, 'ChatRoom'>;
type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ChatRoom'>;

type Props = {
  route: ProfileScreenRouteProp;
  navigation: ProfileScreenNavigationProp;
};

export function ChatRoomScreen(props: Props): JSX.Element {
  const { route, navigation } = props;
  const { roomId } = route.params;

  const [room, setRoom] = useState<Room>();
  const [msgs, setMsgs] = useState<RawEvent[]>([]);

  useEffect(() => {
    const r = matrixService.getRoom(roomId);
    if (r) {
      navigation.setOptions({ title: r.name });
      setRoom(r);
    }

    matrixService.listenToRoomEvents(roomId, (rawEvent) => {
      setMsgs((existsMsgs) => [...existsMsgs, rawEvent]);
    });
  }, [navigation, roomId]);

  if (!room) return <View />;

  return (
    <>
      <StatusBar barStyle={'light-content'} />

      <View style={styles.container}>
        <Text style={styles.title}>{room.name}</Text>
        {room
          .getLiveTimeline()
          .getEvents()
          .map(({ event }) => {
            return <Text key={event.event_id}>{event.content.body}</Text>;
          })}

        {msgs.map((event) => {
          return <Text key={event.event_id}>{event.content.body}</Text>;
        })}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
    margin: 8,
    marginHorizontal: 16,

    paddingHorizontal: 8,
    shadowColor: '#000000',
    shadowOffset: { height: 2, width: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  title: {
    color: '#2568ba',
    fontSize: 18,
    marginBottom: 8,
    marginTop: 16,
  },
});
