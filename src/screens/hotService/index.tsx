//import liraries
import Header from "components/Headers";
import TextComponent from "components/Text";
import ApiConfig from "config/config";
import { navigate } from "navigators";
import React, { Component, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import FastImage from "react-native-fast-image";
import FlashMessage, { showMessage } from "react-native-flash-message";
import { width } from "react-native-size-scaling";
import { useSelector } from "react-redux";
import { selectArticle } from "reduxCore/article/slice";
import { apiClient } from "services/baseAxios";
import { COLORS } from "shared/constants/colors";
import { sizes, TypeArticle } from "shared/constants/common";
import { DETAIL_ARTICLE } from "shared/constants/routeNames";

// create a component
const HotServiceScreen = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState<any>([]);
  const [dataPage, setDataPage] = useState(true);

  const getHotService = async () => {
    const res = await apiClient.post(ApiConfig.GET_ARTICLE, {
      PageIndex: currentPage,
      PageSize: 0,
      SortBy: null,
      SortDirection: 0,
      Keyword: null,
      ArticleGroup: TypeArticle.HotService,
      DateFrom: null,
      DateTo: null,
      IsActive: true,
    });
    const { AppCode, Data } = res;

    if (AppCode === 200) {
      const dataEvent: any[] = [...data ,...Data.ListOut,];
      setData(dataEvent);
      if (Data.TotalCount === Data.PageEnd || Data.PageEnd > Data.TotalCount) {
        setDataPage(false);
      }
    } else {
      showMessage({
        message: "Lấy thông tin thất bại",
        description: "Có lỗi xảy ra.",
        type: "danger",
      });
    }
  };

  useEffect(() => {
    if(dataPage) {
      getHotService();
    }
    
  }, [currentPage]);

  const onDetailArticle = (item: any) => () => {
    navigate(DETAIL_ARTICLE, item);
  }

  const onLoadMore = () => {
    setCurrentPage(currentPage + 1);
  };

  const renderHotService = ({ item }: any) => {
    return (
      <TouchableOpacity style={{  paddingBottom: 16 }} onPress = {onDetailArticle(item)}>
        <View>
          <FastImage
            source={{ uri: item?.ArticleImg }}
            style={{
              width: width / 2 - 16,
              height: width / 2 - 16,
              borderRadius: 10,
            }}
            resizeMode="cover"
          />
          <TextComponent
            fontSize={sizes[3]}
            style={{
              textAlign: "left",
              lineHeight: 22,
            }}
          >
            {item?.Title}
          </TextComponent>
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <View style={styles.container}>
      <Header showBack/>
      <View style={styles.container}>
        <TextComponent bold fontSize={sizes[4]} style={{ padding: 10 }}>
          Dịch vụ hot
        </TextComponent>
        <FlatList
          style={{ paddingHorizontal: 8, }}
          data={data}
          keyExtractor={(item, index) => String(index)}
          numColumns={2}
          columnWrapperStyle={styles.row}
          renderItem={renderHotService}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={() =>
            dataPage == true ? (
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  paddingBottom: 20,
                }}
              >
                <TouchableOpacity
                  style={{
                    padding: 10,
                    backgroundColor: COLORS.YankeesBlue,
                    width: 100,
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 10,
                  }}
                  onPress={onLoadMore}
                >
                  <TextComponent color={COLORS.White}>Xem thêm</TextComponent>
                </TouchableOpacity>
              </View>
            ) : (
              <View />
            )
          }
        />
      </View>
      <FlashMessage position="top" />
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  row: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems:'flex-start'
}
});

//make this component available to the app
export default HotServiceScreen;
