import React, { useEffect } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
  FlatList,
} from "react-native";
import { ScrollView } from "react-native-virtualized-view";
import { COLORS } from "shared/constants/colors";
import { image } from "assets/image";
import Ionicons from "react-native-vector-icons/Ionicons";
import TextComponent from "components/Text";
import { sizes, TypeArticle } from "shared/constants/common";
import AntDesign from "react-native-vector-icons/AntDesign";
import { navigate } from "navigators";
import { DETAIL_ARTICLE, EVENT_ARTICLE, HOT_SERVICE_ARTICLE, NEW_SERVICE_ARTICLE, NOTIFICATION_SCREEN, USER_SCREEN } from "shared/constants/routeNames";
import { useDispatch } from "react-redux";
import { getUserRequest, selectUser } from "reduxCore/user/slice";
import { useSelector } from "react-redux";
import { selectAuth } from "reduxCore/auth/slice";
import LinearGradient from "react-native-linear-gradient";
import HeaderSection from "./component/headerSection";
import { isIOS, width } from "react-native-size-scaling";
import { apiClient } from "services/baseAxios";
import ApiConfig from "config/config";
import {
  getNotificationRequest,
  selectNotification,
} from "reduxCore/notification/slice";
import { helpers } from "shared/ultis/helpers";
import { getArticleRequest, getArticleHotServiceRequest, getArticleEventRequest, getArticleNewServiceRequest, selectArticle } from "reduxCore/article/slice";
import FastImage from "react-native-fast-image";
import SwiperFlatList from "react-native-swiper-flatlist";

interface Props {
  isUser: boolean;
}

