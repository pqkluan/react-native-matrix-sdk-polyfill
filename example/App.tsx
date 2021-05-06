import React, {useState} from 'react';
import {SafeAreaView, StatusBar, StyleSheet, Text, View} from 'react-native';

import {LoginForm} from './src/LoginForm';
import {MatrixApp} from './src/MatrixApp';

export default function App(): JSX.Element {
  const [isLoggedIn, setLoggedIn] = useState<boolean>(false);

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <StatusBar barStyle={'default'} />

      <View style={styles.navBar}>
        <Text style={styles.navBarTitle}>{'Matrix Client'}</Text>
      </View>

      <View style={styles.container}>
        {!isLoggedIn ? (
          <LoginForm onLoginSuccess={() => setLoggedIn(true)} />
        ) : (
          <MatrixApp onLogoutSuccess={() => setLoggedIn(false)} />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  navBar: {
    height: 56,
    backgroundColor: '#2668ba',
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  navBarTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '400',
  },
});
