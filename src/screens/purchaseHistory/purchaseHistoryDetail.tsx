//import liraries
import { image } from "assets/image";
import Header from "components/Headers";
import TextComponent from "components/Text";
import moment from "moment";
import React from "react";
import { View, StyleSheet, Image } from "react-native";
import { COLORS } from "shared/constants/colors";
import { sizes } from "shared/constants/common";
import { helpers } from "shared/ultis/helpers";

// create a component
const PurchaseHistoryDetail = (props: any) => {
  const { route, navigation } = props;
  const { item } = route.params;
  return (
    <View style={styles.container}>
      <Header showBack />
      <View style={[{ padding: 16, margin: 16 }, styles.session]}>
        <TextComponent
          color={COLORS.BrownYellow}
          fontSize={sizes[4]}
          style={{ paddingBottom: 12 }}
        >
          Thông Tin Sản Phẩm
        </TextComponent>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingBottom: 12,
          }}
        >
          <Image
            source={image.image}
            style={{ width: 30, height: 30, marginRight: 8 }}
          />
          <TextComponent fontSize={sizes[4]}>{item.ProductName}</TextComponent>
        </View>
        <View style={styles.spaceBetween}>
          <TextComponent color={COLORS.Gray}>
            Giá tiền:
          </TextComponent>
          <TextComponent>{helpers.currencyFormat(item.Price)}đ</TextComponent>
        </View>
        <View style={styles.spaceBetween}>
          <TextComponent color={COLORS.Gray}>
            Thời gian mua
          </TextComponent>
          <TextComponent>
            {item.PaymentDate != null
              ? moment.utc(item.PaymentDate).format("DD/MM/YYYY")
              : ""}
          </TextComponent>
        </View>
        <View>
          <TextComponent
            style={{ paddingBottom: 8 }}
            color={COLORS.Gray}
          >
            Hướng dẫn sử dụng:
          </TextComponent>
          <TextComponent style={{ lineHeight: 20, fontWeight: "400" }}>
            {item.Instruction}
          </TextComponent>
        </View>
      </View>
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.White,
  },
  spaceBetween: {
    justifyContent: "space-between",
    flexDirection: "row",
    paddingBottom: 12,
  },
  session: {
    borderRadius: 8,
    shadowColor: "rgba(34, 34, 34, 0.15)",
    shadowOpacity: 0.8,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    elevation: 1,
    backgroundColor: COLORS.White,
  },
});

//make this component available to the app
export default PurchaseHistoryDetail;
