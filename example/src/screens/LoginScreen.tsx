import React, {useCallback, useRef, useState} from 'react';
import {Button, StyleSheet, Text, TextInput, View} from 'react-native';
import {useAppStore} from '../app-state';

import {matrixService} from '../services/matrix.service';

interface Props {}

export function LoginScreen(props: Props): JSX.Element {
  const {} = props;

  const setUserId = useAppStore(useCallback(state => state.setUserId, []));

  const passwordInput = useRef<TextInput>(null);

  const [username, setUserName] = useState<string>('@luan:pqkluan.local');
  const [password, setPassword] = useState<string>('123456');
  const [errorMsg, setErrorMsg] = useState<string>('');

  const focusPasswordInput = useCallback(
    () => passwordInput?.current?.focus(),
    [],
  );

  const handleSubmit = useCallback(async () => {
    if (!username || !password) {
      return;
    }

    try {
      setErrorMsg('');

      const result = await matrixService.login(username, password);
      if (!result) throw new Error('Something went wrong...');

      setUserId(result.user_id);
    } catch (error) {
      setErrorMsg(
        typeof error === 'string'
          ? error
          : error?.message ?? 'Something went wrong...',
      );
    }
  }, [password, setUserId, username]);

  return (
    <View style={styles.container}>
      <Text>{'Matrix Client'}</Text>
      <Text style={{}}>{`Homeserver: ${matrixService.URL}`}</Text>

      <TextInput
        style={styles.input}
        placeholder={'@abc:pqkluan.local'}
        value={username}
        onChangeText={setUserName}
        onSubmitEditing={focusPasswordInput}
      />

      <TextInput
        ref={passwordInput}
        style={styles.input}
        placeholder={'Password'}
        value={password}
        onChangeText={setPassword}
        onSubmitEditing={handleSubmit}
        secureTextEntry
      />

      {!!errorMsg && (
        <View style={styles.errorWrap}>
          <Text style={styles.error}>{errorMsg}</Text>
        </View>
      )}

      <Button
        onPress={handleSubmit}
        disabled={!username || !password}
        title={'Login'}
        color={'#2668ba'}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingTop: 8,
  },
  input: {
    marginTop: 8,
    padding: 8,
    borderWidth: 1,
    borderRadius: 4,
    borderColor: '#2668ba',
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
});
