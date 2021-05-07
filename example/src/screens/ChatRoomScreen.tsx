import {RouteProp} from '@react-navigation/core';
import {StackNavigationProp} from '@react-navigation/stack';
import {RawEvent, Room} from 'matrix-js-sdk';
import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {RootStackParamList} from '../screens';
import {matrixService} from '../services/matrix.service';

type ProfileScreenRouteProp = RouteProp<RootStackParamList, 'ChatRoom'>;
type ProfileScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'ChatRoom'
>;

type Props = {
  route: ProfileScreenRouteProp;
  navigation: ProfileScreenNavigationProp;
};

export function ChatRoomScreen(props: Props): JSX.Element {
  const {route} = props;
  const {roomId} = route.params;

  const [room, setRoom] = useState<Room>();
  const [msgs, setMsgs] = useState<RawEvent[]>([]);

  useEffect(() => {
    const r = matrixService.getRoom(roomId);
    if (r) setRoom(r);

    matrixService.listenToRoomEvents(roomId, rawEvent => {
      setMsgs(existsMsgs => [...existsMsgs, rawEvent]);
    });
  }, [roomId]);

  if (!room) {
    return <View />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{room.name}</Text>
      {room
        .getLiveTimeline()
        .getEvents()
        .map(({event}) => {
          return <Text key={event.event_id}>{event.content.body}</Text>;
        })}

      {msgs.map(event => {
        return <Text key={event.event_id}>{event.content.body}</Text>;
      })}
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
