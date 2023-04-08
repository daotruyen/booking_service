//import liraries
import TextComponent from "components/Text";
import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Platform,
  TouchableOpacity,
  Keyboard,
  KeyboardTypeOptions,
} from "react-native";
import { COLORS } from "shared/constants/colors";
import { sizes } from 'shared/constants/common';

export interface Props {
  value?: string;
  style?: {};
  wrapperStyle?: {};
  titleStyle?: {};
  isRequired?: boolean;
  onChangeText?: (text: string) => void;
  error?: string;
  title?: string;
  placeholder?: string;
  numberOfLines?: number;
  editable?: boolean;
  onTap?: () => void;
  keyboardType?: KeyboardTypeOptions;
  secureTextEntry?: boolean;
}
// create a component
const InputCustom: React.FC<Props> = (props) => {
  const {
    value,
    onChangeText,
    wrapperStyle,
    error,
    style,
    title,
    placeholder,
    numberOfLines,
    editable,
    titleStyle,
    isRequired,
    onTap,
    keyboardType,
    secureTextEntry
  } = props;
  return (
    <View style={wrapperStyle}>
      <TextComponent color={COLORS.Gray} fontSize ={sizes[3]}>
        {title}
        {isRequired && <Text style={{ color: 'red' }}> *</Text>}
        </TextComponent>

      {onTap ? (
        <TouchableOpacity onPress={onTap}>
          <View pointerEvents="none">
            <TextInput
              // editable={editable}
              style={[styles.textinput, style,]}
              value={value}
              textContentType="oneTimeCode"
              onChangeText={onChangeText}
              placeholder={placeholder}
              placeholderTextColor="gray"
              numberOfLines={numberOfLines?? 1}
              multiline={!!numberOfLines}
              onTouchStart={onTap}
              secureTextEntry = {secureTextEntry}
            />
          </View>
        </TouchableOpacity>
      ) : (
        <TextInput
          editable={editable}
          style={[styles.textinput, style, editable == false ? {backgroundColor: COLORS.Grayscale, color: '#B1B1B1'} : {}]}
          value={value}
          textContentType="oneTimeCode"
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="gray"
          numberOfLines={numberOfLines ?? 1}
          multiline={!!numberOfLines}
          onTouchStart={onTap}
          keyboardType = {keyboardType}
          secureTextEntry = {secureTextEntry}
        />
      )}
      {error && <TextComponent color="red">{error}</TextComponent>}
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  textinput: {
    padding: Platform.OS == "ios" ? 8 : 6,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 5,
    height: 40,
    borderColor: COLORS.LightSilver,
    fontSize: sizes[4]
  },
});

//make this component available to the app
export default InputCustom;
