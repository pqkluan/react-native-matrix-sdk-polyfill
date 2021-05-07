import 'react-native-matrix-sdk-polyfill';
import 'react-native-gesture-handler';

import { AppRegistry } from 'react-native';

import { name as appName } from './app.json';
import App from './src/app';

AppRegistry.registerComponent(appName, () => App);
