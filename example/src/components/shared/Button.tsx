import { useTheme } from '@react-navigation/native';
import React from 'react';
import { TouchableOpacity, StyleSheet, TouchableOpacityProps, Text } from 'react-native';

interface Props extends TouchableOpacityProps {
  title: string;
}

export function Button(props: Props): JSX.Element {
  const { title, style, ...otherProps } = props;

  const { dark, colors } = useTheme();

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={[styles.container, { backgroundColor: colors.primary }, style]}
      {...otherProps}>
      <Text style={[styles.title, { color: dark ? colors.text : colors.card }]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 2,
    height: 32,
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { height: 1, width: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  title: {
    fontWeight: '500',
    textAlign: 'center',
  },
});
