import { useTheme } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface Props {
  avatarUrl?: string;
}

export function Avatar(props: Props): JSX.Element {
  const { avatarUrl } = props;

  const { colors, dark } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.primary }]}>
      <Text style={[styles.text, { color: dark ? colors.text : colors.card }]}>{'?'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    borderRadius: 24,
    height: 48,
    justifyContent: 'center',
    marginRight: 16,
    width: 48,
  },
  text: {
    fontSize: 24,
    fontWeight: '500',
  },
});
