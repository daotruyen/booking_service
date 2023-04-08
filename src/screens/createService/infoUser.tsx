//import liraries
import BottomSheet, { BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import { Portal } from "@gorhom/portal";
import Button from "components/CustomButton";
import FlatListComponent from "components/FlatList";
import Header from "components/Headers";
import InputCustom from "components/input";
import TextComponent from "components/Text";
import moment from "moment";
import { navigate } from "navigators";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { View, StyleSheet, TouchableOpacity, Keyboard } from "react-native";
import FlashMessage, { showMessage } from "react-native-flash-message";
import { SceneMap, TabBar, TabView } from "react-native-tab-view";
import { useSelector } from "react-redux";
import { selectCreateService } from "reduxCore/createService/slice";
import PurchaseHistoryItem from "screens/purchaseHistory/purchaseHistoryItem";
import { TreatmentItemComponent } from "screens/treatment/treatmentItem";
import { COLORS } from "shared/constants/colors";
import { sizes } from "shared/constants/common";
import { purchaseHistoryRoutes } from "shared/constants/routeNames";
import { width } from "shared/metrics";
import CreatePurchaseComponent from "./component/createPurchase";
import CreateServiceComponent from "./component/createService";

// create a component
const InfoUserScreen = (props: any) => {
  const { route } = props;
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [indexBottomSheet, setIndexBottomSheet] = React.useState(0);
  const { purchase, service } = useSelector(selectCreateService);
  const infoCustomer = `${route.params.Fullname} - ${route.params?.PhoneNumber} - ${route.params.MembershipClass}`;
  const [nameInput, setName] = useState(infoCustomer);
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: "first", title: "Sản phẩm" },
    { key: "second", title: "Dịch vụ" },
  ]);
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

  const [routesBottomSheet] = React.useState([
    { key: "first", title: "Sản phẩm" },
    { key: "second", title: "Dịch vụ" },
  ]);
  const snapPoints = useMemo(() => ["1","60%"], []);
  const handleSnapPress = useCallback((index: number) => {
    Keyboard.dismiss()
    bottomSheetRef.current?.snapToIndex(index);
  }, []);
  const handleSheetChanges = useCallback((_index: number) => {}, []);

  const renderServiceItem = ({ item }: any) => (
    <View style={{ marginBottom: 16 }}>
      <TreatmentItemComponent treatmentItem={item} isShowListSession={true} />
    </View>
  );

  const renderPurchaseHistoryItem = ({ item }: any) => {
    return (
      <TouchableOpacity
        style={{ marginBottom: 16 }}
        onPress={() =>
          navigate(purchaseHistoryRoutes.PURCHASE_DETAIL, { item })
        }
      >
        <PurchaseHistoryItem item={item} />
      </TouchableOpacity>
    );
  };

  const renderTabBar = (props: any) => (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: COLORS.YankeesBlue }}
      style={{
        backgroundColor: COLORS.White,
        justifyContent: "center",
      }}
      tabStyle={{}}
      activeColor={COLORS.YankeesBlue}
      inactiveColor={COLORS.PhilippineSilver}
      bounces={false}
    />
  );

  const renderTabBarInBottomSheet = (props: any) => (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: COLORS.YankeesBlue }}
      style={{
        backgroundColor: COLORS.White,
        justifyContent: "center",
      }}
      tabStyle={{}}
      activeColor={COLORS.YankeesBlue}
      inactiveColor={COLORS.PhilippineSilver}
      bounces={false}
    />
  );

  const renderScene = SceneMap({
    first: () => (
      <View style={{ padding: 16, paddingBottom: 0 }}>
        <FlatListComponent
          data={purchase}
          renderItem={renderPurchaseHistoryItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
        />
      </View>
    ),
    second: () => (
      <View style={{ padding: 16, paddingBottom: 0 }}>
        <FlatListComponent
          data={sortedDateServices}
          renderItem={renderServiceItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
        />
      </View>
    ),
  });

  const handleCancel = () => {
    Keyboard.dismiss()
    bottomSheetRef.current?.close();
  };

  const showNotiSuccess = () => {
    setTimeout(() => {
      showMessage({
        message: "🎉 Thêm sản phẩm thành công",
        description: `Thông tin sản phẩm đã được thêm vào thông tin tài khoản của khách hàng ${nameInput} `,
        type: "success",
      });
    }, 1000);
  };

  const renderSceneInBottomSheet = SceneMap({
    first: () => (
      <CreatePurchaseComponent
        userId={route.params.UserId}
        handelCancel={handleCancel}
        showNotiSuccess={showNotiSuccess}
      />
    ),
    second: () => (
      <CreateServiceComponent
        userId={route.params.UserId}
        handelCancel={handleCancel}
        showNotiSuccess={showNotiSuccess}
      />
    ),
  });

  return (
    <View style={styles.container}>
      <Header showBack iconRight />
      <View style={{ flex: 1 }}>
      <View style={{ padding: 16, paddingBottom: 0 }}>
        <InputCustom
          wrapperStyle={{ marginBottom: 16 }}
          title="Thông tin khách hàng"
          placeholder="Khách hàng"
          value={nameInput}
          onChangeText={(text) => setName(text)}
          editable={false}
        />
      </View>
      <View style={{ flex: 1 }}>
        <TabView
          renderTabBar={renderTabBar}
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={(index) => {
            setIndex(index);
          }}
          initialLayout={{ width: width, height: 1000 }}
        />
      </View>
      <Button
        label="Thêm sản phẩm/dịch vụ"
        style={styles.button}
        onPress={() => handleSnapPress(1)}
      />
      </View>
      <Portal>
        <BottomSheet
          ref={bottomSheetRef}
          index={-1}
          snapPoints={snapPoints}
          onChange={(indexBottomSheet) => {
            handleSheetChanges(indexBottomSheet);
          }}
          enablePanDownToClose={true}
          backdropComponent={BottomSheetBackdrop}
          style={{ zIndex: 99 }}
        >
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <TextComponent fontSize={sizes[5]}>
              Thêm sản phẩm/dịch vụ
            </TextComponent>
          </View>
          <TabView
            renderTabBar={renderTabBarInBottomSheet}
            navigationState={{
              index: indexBottomSheet,
              routes: routesBottomSheet,
            }}
            renderScene={renderSceneInBottomSheet}
            onIndexChange={(indexBottomSheet) => {
              setIndexBottomSheet(indexBottomSheet);
              handleSnapPress(1);
            }}
            initialLayout={{}}
          />
        </BottomSheet>
      </Portal>
      <FlashMessage position="top" />
    </View>
  );
};

// define your styles
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

//make this component available to the app
export default InfoUserScreen;
