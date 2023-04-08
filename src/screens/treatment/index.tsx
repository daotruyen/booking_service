import {
  View,
  StyleSheet,
  StatusBar,
  ScrollView,
} from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import Header from "components/Headers";
import { Tab } from '@rneui/themed';
import { COLORS } from "shared/constants/colors";
import sharedStyles from "shared/constants/styles";
import FlatListComponent from "components/FlatList";
import { TreatmentItemComponent } from "./treatmentItem";
import { apiClient } from "services/baseAxios";
import { globalLoading } from 'components';
import { ServiceUserStatus } from "shared/constants/status";
import { HSearchBar } from "components/SearchBar";
import ApiConfig from "config/config";
import { debounce } from "shared/function";
import { useSelector } from "react-redux";

const TreatmentScreen = () => {
  const [search, setSearch] = useState("");
  const [listTreatment, setListTreatment] = useState([]);
  const [tabIndex, setTabIndex] = React.useState(0);

  var { tokenClaims } = useSelector((state: any) => state.auth);

  const updateSearch = (search: any) => {
    setSearch(search);
    debounceGetTreatment(search);
  };


  const handleChangeTab = (e: number) => {
    setTabIndex(e);
  }

  const renderItem = ({ item }: any) => (
    <View style={{ marginBottom: 16 }}>
      <TreatmentItemComponent isShowListSession={true} treatmentItem={item} />
    </View>
  );

  const getTreatment = async (keyword: string | null) => {
    globalLoading.show();
    let res = await apiClient.post(ApiConfig.GET_SERVICE_OF_USER, { Keyword: keyword, Status: tabIndex == 0 ? null : ServiceUserStatus.DOING, UserId: tokenClaims.user_id });
    globalLoading.hide();
    if (res?.AppCode == 200 && res?.Success) {
      setListTreatment(res.Data);
    }
    else {
      setListTreatment([]);
    }
  }

  const debounceGetTreatment = useCallback(debounce(getTreatment, 350), []);

  useEffect(() => {
    getTreatment(null);
  }, []);

  useEffect(() => {
    getTreatment(search);
  }, [tabIndex]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle='light-content' />
      <Header title="" />
      <HSearchBar
        placeholder="Tìm kiếm liệu trình.."
        onChangeText={updateSearch}
        value={search}
      />
      <View>
        <Tab indicatorStyle={{
          backgroundColor: COLORS.YankeesBlue,
          height: 2,
        }}
          value={tabIndex}
          onChange={(e) => handleChangeTab(e)} dense
        >
          <Tab.Item
            titleStyle={tabIndex == 0 ? sharedStyles.tabTitleActive : sharedStyles.tabTitleStyle}>
            Tất Cả
          </Tab.Item>
          <Tab.Item titleStyle={tabIndex == 1 ? sharedStyles.tabTitleActive : sharedStyles.tabTitleStyle}>Đang Làm</Tab.Item>
        </Tab>
      </View>
      <ScrollView style={{ padding: 16, marginBottom: 16 }}>
        <FlatListComponent data={listTreatment} renderItem={renderItem}
          keyExtractor={item => item.id} />
      </ScrollView>
    </View>);
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.White,
  },
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
  commonDetail: {
    flexDirection: 'row',
    paddingVertical: 2,
  },
  textDetail: {
    paddingLeft: 5,
    color: COLORS.Gray
  }
});

export default TreatmentScreen;
