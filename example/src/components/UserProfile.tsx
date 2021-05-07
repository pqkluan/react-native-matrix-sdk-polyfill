import { useTheme } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useAppStore } from 'src/app-state';
import { Avatar } from 'src/components/Avatar';
import { Button } from 'src/components/shared/Button';
import { Card } from 'src/components/shared/Card';
import { matrixService } from 'src/services/matrix.service';

interface Props {}

function useProfileState() {
  const setUserId = useAppStore(useCallback((state) => state.setUserId, []));

  const [profile, setProfile] = useState<{
    id: string;
    displayName?: string;
    avatarUrl?: string;
  }>();

  useEffect(() => {
    (async () => {
      const data = await matrixService.getUserProfile();
      setProfile(data);
    })();
  }, []);

  const handleLogout = useCallback(() => matrixService.logout().then(() => setUserId(undefined)), [
    setUserId,
  ]);

  return {
    profile,
    handleLogout,
  };
}

export function UserProfile(props: Props): JSX.Element {
  const {} = props;

  const { colors } = useTheme();

  const { handleLogout, profile } = useProfileState();

  return (
    <Card style={styles.container}>
      <Avatar />

      <View style={styles.subContainer}>
        <Text style={[styles.highlight, { color: colors.primary }]}>{profile?.displayName}</Text>
        <Text>{profile?.id}</Text>

        <View style={styles.logoutButtonWrap}>
          <Button
            style={[styles.logoutButton, { backgroundColor: colors.notification }]}
            title={'Logout'}
            onPress={handleLogout}
          />
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  subContainer: {
    flex: 1,
  },
  highlight: {
    fontWeight: '500',
  },
  logoutButton: {
    height: 18,
    marginTop: 4,
    paddingHorizontal: 4,
  },
  logoutButtonWrap: {
    bottom: 0,
    flexDirection: 'row',
    position: 'absolute',
    right: 0,
  },
});
