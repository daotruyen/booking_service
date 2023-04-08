//import liraries
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
import { View, StyleSheet, Image, Linking } from "react-native";
import IntroductionScreen from "screens/intro";
import TextComponent from "components/Text";
import { COLORS } from "shared/constants/colors";
import { PHONE_DEFAULT, sizes } from "shared/constants/common";
import {
  ROUTE_EVENT_AUTH,
  ROUTE_HOME_AUTH,
  ROUTE_SERVICE_AUTH,
} from "shared/constants/routeNames";
import { ROUTE_PROMOTION_AUTH } from "../../shared/constants/routeNames";
import { ROUTE_HOTLINE_AUTH } from "../../shared/constants/routeNames";
import { icon, iconAuth } from "assets/icon";
import { isIOS } from "react-native-size-scaling";
import HotServiceScreen from "screens/hotService";
import EventScreen from "screens/event";
import SaleOffProgramScreen from "screens/saleOffProgram";
import { TouchableOpacity } from 'react-native';

const Tab = createBottomTabNavigator();

// create a component
const AuthNavigation = () => {
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
        name={ROUTE_HOME_AUTH}
        component={IntroductionScreen}
        options={({ route }) => ({
          tabBarIcon: ({ color, size, focused }) => (
            <View style={styles.itemTab}>
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
            </View>
          ),
        })}
      />
      <Tab.Screen
        name={ROUTE_SERVICE_AUTH}
        component={HotServiceScreen}
        options={({ route }) => ({
          tabBarIcon: ({ color, size, focused }) => (
            <View style={styles.itemTab}>
              <Image
                source={
                  focused ? iconAuth.icon_star_active : iconAuth.icon_star
                }
                style={{ width: 23, height: 20 }}
                resizeMode="contain"
              />
              <TextComponent
                color={focused ? COLORS.BrownYellow : COLORS.White}
                fontSize={sizes[1]}
                style={styles.textTab}
              >
                Dịch vụ hot
              </TextComponent>
            </View>
          ),
        })}
      />
      <Tab.Screen
        name={ROUTE_PROMOTION_AUTH}
        component={SaleOffProgramScreen}
        options={({ route }) => ({
          tabBarIcon: ({ color, size, focused }) => (
            <View style={styles.itemTab}>
              <Image
                source={
                  focused ? iconAuth.icon_ticket_active : iconAuth.icon_ticket
                }
                style={{ width: 23, height: 22 }}
                resizeMode="contain"
              />
              <TextComponent
                color={focused ? COLORS.BrownYellow : COLORS.White}
                fontSize={sizes[1]}
                style={styles.textTab}
              >
                Khuyến mãi
              </TextComponent>
            </View>
          ),
        })}
      />
      <Tab.Screen
        name={ROUTE_EVENT_AUTH}
        component={EventScreen}
        options={({ route }) => ({
          tabBarIcon: ({ color, size, focused }) => (
            <View style={styles.itemTab}>
              <Image
                source={
                  focused ? iconAuth.icon_event_active : iconAuth.icon_event
                }
                style={{ width: 20, height: 23 }}
                resizeMode="contain"
              />
              <TextComponent
                color={focused ? COLORS.BrownYellow : COLORS.White}
                fontSize={sizes[1]}
                style={styles.textTab}
              >
                Sự kiện
              </TextComponent>
            </View>
          ),
        })}
      />
      <Tab.Screen
        name={ROUTE_HOTLINE_AUTH}
        component={IntroductionScreen}
        options={({ route }) => ({
          tabBarIcon: ({ color, size, focused }) => (
            <TouchableOpacity style={styles.itemTab} onPress ={   () =>  Linking.openURL(`tel:${PHONE_DEFAULT}`)          }>
              <Image
                source={
                  focused ? iconAuth.icon_phone_active : iconAuth.icon_phone
                }
                style={{ width: 22, height: 22 }}
              />
              <TextComponent
                color={focused ? COLORS.BrownYellow : COLORS.White}
                fontSize={sizes[1]}
                style={styles.textTab}
              >
                Hotline
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
export default AuthNavigation;
