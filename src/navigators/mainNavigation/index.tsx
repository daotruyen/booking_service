//import liraries
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
import { StyleSheet, Image } from "react-native";
import TextComponent from "components/Text";
import { COLORS } from "shared/constants/colors";
import { sizes } from "shared/constants/common";
import ScheduleScreen from "screens/schedule";
import { TreatmentStackScreen } from "screens/treatment/treantmentStackScreen";
import { PurchaseStackScreen } from "navigators/purchaseNavigation";
import HomeStack from "./homeStack/index";
import FeedbackScreen from "../../screens/feedback/index";
import {
  ROUTE_EVENT_STACK,
  ROUTE_FEEDBACK_STACK,
  ROUTE_HOME_STACK,
  ROUTE_SCHEDULE_STACK,
  ROUTE_TREATMENT_STACK,
} from "shared/constants/routeNames";
import { TouchableOpacity } from "react-native";
import { navigate } from "navigators/index";
import { icon } from "assets/icon";
import { isIOS } from "react-native-size-scaling";

const Tab = createBottomTabNavigator();

// create a component
const MainNavigation = () => {
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
        name={ROUTE_HOME_STACK}
        component={HomeStack}
        options={({ route, navigation }) => ({
          tabBarIcon: ({ color, size, focused }) => (
            <TouchableOpacity
              style={styles.itemTab}
              onPress={() =>
                {setTimeout(() => {
                  navigation.reset({
                  index: 0,
                  routes: [{ name: ROUTE_HOME_STACK }],
                })
                }, 200);}
                
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
        name={ROUTE_TREATMENT_STACK}
        component={TreatmentStackScreen}
        options={({ route, navigation }) => ({
          tabBarIcon: ({ color, size, focused }) => (
            <TouchableOpacity
              style={styles.itemTab}
              onPress={() => {
                
                setTimeout(() => {
                  navigation.reset({
                  index: 0,
                  routes: [{ name: ROUTE_TREATMENT_STACK }],
                });
                }, 200);
              }}
            >
              <Image
                source={
                  focused ? icon.icon_treatment_active : icon.icon_treatment
                }
                style={{ width: 23, height: 20 }}
                resizeMode="contain"
              />
              <TextComponent
                color={focused ? COLORS.BrownYellow : COLORS.White}
                fontSize={sizes[1]}
                style={styles.textTab}
              >
                Liệu trình
              </TextComponent>
            </TouchableOpacity>
          ),
        })}
      />
      <Tab.Screen
        name={ROUTE_SCHEDULE_STACK}
        component={ScheduleScreen}
        options={({ route }) => ({
          tabBarIcon: ({ color, size, focused }) => (
            <TouchableOpacity
              style={styles.itemTab}
              onPress={() => navigate(ROUTE_SCHEDULE_STACK)}
            >
              <Image
                source={
                  focused ? icon.icon_schedule_active : icon.icon_schedule
                }
                style={{ width: 20, height: 23 }}
                resizeMode="contain"
              />
              <TextComponent
                color={focused ? COLORS.BrownYellow : COLORS.White}
                fontSize={sizes[1]}
                style={styles.textTab}
              >
                Lịch hẹn
              </TextComponent>
            </TouchableOpacity>
          ),
        })}
      />
      <Tab.Screen
        name={ROUTE_EVENT_STACK}
        component={PurchaseStackScreen}
        options={({ route, navigation }) => ({
          tabBarIcon: ({ color, size, focused }) => (
            <TouchableOpacity
              style={styles.itemTab}
              onPress={() => {
                
                setTimeout(() => {
                  navigation.reset({
                  index: 0,
                  routes: [{ name: ROUTE_EVENT_STACK }],
                });
                }, 200);
              }}
            >
              <Image
                source={focused ? icon.icon_history_active : icon.icon_history}
                style={{ width: 27, height: 20 }}
                resizeMode="contain"
              />
              <TextComponent
                color={focused ? COLORS.BrownYellow : COLORS.White}
                fontSize={sizes[1]}
                style={styles.textTab}
              >
                Lịch sử mua
              </TextComponent>
            </TouchableOpacity>
          ),
        })}
      />
      <Tab.Screen
        name={ROUTE_FEEDBACK_STACK}
        component={FeedbackScreen}
        options={({ route }) => ({
          tabBarIcon: ({ color, size, focused }) => (
            <TouchableOpacity
              style={styles.itemTab}
              onPress={() => navigate(ROUTE_FEEDBACK_STACK)}
            >
              <Image
                source={
                  focused ? icon.icon_feedback_active : icon.icon_feedback
                }
                style={{ width: 23, height: 21 }}
                resizeMode="contain"
              />
              <TextComponent
                color={focused ? COLORS.BrownYellow : COLORS.White}
                fontSize={sizes[1]}
                style={styles.textTab}
              >
                Khiếu nại
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
export default MainNavigation;
