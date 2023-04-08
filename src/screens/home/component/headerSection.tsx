//import liraries
import TextComponent from "components/Text";
import React, { Component } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { COLORS } from "shared/constants/colors";
import { sizes } from "shared/constants/common";
export interface Props {
  title?: string;
  onPress?: (value: any) => void;
}
// create a component
const HeaderSection: React.FC<Props> = (props) => {
  const {title, onPress} = props
  return (
    <View style={styles.container}>
      <View style={styles.wrapperText}>
        <TextComponent fontSize={sizes[4]}>
          {title ?? 'Dịch vụ hot'}
        </TextComponent>
      </View>
      <TouchableOpacity onPress={onPress}>
        <TextComponent
          style={{ color: COLORS.BrownYellow }}
          fontSize={sizes[3]}
        >
          Xem tất cả
        </TextComponent>
      </TouchableOpacity>
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
  },
  wrapperText: {
    paddingHorizontal: 10,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.BrownYellow,
  },
});

//make this component available to the app
export default HeaderSection;
