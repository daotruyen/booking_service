//import liraries
import { icon } from "assets/icon";
import { image } from "assets/image";
import TextComponent from "components/Text";
import moment from "moment";
import React, { Component } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { COLORS } from "shared/constants/colors";
import { sizes } from "shared/constants/common";
import { helpers } from "shared/ultis/helpers";

// create a component
const PurchaseHistoryItem = (props: any) => {
  const { item } = props;
  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "row" }}>
        <Image source={image.image} style={{ width: 42, height: 42 }} />
        <View style={{ flex: 1, paddingLeft: 8, justifyContent: 'space-between' }}>
          <TextComponent
            numberOfLines={1}
            style={{ color: COLORS.YankeesBlue, lineHeight: 18 }}
            fontSize={sizes[4]}
          >
            {item.ProductName}
          </TextComponent>
          <View style={styles.rowSpaceBetween}>
            <View style={styles.rowSection}>
              <Image source={icon.icon_pay} style ={{width: 14, height: 14}}/>
              <TextComponent
                numberOfLines={1}
                style={styles.textDetail}
                fontSize={sizes[3]}
              >
                {helpers.currencyFormat(item.Price)}đ
              </TextComponent>
            </View>
            <View style={styles.rowSection}>
              <Ionicons name="time" color={COLORS.YankeesBlue} size = {16}/>
              <TextComponent
                numberOfLines={1}
                style={styles.textDetail}
                fontSize={sizes[3]}
              >
                {item.PaymentDate != null ? moment.utc(item.PaymentDate).format('DD/MM/YYYY') : ""}
              </TextComponent>
            </View>
          </View>

        </View>
      </View>
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: COLORS.Grayscale,
    padding: 8,
    paddingVertical: 8,
    borderRadius: 8,
    width: "100%",
  },
  rowSpaceBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rowSection: {
    flexDirection: "row",
    paddingVertical: 2,
    alignItems: "center",
    lineHeight: 20,
  },
  textDetail: {
    paddingLeft: 5,
    color: COLORS.Gray,
    lineHeight: 20,

  },
});

//make this component available to the app
export default PurchaseHistoryItem;
