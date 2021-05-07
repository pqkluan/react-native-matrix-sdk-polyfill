import React, {useEffect, useState} from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import {matrixService} from '../services/matrix.service';

import {RoomRow} from './RoomRow';

interface Props {}

export function RoomsList(props: Props): JSX.Element {
  const {} = props;

  const [roomIds, setRoomIds] = useState<string[]>([]);
  const [isReady, setIsReady] = useState<boolean>(false);

  useEffect(() => {
    matrixService.onSyncCompleted(async () => {
      const joinedRooms = await matrixService.listJoinedRoomIds();
      setRoomIds(joinedRooms);
      setIsReady(true);
    });

    matrixService.startClient();
    return () => matrixService.stopClient();
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        keyExtractor={item => item}
        contentContainerStyle={styles.flatList}
        data={roomIds}
        refreshing={!isReady}
        ListEmptyComponent={() =>
          isReady ? (
            <View style={styles.errorWrap}>
              <Text style={styles.error}>{'No joined room'}</Text>
            </View>
          ) : null
        }
        ListHeaderComponent={<Text style={styles.title}>{'Rooms'}</Text>}
        renderItem={({item}) => <RoomRow roomId={item} />}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 8,
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
  flatList: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    margin: 8,

    shadowColor: '#000000',
    shadowOffset: {height: 2, width: 2},
    shadowRadius: 4,
    shadowOpacity: 0.2,
    borderRadius: 4,
  },
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
