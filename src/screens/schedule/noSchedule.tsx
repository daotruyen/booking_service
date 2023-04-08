//import liraries
import Button from "components/CustomButton";
import TextComponent from "components/Text";
import { COLORS } from "shared/constants/colors";
import { sizes } from "shared/constants/common";
import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";

interface Props {
  onPress?: () => void
}
// create a component
const NoScheduleComponent: React.FC<Props> = props => {
  const { onPress } = props;
  return (
    <View style={[styles.card, styles.shadowProp]}>
      <View
        style={{
          borderBottomWidth: 0.5,
          borderColor: "#EFEFEF",
          marginBottom: 16,
        }}
      >
        <TextComponent
          style={styles.text}
          color={COLORS.Gray}
          fontSize={sizes[3]}
        >
          Bạn đang chưa sử dụng liệu trình nào! Tham khảo ngay các dịch vụ của
          Viện Thẩm Mỹ Quốc Tế Hoa Kỳ nhé
        </TextComponent>
      </View>
      <Button label="Tham khảo dịch vụ" onPress={onPress} />
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: 8,
    marginVertical: 10,
    padding: 8,
  },
  shadowProp: {
    shadowOffset: { width: -2, height: 4 },
    shadowColor: "#171717",
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  text: {
    marginBottom: 16,
  },
});

//make this component available to the app
export default NoScheduleComponent;
