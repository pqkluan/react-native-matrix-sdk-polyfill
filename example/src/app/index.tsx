import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';

import { useAppStore } from '../app-state';
import { RootStackParamList } from '../screens';
import { ChatRoomScreen } from '../screens/ChatRoomScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { LoginScreen } from '../screens/LoginScreen';

const Stack = createStackNavigator<RootStackParamList>();

export default function App(): JSX.Element {
  const userId = useAppStore((state) => state.userId);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {!userId ? (
          <Stack.Screen component={LoginScreen} name={'Login'} />
        ) : (
          <>
            <Stack.Screen component={HomeScreen} name={'Home'} />
            <Stack.Screen component={ChatRoomScreen} name={'ChatRoom'} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
