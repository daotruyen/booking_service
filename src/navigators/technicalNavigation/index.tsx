//import liraries
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
import { StyleSheet, Image } from "react-native";
import TextComponent from "components/Text";
import { COLORS } from "shared/constants/colors";
import { sizes } from "shared/constants/common";
import {
  ROUTE_CREATE_SERVICE,
  ROUTE_HOME_COUNSELOR,
  ROUTE_USER,
} from "shared/constants/routeNames";
import { TouchableOpacity } from "react-native";
import { navigate } from "navigators/index";
import { icon, iconRoleCounselor, iconRoleTechnical } from "assets/icon";
import HomeScreen from "screens/home";
import UserScreen from "screens/user";
import { useDispatch, useSelector } from "react-redux";
import { getUserRequest } from "reduxCore/createService/slice";
import { selectAuth } from "reduxCore/auth/slice";
import UpdateSessionStack from "./technicalStack/updateSession";
import { isIOS } from "react-native-size-scaling";
import HomeStack from "./homeStack/homeStack";

const Tab = createBottomTabNavigator();

// create a component
const TechnicalNavigation = () => {
  const dispatch = useDispatch();
  const { userId } = useSelector(selectAuth);

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
        component={UpdateSessionStack}
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
                  focused ? iconRoleTechnical.icon_update_session_active : iconRoleTechnical.icon_update_session
                }
                style={{ width: 23, height: 20 }}
                resizeMode="contain"
              />
              <TextComponent
                color={focused ? COLORS.BrownYellow : COLORS.White}
                fontSize={sizes[1]}
                style={styles.textTab}
              >
                Cập nhật buổi điều trị
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
export default TechnicalNavigation;
