//import liraries
import FlatListComponent from "components/FlatList";
import Header from "components/Headers";
import InputCustom from "components/input";
import TextComponent from "components/Text";
import moment from "moment";
import React, { useMemo, useState } from "react";
import { View, StyleSheet } from "react-native";
import FlashMessage from "react-native-flash-message";
import { useSelector } from "react-redux";
import { selectCreateService } from "reduxCore/createService/slice";
import { TreatmentItemComponent } from "screens/treatment/treatmentItem";
import { COLORS } from "shared/constants/colors";

// create a component
const UpdateSessionScreen = (props: any) => {
  const { route, navigation } = props;
  const {  service } = useSelector(selectCreateService);
  const infoCustomer = `${route.params.Fullname} - ${route.params?.PhoneNumber} - ${route.params.MembershipClass}`;

  const serviceTest: any[] = [...service];

  const serviceDoing = useMemo(() => {
    return serviceTest.filter((_value) => _value.Status === "Doing");
  }, [service]);

  const sortedDateServices = useMemo(
    () =>
    serviceDoing
        ?.map((obj) => {
          return { ...obj, TimeStart: new Date(obj.TimeStart) };
        })
        .sort((a, b) => b.TimeStart - a.TimeStart),
    [serviceDoing]
  );

  const  renderServiceItem = ({ item }: any) => (
    <View style={{ marginBottom: 16 }}>
      <TreatmentItemComponent treatmentItem={item} isShowListSession={true} userId = {route.params?.UserId}/>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header showBack iconRight />
      <View style={{ flex: 1, padding: 16, paddingBottom: 0 }}>
        <InputCustom
          wrapperStyle={{ marginBottom: 16 }}
          title="Thông tin khách hàng"
          placeholder="Khách hàng"
          value={infoCustomer}
          editable={false}
        />
        <View style={{ flex: 1 }}>
          <TextComponent style={{ paddingBottom: 12 }}>
            Dịch Vụ Đang Làm
          </TextComponent>
          <FlatListComponent
            data={sortedDateServices}
            renderItem={renderServiceItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </View>
      <FlashMessage position="top" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.White,
  },
  button: {
    marginHorizontal: 16,
    marginVertical: 5,
    height: 40,
    padding: 0,
    justifyContent: "center",
  },
});

export default UpdateSessionScreen;
