import { useTheme } from '@react-navigation/native';
import React, { useRef, useImperativeHandle, useCallback } from 'react';
import {
  StyleProp,
  StyleSheet,
  TextInput as OriginalTextInput,
  TextInputProps,
  ViewStyle,
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

interface Props extends TextInputProps {
  containerStyle?: StyleProp<ViewStyle>;
}

export type TextInputRef = OriginalTextInput;

export const TextInput = React.forwardRef<OriginalTextInput, Props>(
  (props, ref): JSX.Element => {
    const { style, containerStyle, ...otherProps } = props;

    const { colors } = useTheme();

    const inputRef = useRef<OriginalTextInput>(null);
    useImperativeHandle(ref, () => inputRef.current as OriginalTextInput);

    const focusInput = useCallback(() => inputRef?.current?.focus(), []);

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        style={[styles.container, { borderColor: colors.primary }, containerStyle]}
        onPress={focusInput}>
        <OriginalTextInput ref={inputRef} style={[styles.input, style]} {...otherProps} />
      </TouchableOpacity>
    );
  },
);
TextInput.displayName = 'TextInput';

const styles = StyleSheet.create({
  container: {
    borderRadius: 2,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  input: {
    marginTop: 0,
    padding: 0,
  },
});
