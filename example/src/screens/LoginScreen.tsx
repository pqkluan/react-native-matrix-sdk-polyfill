import React, { useCallback, useRef, useState } from 'react';
import { StatusBar, StyleSheet, Text, View } from 'react-native';

import { useAppStore } from 'src/app-state';
import { Button } from 'src/components/shared/Button';
import { Card } from 'src/components/shared/Card';
import { TextInput, TextInputRef } from 'src/components/shared/TextInput';
import { matrixService } from 'src/services/matrix.service';

interface Props {}

export function LoginScreen(props: Props): JSX.Element {
  const {} = props;

  const setUserId = useAppStore(useCallback((state) => state.setUserId, []));

  const passwordInput = useRef<TextInputRef>(null);

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
    <>
      <StatusBar barStyle={'light-content'} />

      <Card style={styles.container}>
        <Text>{`Homeserver: ${matrixService.URL}`}</Text>

        <TextInput
          containerStyle={styles.inputContainer}
          placeholder={'@abc:pqkluan.local'}
          value={username}
          onChangeText={setUserName}
          onSubmitEditing={focusPasswordInput}
        />

        <TextInput
          ref={passwordInput}
          containerStyle={styles.inputContainer}
          placeholder={'Password'}
          value={password}
          secureTextEntry
          onChangeText={setPassword}
          onSubmitEditing={handleSubmit}
        />

        {!!errorMsg && <Text style={styles.error}>{errorMsg}</Text>}

        <Button
          disabled={!username || !password}
          style={styles.button}
          title={'Login'}
          onPress={handleSubmit}
        />
      </Card>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 16,
    padding: 16,
  },
  inputContainer: {
    marginTop: 8,
  },
  error: {
    color: '#B00020',
    paddingTop: 4,
    textAlign: 'center',
  },
  button: {
    marginTop: 8,
  },
});
