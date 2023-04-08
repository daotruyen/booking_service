//import liraries
import Header from "components/Headers";
import TextComponent from "components/Text";
import ApiConfig from "config/config";
import { navigate } from "navigators";
import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import FastImage from "react-native-fast-image";
import FlashMessage, { showMessage } from "react-native-flash-message";
import { isIOS, width } from "react-native-size-scaling";
import { apiClient } from "services/baseAxios";
import { COLORS } from "shared/constants/colors";
import { sizes, TypeArticle } from "shared/constants/common";
import { DETAIL_ARTICLE } from "shared/constants/routeNames";

// create a component
const EventScreen = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState<any>([]);
  const [dataPage, setDataPage] = useState(true);

  const getEvent = async () => {
    const res = await apiClient.post(ApiConfig.GET_ARTICLE, {
      PageIndex: currentPage,
      PageSize: 0,
      SortBy: null,
      SortDirection: 0,
      Keyword: null,
      ArticleGroup: TypeArticle.Event,
      DateFrom: null,
      DateTo: null,
      IsActive: true,
    });
    const { AppCode, Data } = res;
    if (AppCode === 200) {
      const dataEvent: any[] = [...data, ...Data.ListOut];
      setData(dataEvent);
      if(Data.TotalCount === Data.PageEnd || Data.PageEnd > Data.TotalCount) {
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
    getEvent();
  }, [currentPage]);

  const onDetailArticle = (item: any) => () => {
    navigate(DETAIL_ARTICLE, item);
  }

  const onLoadMore = () => {
    setCurrentPage(currentPage + 1);
  };

  const renderEvent = ({ item }: any) => {
    return (
      <TouchableOpacity style={{ flex: 1, paddingBottom: 16 }} onPress = {onDetailArticle(item)}>
        <View style={{ alignItems:'center' }}>
          <FastImage
            source={{ uri: item.ArticleImg }}
            style={{ width: width - 32, height: (width - 32) * 0.55, borderRadius: 10 }}
            resizeMode="contain"
          />
        </View>
        <View>
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
      <View style={{ flex: 1 }}>
        <TextComponent bold fontSize={sizes[4]} style={{ padding: 10 }}>
          Sự kiện
        </TextComponent>
        <FlatList
          showsVerticalScrollIndicator={false}
          style={{ marginHorizontal: 16, marginRight: 16, }}
          data={data}
          keyExtractor={(index: number) => index.toString()}
          renderItem={renderEvent}
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
  service: {
    position: "absolute",
    left: 28,
    bottom: 16,
    justifyContent: "space-between",
  },
  center: { flexDirection: "row", alignItems: "center" },
  button_service: {
    backgroundColor: COLORS.AzureishWhite,
    paddingVertical: isIOS ? 5 : 0,
    borderRadius: 100,
    paddingHorizontal: 10,
    width: 100,
  },
});

//make this component available to the app
export default EventScreen;
