import TextComponent from "components/Text";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  TouchableHighlightComponent,
  TouchableOpacity,
  View,
} from "react-native";
import Header from "components/Headers";
import { HSearchBar } from "components/SearchBar";
import { Tab } from "@rneui/themed";
import { COLORS } from "shared/constants/colors";
import sharedStyles from "shared/constants/styles";
import { TreatmentItemComponent } from "screens/treatment/treatmentItem";
import FlatListComponent from "components/FlatList";
import { globalLoading } from "components";
import { apiClient } from "services/baseAxios";
import ApiConfig from "config/config";
import PurchaseHistoryItem from "./purchaseHistoryItem";
import { useSelector } from "react-redux";
import { selectAuth } from "reduxCore/auth/slice";
import { navigate } from "navigators";
import { purchaseHistoryRoutes } from "shared/constants/routeNames";

const TAB_PRODUCT_INDEX = 0,
  TAB_SERVICE_INDEX = 1;

export const PurchaseHistory = () => {
  const { userId, tokenClaims } = useSelector(selectAuth);
  const [search, setSearch] = useState("");
  const [searchPurchase, setSearchPurchase] = useState("");
  const [tabIndex, setTabIndex] = React.useState(TAB_PRODUCT_INDEX);
  const [listService, setListService] = React.useState([]);
  const [listPurchaseHistory, setListPurchaseHistory] = React.useState([]);

  const updateSearch = (search: any) => {
    if (tabIndex == TAB_PRODUCT_INDEX) {
      setSearchPurchase(search);
    } else {
      setSearch(search);
    }
    handleGetData();
  };

  const handleChangeTab = (e: number) => {
    setTabIndex(e);
    handleGetData();
  };

  const handleGetData = () => {
    switch (tabIndex) {
      case TAB_PRODUCT_INDEX:
        getPurchaseHistory(searchPurchase);
        break;
      case TAB_SERVICE_INDEX:
        getPurchasedServiceOfUser(search);
        break;
    }
  };

  /**
   * Lấy danh sách sản phẩm đã mua được lọc theo tên
   * @param keyword
   */
  const getPurchasedServiceOfUser = async (keyword: string) => {
    globalLoading.show();
    let res = await apiClient.post(ApiConfig.GET_SERVICE_OF_USER, {
      Keyword: keyword,
      Status: null,
      UserId: tokenClaims.user_id
    });
    globalLoading.hide();
    if (res?.AppCode == 200 && res?.Success) {
      setListService(res.Data);
    } else {
      setListService([]);
    }
  };

  const getPurchaseHistory = async (keyword: string = "") => {
    globalLoading.show();
    const res = await apiClient.post(ApiConfig.GET_PURCHASE_HISTORY, {
      PageIndex: 0,
      PageSize: 0,
      SortBy: "string",
      SortDirection: 0,
      UserId: userId,
      IsPaging: false,
      Keyword: keyword,
    });
    globalLoading.hide();
    if (res?.AppCode == 200 && res?.Success) {
      setListPurchaseHistory(res.Data);
    } else {
      setListPurchaseHistory([]);
    }
  };
  const renderServiceItem = ({ item }: any) => (
    <View style={{ marginBottom: 16 }}>
      <TreatmentItemComponent treatmentItem={item} />
    </View>
  );

  const renderPurchaseHistoryItem = ({ item }: any) => {
    return (
      <TouchableOpacity
        style={{ marginBottom: 16 }}
        onPress={() => navigate(purchaseHistoryRoutes.PURCHASE_DETAIL, { item })}
      >
        <PurchaseHistoryItem item={item} />
      </TouchableOpacity>
    );
  };

  useEffect(() => {
    handleGetData();
  }, [tabIndex, search, searchPurchase]);

  return (
    <View style={styles.container}>
      <Header title="" />
      <HSearchBar
        placeholder={
          tabIndex == TAB_PRODUCT_INDEX
            ? "Tìm kiếm sản phẩm..."
            : "Tìm kiếm dịch vụ..."
        }
        onChangeText={updateSearch}
        value={tabIndex == TAB_PRODUCT_INDEX ? searchPurchase : search}
      />
      <View>
        <Tab
          indicatorStyle={{
            backgroundColor: COLORS.YankeesBlue,
            height: 2,
          }}
          value={tabIndex}
          onChange={(e) => handleChangeTab(e)}
          dense
        >
          <Tab.Item titleStyle={tabIndex == 0 ? sharedStyles.tabTitleActive : sharedStyles.tabTitleStyle}>
            Sản Phẩm
          </Tab.Item>
          <Tab.Item titleStyle={tabIndex == 1 ? sharedStyles.tabTitleActive : sharedStyles.tabTitleStyle}>
            Dịch Vụ
          </Tab.Item>
        </Tab>
      </View>
      <ScrollView style={{ padding: 16, marginBottom: 16 }}>
        <TextComponent
          style={{ marginBottom: 16, fontSize: 16, fontWeight: "500" }}
        >
          {tabIndex == TAB_PRODUCT_INDEX ? "Sản Phẩm Đã Mua" : "Dịch Vụ Đã Mua"}
        </TextComponent>
        {tabIndex == TAB_PRODUCT_INDEX && (
          <FlatListComponent
            data={listPurchaseHistory}
            renderItem={renderPurchaseHistoryItem}
            keyExtractor={(item) => item.id}
          />
        )}
        {tabIndex == TAB_SERVICE_INDEX && (
          <FlatListComponent
            data={listService}
            renderItem={renderServiceItem}
            keyExtractor={(item) => item.id}
          />
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.White,
  },
});
