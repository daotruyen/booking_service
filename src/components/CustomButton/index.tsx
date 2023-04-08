//import liraries
import { COLORS } from "shared/constants/colors";
import { sizes } from "shared/constants/common";
import React, { Component } from "react";
import { ActivityIndicator, StyleSheet, TouchableOpacity } from "react-native";
import TextComponent from "components/Text";
import { isIOS } from "react-native-size-scaling";

export interface Props {
  label?: string;
  onPress?: () => void;
  style?: {};
  labelColor?: string;
  disabled?: boolean;
  loading?: boolean;
}
// create a component
const Button: React.FC<Props> = (props) => {
  const { label, onPress, style, labelColor, disabled, loading } = props;
  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={onPress}
      disabled={disabled ?? loading}
    >
      {!loading ?<TextComponent
        style={{
          fontSize: sizes[4],
          fontWeight: "500",
          color: labelColor ?? COLORS.White,
        }}
      >
        {label}
      </TextComponent>
      :
      <ActivityIndicator animating={true} size="small" color={COLORS.White} />}
    </TouchableOpacity>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.YankeesBlue,
    padding: isIOS ? 16 : 10,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 8,
  },
});

//make this component available to the app
export default Button;
