import { image } from "assets/image";
import React, {
  useRef,
  useMemo,
  useCallback,
  useEffect,
  useState,
} from "react";
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  ScrollView,
  TouchableWithoutFeedback,
  Pressable,
} from "react-native";
import BottomSheet, { BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import LoginScreen from "screens/login";
import RegisterScreen from "screens/register";
import Ionicons from "react-native-vector-icons/Ionicons";
import TextComponent from "components/Text";
import AntDesign from "react-native-vector-icons/AntDesign";
import { COLORS } from "shared/constants/colors";
import { sizes, TypeArticle } from "shared/constants/common";
import { Portal } from "@gorhom/portal";
import LinearGradient from "react-native-linear-gradient";
import { icon } from "assets/icon";
import HeaderSection from "screens/home/component/headerSection";
import { isIOS, width } from "react-native-size-scaling";
import ForgotPasswordScreen from "screens/forgotPassword";
import OTPScreen from "screens/OTP";
import ResetPasswordScreen from "screens/resetPassword";
import Modal from "react-native-modal";
import Button from "components/CustomButton";
import { helpers } from "shared/ultis/helpers";
import { SwiperFlatList } from "react-native-swiper-flatlist";
import FastImage from "react-native-fast-image";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import {
  getArticleEventRequest,
  getArticleHotServiceRequest,
  getArticleNewServiceRequest,
  getArticleRequest,
  selectArticle,
} from "reduxCore/article/slice";
import { navigate } from "navigators";
import { DETAIL_ARTICLE, ROUTE_EVENT_AUTH, ROUTE_SERVICE_AUTH } from 'shared/constants/routeNames';
import { RegisterModel } from "interfaces/RegisterModel";
import { apiClient } from "services/baseAxios";
import ApiConfig from "config/config";
import { globalLoading } from "components";
import { showMessage } from "react-native-flash-message";
import { useNavigation } from "@react-navigation/native";
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { GetFCMToken } from "shared/ultis/pushNotificationHelpers";

const VERIFYCATION_TYPE_FORGET_PASSWORD = 1;
const VERIFYCATION_TYPE_REGISTER_USER = 2;

// create a component
const IntroductionScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const { saleOffProgram, hotService, event, newService } =
    useSelector(selectArticle);
  const [screen, setScreen] = useState(0);
  const [index, setIndex] = React.useState(0);
  const [phoneResetPassword, setPhoneResetPassword] = useState("");
  const [timeToLive, setTimeToLive] = useState(0);
  const [verifiedUserToken, setVerifiedUserToken] = useState("");
  const [isModalVisible, setModalVisible] = useState(false);
  const [verificationType, setVerificationType] = useState(VERIFYCATION_TYPE_FORGET_PASSWORD);
  const [registerUserData, setRegisterUserData] = useState({} as RegisterModel);

  const [routes] = React.useState([
    { key: "first", title: "Đăng nhập" },
    { key: "second", title: "Đăng ký" },
  ]);

  const handleSnapPress = useCallback((index: number) => {
    bottomSheetRef.current?.snapToIndex(index);
  }, []);

  const handleCancel = () => {
    bottomSheetRef.current?.close();
  };

  const onRegisterUser = (registerModel: RegisterModel) => {
    setVerificationType(VERIFYCATION_TYPE_REGISTER_USER);
    setRegisterUserData(registerModel);

    // Handle gửi OTP về SĐT
    sendOTPForRegisterUser(registerModel.PhoneNumber)
  }

  // variables
  const snapPoints = useMemo(() => ["1", "60%", "80%"], []);
  const handleSheetChanges = useCallback((index: number) => {}, []);

  const renderScene = SceneMap({
    first: () => (
      <LoginScreen
        callBack={() => {
          setVerificationType(VERIFYCATION_TYPE_FORGET_PASSWORD);
          setScreen(1);
        }}
      />
    ),
    second: () => (
      <RegisterScreen
        onRegisterUser={onRegisterUser}
        callBack={(index: number) => {
          setIndex(index - 1);
          handleSnapPress(index);
        }}
      />
    ),
  });

  const onDetailArticle = (item: any) => () => {
    navigate(DETAIL_ARTICLE, item);
  }

  const renderItemSwiper = ({ item }: any) => {
    return (
      <View style={[styles.child]} key={index +Math.random()}>
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
    bottomSheetRef.current?.close();
  }, []);

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

  const renderHotService = ({ item, index }: any) => {
    return (
      <TouchableOpacity key={index +Math.random()} style={{ flex: 1, alignItems: "center", paddingBottom: 16 }} onPress = {onDetailArticle(item)}>
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
      <View key={index +Math.random()} style={{ flex: 1, alignItems: "center", paddingBottom: 16, borderRadius: 12, }}>
        <View style={{ paddingRight: 16, borderRadius: 12, }}>
          <FastImage
            source={{ uri: item.ArticleImg }}
            style={{ width: 290, height: 290 * 0.55, borderRadius: 12, }}
            resizeMode="cover"
          />
          <View style={styles.service}>
            <TouchableOpacity style={[styles.center, styles.buttonService, {backgroundColor: COLORS.White}]} onPress = {onDetailArticle(item)}>
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
      <TouchableOpacity key={index +Math.random()} style={{ alignItems: "center", paddingBottom: 16 }} onPress = {onDetailArticle(item)} >
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
  const sendOTPForRegisterUser = async (phoneNumber: string) => {
    globalLoading.show();
    try {
      const res = await apiClient.post(ApiConfig.REGISTER_VERIFICATION, {
      PhoneNumber: phoneNumber
    });
    globalLoading.hide();
    const { AppCode, Data } = res;
    if (AppCode == 200) {
      setTimeToLive(Data.TimeToLive);
      setScreen(2);
    }
    else {
      // Thông báo lỗi
      showMessage({
        message: "Thất bại",
        description: "Có lỗi xảy ra. Vui lòng thử lại sau giây lát!",
        type: "danger",
      });
    }
    } catch (error) {
      globalLoading.hide();
      showMessage({
        message: "Thất bại",
        description: "Có lỗi xảy ra. Vui lòng thử lại sau giây lát!",
        type: "danger",
      });
    }
    
  }

  const onCallBackPopOTPScreen = () => {
    if (verificationType === VERIFYCATION_TYPE_FORGET_PASSWORD) {
      setScreen(1);
    }
    else if (verificationType === VERIFYCATION_TYPE_REGISTER_USER) {
      setScreen(0);
    }
  }

  const onCallBackOTPScreen = async (token: string) => {
    setVerifiedUserToken(token);
    if (verificationType === VERIFYCATION_TYPE_FORGET_PASSWORD) {
      setScreen(3);
    }
    else if (verificationType === VERIFYCATION_TYPE_REGISTER_USER) {
      // Tạo mới tài khoản người dùng
      try {
        globalLoading.show();
        const model = { ...registerUserData, ...{ VerifiedUserToken: token } }
        const res = await apiClient.post(ApiConfig.SIGN_UP_VERIFIED_USER, model);
        globalLoading.hide();
        if (res.AppCode == 200) {
          // Thông báo thành công
          showMessage({
            message: "🎉 Đăng ký tài khoản khách thành công",
            description: "Thông tin tài khoản khách hàng đã được thêm.",
            type: "success",
          });
          setTimeout(() => {
            // Back về màn đăng nhập
            setIndex(0);
            handleSnapPress(1);
            setScreen(0);
          }, 1000)
        }
        else {
          // Thông báo lỗi
          showMessage({
            message: "Thất bại",
            description: "Có lỗi xảy ra. Vui lòng thử lại sau giây lát!",
            type: "danger",
          });
        }
      } catch (error) {
        globalLoading.hide();
        // Thông báo lỗi
        showMessage({
          message: "Thất bại",
          description: "Có lỗi xảy ra. Vui lòng thử lại sau giây lát!",
          type: "danger",
        });
      }
    }
  }

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
            <TouchableOpacity style={{ padding: 9, justifyContent: "center" }}>
              <Ionicons name="notifications-outline" size={20} />
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                padding: 9,
                justifyContent: "center",
              }}
            >
              <Image
                source={icon.icon_list}
                style={{ width: 16, height: 14 }}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ paddingHorizontal: 16, paddingBottom: 9 }}>
          <TextComponent fontSize={sizes[3]}>
            {helpers.textTime()}
          </TextComponent>
          <View>
            <TextComponent fontSize={sizes[2]}>
              Khách hàng của HKMedia,
              <TouchableWithoutFeedback
                style={{ marginBottom: -3, backgroundColor: "red", padding: 0 }}
                onPress={() => {
                  setIndex(0);
                  handleSnapPress(1);
                  setScreen(0);
                }}
              >
                <TextComponent color={COLORS.BrownYellow} fontSize={sizes[2]}>
                  {" "}
                  Đăng nhập{" "}
                </TextComponent>
              </TouchableWithoutFeedback>
              hoặc
              <TouchableWithoutFeedback
                style={{ marginBottom: -3 }}
                onPress={() => {
                  setIndex(1);
                  handleSnapPress(2);
                  setScreen(0);
                }}
              >
                <TextComponent color={COLORS.BrownYellow} fontSize={sizes[2]}>
                  {" "}
                  Đăng ký
                </TextComponent>
              </TouchableWithoutFeedback>
            </TextComponent>
          </View>
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
          <HeaderSection onPress={() => navigate(ROUTE_SERVICE_AUTH)}/>
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
          <HeaderSection title="Sự kiện" onPress={() => navigate(ROUTE_EVENT_AUTH)}/>
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
          <HeaderSection title="Dịch vụ mới" onPress={() => navigate(ROUTE_SERVICE_AUTH)}/>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ marginHorizontal: 16, marginRight: 16 }}
            data={newService}
            keyExtractor={(item,index: number) => item.toString() + Math.random()}
            renderItem={renderNewService}
          />
        </View>
      </View>
      <Portal>
        <BottomSheet
          ref={bottomSheetRef}
          index={-1}
          snapPoints={snapPoints}
          onChange={(index) => {
            handleSheetChanges(index);
          }}
          enablePanDownToClose={true}
          backdropComponent={BottomSheetBackdrop}
          style={{ zIndex: 99 }}
        >
          {screen == 0 ? (
            <TabView
              renderTabBar={renderTabBar}
              navigationState={{ index, routes }}
              renderScene={renderScene}
              onIndexChange={(index) => {
                setIndex(index);
                handleSnapPress(index + 1);
              }}
              initialLayout={{}}
            />
          ) : screen == 1 ? (
            <ForgotPasswordScreen
              callBack={(phone: string, timeToLive: number) => {
                setScreen(2);
                setPhoneResetPassword(phone);
                setTimeToLive(timeToLive);
              }}
              callBackPop={() => setScreen(0)}
            />
          ) : screen == 2 ? (
            <OTPScreen
              callBack={onCallBackOTPScreen}
              callBackPop={onCallBackPopOTPScreen}
              phone={verificationType === VERIFYCATION_TYPE_FORGET_PASSWORD ? phoneResetPassword : registerUserData.PhoneNumber}
              timeToLive={timeToLive}
            />
          ) : (
            <ResetPasswordScreen
              callBackPop={() => {
                setScreen(2);
              }}
              callBack={() => {
                handleCancel();
                setModalVisible(true);
              }}
              tokenResetPassword={verifiedUserToken}
              phone={phoneResetPassword}
            />
          )}
        </BottomSheet>
      </Portal>
      <Modal isVisible={isModalVisible}>
        <View
          style={{ backgroundColor: "white", padding: 16, borderRadius: 8 }}
        >
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <TextComponent fontSize={20} color={COLORS.YankeesBlue} bold>
              Đặt Mật Khẩu Thành Công
            </TextComponent>
            <Pressable
              onPress={() => {
                setModalVisible(false);
              }}
            >
              <Ionicons name="close" size={20} />
            </Pressable>
          </View>
          <View style={{ paddingVertical: 16 }}>
            <TextComponent>
              Đặt mật khẩu mới thành công, quý khách có thể đăng nhập lại với
              mật khẩu mới tạo
            </TextComponent>
          </View>
          <Button
            label="Về Trang Đăng Nhập"
            labelColor={COLORS.White}
            onPress={() => {
              setModalVisible(false);
              setIndex(0);
              handleSnapPress(1);
              setScreen(0);
            }}
          />
          <Button
            label="Xác nhận"
            style={{
              backgroundColor: COLORS.Lavender,
            }}
            labelColor={COLORS.YankeesBlue}
            onPress={() => {
              setModalVisible(false);
            }}
          />
        </View>
      </Modal>
      {/* <PortalHost name="custom_host" /> */}
    </ScrollView>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.YankeesBlue,
  },
  button: {
    position: "absolute",
    padding: isIOS ? 10 : 5,
    borderRadius: 8,
    alignItems: "center",
    bottom: 20,
    right: 20,
  },
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
  center: { flexDirection: "row", alignItems: "center" },
  child: { width: width, justifyContent: "center" },
  text: { fontSize: width * 0.5, textAlign: "center" },
});

//make this component available to the app
export default IntroductionScreen;
