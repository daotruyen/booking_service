//import liraries
import Header from "components/Headers";
import TextComponent from "components/Text";
import ApiConfig from "config/config";
import { navigate } from "navigators";
import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import FastImage from "react-native-fast-image";
import FlashMessage, { showMessage } from "react-native-flash-message";
import { isIOS, width } from "react-native-size-scaling";
import { apiClient } from "services/baseAxios";
import { COLORS } from "shared/constants/colors";
import { sizes, TypeArticle } from "shared/constants/common";
import { DETAIL_ARTICLE } from "shared/constants/routeNames";

// create a component
const SaleOffProgramScreen = () => {
  // const { saleOffProgram } = useSelector(selectArticle);
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState<any>([]);
  const [dataPage, setDataPage] = useState(true);

  const getSaleOffProgram = async () => {
    const res = await apiClient.post(ApiConfig.GET_ARTICLE, {
      PageIndex: currentPage,
      PageSize: 0,
      SortBy: null,
      SortDirection: 0,
      Keyword: null,
      ArticleGroup: TypeArticle.SaleOffProgram,
      DateFrom: null,
      DateTo: null,
      IsActive: true,
    });
    const { AppCode, Data } = res;
    if (AppCode === 200) {
      const dataSaleOff: any[] = [...data, ...Data.ListOut];
      setData(dataSaleOff);
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
    getSaleOffProgram();
  }, [currentPage]);

  const onLoadMore = () => {
    setCurrentPage(currentPage + 1);
  };

  const onDetailArticle = (item: any) => () => {
    navigate(DETAIL_ARTICLE, item);
  }

  const renderItem = ({ item }: any) => {
    return (
      <TouchableOpacity style={[styles.child]} onPress = {onDetailArticle(item)}>
        <View>
          <FastImage
            source={{ uri: item?.ArticleImg }}
            style={{ width: width - 32, height: (width - 32) * 0.53, borderRadius: 10, }}
            resizeMode="cover"
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
      <Header />
      <View style={{ flex: 1 }}>
        <TextComponent bold fontSize={sizes[4]} style={{ padding: 10 }}>
          Chương trình khuyến mãi
        </TextComponent>
        <FlatList
          showsVerticalScrollIndicator={false}
          style={{ marginHorizontal: 16, marginRight: 16 }}
          data={data}
          keyExtractor={(index: number) => index.toString()}
          renderItem={renderItem}
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
  button: {
    position: "absolute",
    padding: isIOS ? 10 : 5,
    borderRadius: 8,
    alignItems: "center",
    bottom: 20,
    right: 40,
  },
  child: { width: width, justifyContent: "center", paddingVertical: 10 },
  text: { fontSize: width * 0.5, textAlign: "center" },
});

//make this component available to the app
export default SaleOffProgramScreen;
