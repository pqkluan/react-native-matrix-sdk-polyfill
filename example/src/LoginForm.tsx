import React, {useCallback, useRef, useState} from 'react';
import {Button, StyleSheet, Text, TextInput, View} from 'react-native';
import {matrixService} from './matrix.service';

interface Props {
  onLoginSuccess: () => void;
}

export function LoginForm(props: Props): JSX.Element {
  const {onLoginSuccess} = props;

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

      await matrixService.login(username, password);

      onLoginSuccess();
    } catch (error) {
      setErrorMsg(
        typeof error === 'string'
          ? error
          : error?.message ?? 'Something went wrong...',
      );
    }
  }, [onLoginSuccess, password, username]);

  return (
    <View style={styles.container}>
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
