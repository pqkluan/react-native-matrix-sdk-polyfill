import './shim';
import { AppRegistry } from 'react-native';
import 'react-native-matrix-sdk-polyfill';
import 'react-native-gesture-handler';
import 'olm';

import { name as appName } from './app.json';
import App from './src/app';

AppRegistry.registerComponent(appName, () => App);
