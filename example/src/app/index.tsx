import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { Platform } from 'react-native';
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from 'react-native-screens/native-stack';

import { useAppStore } from 'src/app-state';
import { RootStackParamList } from 'src/navigation/screens';
import { ChatRoomScreen } from 'src/screens/ChatRoomScreen';
import { HomeScreen } from 'src/screens/HomeScreen';
import { LoginScreen } from 'src/screens/LoginScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

const cornflowerblue = '#2568BA';

const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: cornflowerblue,
    notification: '#FF6347',
  },
};

const rootOptions: NativeStackNavigationOptions = {
  headerBackTitleVisible: false,
  stackAnimation: Platform.select({ ios: 'default', android: 'slide_from_right' }),

  headerStyle: {
    backgroundColor: cornflowerblue,
  },
  headerTintColor: '#FFFFFF',
};

const mainOptions: NativeStackNavigationOptions = {
  title: 'Conversations',
  headerHideBackButton: true,
  stackAnimation: Platform.select({ ios: 'fade', android: 'slide_from_right' }),
  ...Platform.select({ ios: { replaceAnimation: 'push' }, android: {} }),
};

export default function App(): JSX.Element {
  const userId = useAppStore((state) => state.userId);

  return (
    <NavigationContainer theme={MyTheme}>
      <Stack.Navigator screenOptions={rootOptions}>
        {!userId ? (
          <Stack.Screen
            component={LoginScreen}
            name={'Login'}
            options={{ title: 'Matrix Client' }}
          />
        ) : (
          <>
            <Stack.Screen component={HomeScreen} name={'Home'} options={mainOptions} />
            <Stack.Screen component={ChatRoomScreen} name={'ChatRoom'} options={{ title: '' }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
