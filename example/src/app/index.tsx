import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {LoginScreen} from '../screens/LoginScreen';
import {useAppStore} from '../app-state';
import {HomeScreen} from '../screens/HomeScreen';
import {ChatRoomScreen} from '../screens/ChatRoomScreen';
import {RootStackParamList} from '../screens';

const Stack = createStackNavigator<RootStackParamList>();

export default function App(): JSX.Element {
  const userId = useAppStore(state => state.userId);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {!userId ? (
          <Stack.Screen name="Login" component={LoginScreen} />
        ) : (
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="ChatRoom" component={ChatRoomScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
