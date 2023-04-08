//import liraries
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
import { View, StyleSheet, Image } from "react-native";
import TextComponent from "components/Text";
import { COLORS } from "shared/constants/colors";
import { sizes } from "shared/constants/common";
import {
  ROUTE_CREATE_SERVICE,
  ROUTE_CREATE_USER,
  ROUTE_HOME_COUNSELOR,
  ROUTE_USER,
} from "shared/constants/routeNames";
import { TouchableOpacity } from "react-native";
import { navigate } from "navigators/index";
import { icon, iconRoleCounselor } from "assets/icon";
import HomeScreen from "screens/home";
import UserScreen from "screens/user";
import CreateServicesStack from "./counselorStack/createServicesStack";
import { useDispatch, useSelector } from "react-redux";
import { getUserRequest } from "reduxCore/createService/slice";
import { selectAuth } from "reduxCore/auth/slice";
import CreateCustomerScreen from "screens/createCustomer";
import { isIOS } from "react-native-size-scaling";
import HomeStack from "./homeStack/homeStack";

const Tab = createBottomTabNavigator();

// create a component
const CounselorNavigation = () => {
  const dispatch = useDispatch();
  const { userId, tokenClaims } = useSelector(selectAuth);

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarHideOnKeyboard: true,
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: COLORS.YankeesBlue,
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          paddingTop: 10,
          height: isIOS ? 100 : 80,
        },
        tabBarInactiveTintColor: COLORS.White,
        tabBarActiveTintColor: COLORS.Yellow,
      }}
    >
      <Tab.Screen
        name={ROUTE_HOME_COUNSELOR}
        component={HomeStack}
        options={({ route, navigation }) => ({
          tabBarIcon: ({ color, size, focused }) => (
            <TouchableOpacity
              style={styles.itemTab}
              onPress={() =>
                navigation.reset({
                  index: 0,
                  routes: [{ name: ROUTE_HOME_COUNSELOR }],
                })
              }
            >
              <Image
                source={focused ? icon.icon_home_active : icon.home}
                style={{ width: 23, height: 20 }}
                resizeMode="contain"
              />
              <TextComponent
                color={focused ? COLORS.BrownYellow : COLORS.White}
                fontSize={sizes[1]}
                style={styles.textTab}
              >
                Trang chủ
              </TextComponent>
            </TouchableOpacity>
          ),
        })}
      />
      <Tab.Screen
        name={ROUTE_CREATE_SERVICE}
        component={CreateServicesStack}
        options={({ route, navigation }) => ({
          tabBarIcon: ({ color, size, focused }) => (
            <TouchableOpacity
              style={styles.itemTab}
              onPress={() =>
                navigation.reset({
                  index: 0,
                  routes: [{ name: ROUTE_CREATE_SERVICE }],
                })
              }
            >
              <Image
                source={
                  focused ? iconRoleCounselor.icon_add_service_active : iconRoleCounselor.icon_add_service
                }
                style={{ width: 23, height: 20 }}
                resizeMode="contain"
              />
              <TextComponent
                color={focused ? COLORS.BrownYellow : COLORS.White}
                fontSize={sizes[1]}
                style={styles.textTab}
              >
                Thêm Dịch vụ
              </TextComponent>
            </TouchableOpacity>
          ),
        })}
      />
      <Tab.Screen
        name={ROUTE_CREATE_USER}
        component={CreateCustomerScreen}
        options={({ route, navigation }) => ({
          tabBarIcon: ({ color, size, focused }) => (
            <TouchableOpacity
              style={styles.itemTab}
              onPress={() => {
                navigation.reset({
                  index: 0,
                  routes: [{ name: ROUTE_CREATE_USER }],
                });
              }}
            >
              <Image
                source={focused ? iconRoleCounselor.icon_create_user_active : iconRoleCounselor.icon_create_user}
                style={{ width: 20, height: 22 }}
                resizeMode="contain"
              />
              <TextComponent
                color={focused ? COLORS.BrownYellow : COLORS.White}
                fontSize={sizes[1]}
                style={styles.textTab}
              >
                Tạo tài khoản
              </TextComponent>
            </TouchableOpacity>
          ),
        })}
      />
      <Tab.Screen
        name={ROUTE_USER}
        component={UserScreen}
        options={({ route }) => ({
          tabBarIcon: ({ color, size, focused }) => (
            <TouchableOpacity
              style={styles.itemTab}
              onPress={() => {
                dispatch(getUserRequest(userId));
                navigate(ROUTE_USER, {showBack: false})
              }}
            >
              <Image
                source={
                  focused ? iconRoleCounselor.icon_user_active : iconRoleCounselor.icon_user
                }
                style={{ width: 23, height: 21 }}
                resizeMode="contain"
              />
              <TextComponent
                color={focused ? COLORS.BrownYellow : COLORS.White}
                fontSize={sizes[1]}
                style={styles.textTab}
              >
                Thông tin cá nhân
              </TextComponent>
            </TouchableOpacity>
          ),
        })}
      />
    </Tab.Navigator>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.JapaneseIndigo,
  },
  itemTab: { padding: 5, justifyContent: "center", alignItems: "center" },
  textTab: { paddingTop: 16 },
});

//make this component available to the app
export default CounselorNavigation;
