import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

import { matrixService } from '../services/matrix.service';
import { RoomRow } from './RoomRow';

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
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={() =>
          isReady ? (
            <View style={styles.errorWrap}>
              <Text style={styles.error}>{'No joined room'}</Text>
            </View>
          ) : null
        }
        ListHeaderComponent={<Text style={styles.title}>{'Rooms'}</Text>}
        contentContainerStyle={styles.flatList}
        data={roomIds}
        keyExtractor={(item) => item}
        refreshing={!isReady}
        renderItem={({ item }) => <RoomRow roomId={item} />}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 8,
  },
  errorWrap: {
    backgroundColor: '#B00020',
    borderRadius: 4,
    marginTop: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  error: {
    color: '#FFFFFF',
    fontWeight: '400',
  },
  flatList: {
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
    margin: 8,

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
  separator: {
    backgroundColor: '#6495ed',
    height: StyleSheet.hairlineWidth,
  },
});
