import { useTheme } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

import { matrixService } from 'src/services/matrix.service';

import { RoomRow } from './RoomRow';

interface Props {}

export function RoomsList(props: Props): JSX.Element {
  const {} = props;

  const { colors } = useTheme();

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
    <FlatList
      ItemSeparatorComponent={Separator}
      ListEmptyComponent={() =>
        isReady ? (
          <Text style={[styles.error, { color: colors.notification }]}>{'No joined room'}</Text>
        ) : null
      }
      ListHeaderComponent={<Separator />}
      data={roomIds}
      keyExtractor={(item) => item}
      refreshing={!isReady}
      renderItem={({ item }) => <RoomRow roomId={item} />}
    />
  );
}

function Separator(): JSX.Element {
  return <View style={styles.separator} />;
}

const styles = StyleSheet.create({
  error: {
    padding: 16,
    textAlign: 'center',
  },
  separator: {
    height: 8,
  },
});