const HomeScreen: React.FC<Props> = ({ isUser = true }) => {
  const dispatch = useDispatch();
  const { userId, tokenClaims } = useSelector(selectAuth);
  const { saleOffProgram, hotService, event, newService } =
    useSelector(selectArticle);
  const { name, memberShip } = useSelector(selectUser);
  const { newNotification } = useSelector(selectNotification);

  const onAckNotification = async () => {
    try {
      const res = await apiClient.post(
      `${ApiConfig.GET_NOTIFICATION}${userId}/ack`,
      null
    );
    const { Data, AppCode } = res;
    if (AppCode == 200) {
      navigate(NOTIFICATION_SCREEN, { showBack: true });
    }
    navigate(NOTIFICATION_SCREEN, { showBack: true });
    } catch (error) {
      navigate(NOTIFICATION_SCREEN, { showBack: true });
    }
  };
  useEffect(() => {
    dispatch(
      getArticleRequest({
        PageIndex: 1,
        PageSize: 0,
        SortBy: null,
        SortDirection: 0,
        Keyword: null,
        ArticleGroup: TypeArticle.SaleOffProgram,
        DateFrom: null,
        DateTo: null,
        IsActive: true,
      })
    );
    dispatch(
      getArticleHotServiceRequest({
        PageIndex: 1,
        PageSize: 4,
        SortBy: null,
        SortDirection: 0,
        Keyword: null,
        ArticleGroup: TypeArticle.HotService,
        DateFrom: null,
        DateTo: null,
        IsActive: true,
      })
    );
    dispatch(
      getArticleEventRequest({
        PageIndex: 1,
        PageSize: 0,
        SortBy: null,
        SortDirection: 0,
        Keyword: null,
        ArticleGroup: TypeArticle.Event,
        DateFrom: null,
        DateTo: null,
        IsActive: true,
      })
    );
    dispatch(
      getArticleNewServiceRequest({
        PageIndex: 1,
        PageSize: 0,
        SortBy: null,
        SortDirection: 0,
        Keyword: null,
        ArticleGroup: TypeArticle.NewService,
        DateFrom: null,
        DateTo: null,
        IsActive: true,
      })
    );
    dispatch(
      getNotificationRequest({
        userId: userId,
        pageIndex: 1,
        pageSize: 10,
      })
    );
  }, []);

  const onDetailArticle = (item: any) => () => {
    navigate(DETAIL_ARTICLE, item);
  }

  const renderItemSwiper = ({ item, index }: any) => {
    return (
      <View style={[styles.child]} key={index +Math.random()} >
        <FastImage
          source={{ uri: item?.ArticleImg }}
          style={{ width: width, height: width * 0.53 }}
          resizeMode="cover"
        />
        <LinearGradient
          colors={["rgba(160,174,206,0)", COLORS.DarkCornflowerBlue]}
          style={styles.button}
          start={{ x: 0, y: 1 }}
          end={{ x: 1, y: 1 }}
          locations={[0, 1]}
        >
          <TouchableOpacity
            style={{ flexDirection: "row", alignItems: "center" }}
            onPress = {onDetailArticle(item)}
          >
            <TextComponent color={COLORS.White}>Chi tiết</TextComponent>
            <AntDesign
              name="right"
              color={COLORS.White}
              style={{ paddingHorizontal: 5 }}
            />
          </TouchableOpacity>
        </LinearGradient>
      </View>
    );
  };

  const renderHotService = ({ item, index }: any) => {
    return (
      <TouchableOpacity style={{ flex: 1, alignItems: "center", paddingBottom: 16 }} onPress = {onDetailArticle(item)}  key={index +Math.random()}>
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

  const renderEvent = ({ item, index }: any) => {
    return (
      <View  key={index +Math.random()} style={{ flex: 1, alignItems: "center", paddingBottom: 16 }}>
        <View style={{ paddingRight: 16, borderRadius: 12, }}>
          <FastImage
            source={{ uri: item.ArticleImg }}
            style={{ width: 290, height: 290 * 0.55, borderRadius: 12, }}
            resizeMode="cover"
          />
          <View style={styles.service}>
            <TouchableOpacity style={[styles.center, styles.buttonService]} onPress = {onDetailArticle(item)}>
              <TextComponent>XEM NGAY</TextComponent>
              <AntDesign name="right" style={{ paddingHorizontal: 5 }} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const renderNewService = ({ item, index }: any) => {
    return (
      <TouchableOpacity  key={index +Math.random()} style={{ alignItems: "center", paddingBottom: 16 }} onPress = {onDetailArticle(item)}>
        <View style={{ paddingRight: 16 }}>
          <FastImage
            source={{ uri: item.ArticleImg }}
            style={{ width: 120, height: 120, borderRadius: 10 }}
            resizeMode="cover"
          />
          <LinearGradient
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              right: 16,
              left: 0,
              borderRadius: 10,
            }}
            start={{ x: 1, y: 0 }} end={{ x: 1, y: 1 }}
            colors={["rgba(0, 0, 0, 0)", COLORS.YankeesBlue]}
          ></LinearGradient>
        </View>
        <View style={styles.newService}>
          <TextComponent color={COLORS.White}>{item?.Title}</TextComponent>
        </View>
      </TouchableOpacity>
    );
  };


  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
    >
      <View
        style={{
          paddingBottom: 0,
          marginTop: 64,
          backgroundColor: COLORS.White,
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            paddingHorizontal: 16,
            paddingVertical: 9,
          }}
        >
          <View style={{ paddingVertical: 9 }}>
            <FastImage source={image.logo} style = {{width: 120, height: 24}} resizeMode = "contain"/>
          </View>
          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity
              style={{ padding: 9 }}
              onPress={onAckNotification}
            >
              <Ionicons name="notifications-outline" size={20} />
              {newNotification > 0 && (
                <View
                  style={{
                    backgroundColor: "red",
                    alignItems: "center",
                    justifyContent:'center',
                    borderRadius: 100,
                    position: "absolute",
                    width: 8,
                    height: 8,
                    right: 5,
                    top: 10
                  }}
                >
                </View>
              )}
            </TouchableOpacity>
            {isUser ? (
              <TouchableOpacity
                style={{ padding: 9 }}
                onPress={() => {
                  navigate(USER_SCREEN, { showBack: true });
                  dispatch(getUserRequest(userId));
                }}
              >
                <Ionicons name="person-outline" size={20} />
              </TouchableOpacity>
            ) : (
              <View />
            )}
          </View>
        </View>
        <View style={{ paddingHorizontal: 16, paddingBottom: 9 }}>
          <TextComponent fontSize={sizes[3]}>{helpers.textTime()}</TextComponent>
          <TextComponent fontSize={sizes[4]} style={{ fontWeight: "500" }}>
             {name == "" ? `Chị ${tokenClaims.name}` : `Chị ${name}`}{memberShip && <TextComponent color={memberShip === 'VVIP' ? COLORS.BrownYellow : COLORS.Tertiary}> - {memberShip}</TextComponent>}
          </TextComponent>
        </View>
        <View style={{ flex: 1 }}>
          <SwiperFlatList
            keyExtractor={(item, index) => String(item) + Math.random()}
            key={`swipper-${width}`}
            autoplay
            autoplayDelay={2}
            autoplayLoop
            data={saleOffProgram}
            showPagination
            renderItem={renderItemSwiper}
          />
        </View>
        <View>
          <HeaderSection onPress={() => navigate(HOT_SERVICE_ARTICLE)}/>
          <FlatList
            scrollEnabled={false}
            style={{ paddingHorizontal: 8 }}
            data={hotService}
            keyExtractor={(item, index) => String(item) + Math.random()}
            numColumns={2}
            renderItem={renderHotService}
          />
        </View>
        <View>
          <HeaderSection title="Sự kiện" onPress={() => navigate(EVENT_ARTICLE)}/>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ marginHorizontal: 16, marginRight: 16 }}
            data={event}
            keyExtractor={(item,index: number) => item.toString() + Math.random()}
            renderItem={renderEvent}
          />
        </View>
        <View>
          <HeaderSection title="Dịch vụ mới" onPress={() => navigate(NEW_SERVICE_ARTICLE)}/>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ marginHorizontal: 16, marginRight: 16 }}
            data={newService}
            keyExtractor={(index: number) => index.toString() + Math.random()}
            renderItem={renderNewService}
          />
        </View>
      </View>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.YankeesBlue,
  },
  textDetail: {
    paddingLeft: 5,
    color: COLORS.Gray,
  },
  button: {
    position: "absolute",
    padding: isIOS ? 10 : 5,
    borderRadius: 8,
    alignItems: "center",
    bottom: 20,
    right: 20,
  },
  center: { flexDirection: "row", alignItems: "center" },
  service: {
    position: "absolute",
    left: 8,
    bottom: 16,
    justifyContent: "space-between",
  },
  newService: {
    position: "absolute",
    left: 8,
    bottom: 24,
    justifyContent: "space-between",
    right: 20
  },
  buttonService: {
    backgroundColor: COLORS.AzureishWhite,
    paddingVertical: isIOS ? 5 : 0,
    borderRadius: 100,
    paddingHorizontal: 10,
    width: 100,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 8,
    marginVertical: 10,
    padding: 16,
    paddingBottom: 0,
    margin: 8,
  },
  shadowProp: {
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowRadius: 5,
    shadowOpacity: 8,
    shadowColor: "rgba(34, 34, 34, 0.15)",
  },
  commonDetail: {
    flexDirection: "row",
    paddingVertical: 2,
    alignItems: "center",
    flex: 1,
  },
  child: { width: width, justifyContent: "center" },

});

export default HomeScreen;
