import React, {useCallback, useEffect, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import {matrixService} from './matrix.service';

interface Props {
  onLogoutSuccess: () => void;
}

export function UserProfile(props: Props): JSX.Element {
  const {onLogoutSuccess} = props;

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

  const handleLogout = useCallback(async () => {
    await matrixService.logout();
    onLogoutSuccess();
  }, [onLogoutSuccess]);

  return (
    <View style={styles.container}>
      <View style={styles.textWrap}>
        <Text>
          {'Logged in as '}
          <Text
            style={
              styles.highlight
            }>{`${profile?.displayName} (${profile?.id})`}</Text>
        </Text>
      </View>

      <TouchableOpacity style={styles.logoutWrap} onPress={handleLogout}>
        <Text style={styles.logout}>{'Logout?'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 16,
    padding: 8,
    shadowColor: '#000000',
    shadowOffset: {height: 2, width: 2},
    shadowRadius: 4,
    shadowOpacity: 0.2,
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  textWrap: {
    flex: 1,
  },
  highlight: {
    fontWeight: '500',
    color: '#003e89',
  },
  logoutWrap: {
    backgroundColor: '#B00020',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
  },
  logout: {
    fontWeight: '500',
    color: '#FFFFFF',
  },
});
