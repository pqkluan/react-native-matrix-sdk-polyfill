import { useTheme } from '@react-navigation/native';
import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

type Props = React.PropsWithChildren<{
  style: StyleProp<ViewStyle>;
}>;

export function Card(props: Props): JSX.Element {
  const { style, children } = props;

  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.card }, style]}>{children}</View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 2,
    shadowColor: '#000000',
    shadowOffset: { height: 2, width: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
});
