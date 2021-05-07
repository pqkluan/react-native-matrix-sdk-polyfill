import React, { useCallback, useRef, useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';

import { useAppStore } from '../app-state';
import { matrixService } from '../services/matrix.service';

interface Props {}

export function LoginScreen(props: Props): JSX.Element {
  const {} = props;

  const setUserId = useAppStore(useCallback((state) => state.setUserId, []));

  const passwordInput = useRef<TextInput>(null);

  const [username, setUserName] = useState<string>('@luan:pqkluan.local');
  const [password, setPassword] = useState<string>('123456');
  const [errorMsg, setErrorMsg] = useState<string>('');

  const focusPasswordInput = useCallback(() => passwordInput?.current?.focus(), []);

  const handleSubmit = useCallback(async () => {
    if (!username || !password) return;

    try {
      setErrorMsg('');

      const result = await matrixService.login(username, password);
      if (!result) throw new Error('Something went wrong...');

      setUserId(result.user_id);
    } catch (error) {
      setErrorMsg(typeof error === 'string' ? error : error?.message ?? 'Something went wrong...');
    }
  }, [password, setUserId, username]);

  return (
    <View style={styles.container}>
      <Text>{'Matrix Client'}</Text>
      <Text>{`Homeserver: ${matrixService.URL}`}</Text>

      <TextInput
        placeholder={'@abc:pqkluan.local'}
        style={styles.input}
        value={username}
        onChangeText={setUserName}
        onSubmitEditing={focusPasswordInput}
      />

      <TextInput
        ref={passwordInput}
        placeholder={'Password'}
        style={styles.input}
        value={password}
        secureTextEntry
        onChangeText={setPassword}
        onSubmitEditing={handleSubmit}
      />

      {!!errorMsg && (
        <View style={styles.errorWrap}>
          <Text style={styles.error}>{errorMsg}</Text>
        </View>
      )}

      <Button
        color={'#2668ba'}
        disabled={!username || !password}
        title={'Login'}
        onPress={handleSubmit}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
    margin: 16,
    padding: 16,
  },
  input: {
    borderColor: '#2668ba',
    borderRadius: 2,
    borderWidth: 1,
    marginTop: 8,
    padding: 8,
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
});
