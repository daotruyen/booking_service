//import liraries
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { StyleSheet } from 'react-native';
import DetailArticle from 'screens/detailArticle';
import EventScreen from 'screens/event';
import HomeScreen from 'screens/home';
import HotServiceScreen from 'screens/hotService';
import UserScreen from 'screens/user';
import { DETAIL_ARTICLE, EVENT_ARTICLE, HOME_PAGE, HOT_SERVICE_ARTICLE, NEW_SERVICE_ARTICLE, NOTIFICATION_SCREEN } from 'shared/constants/routeNames';
import NotificationScreen from '../../../screens/notification/index';

const Stack = createNativeStackNavigator();

// create a component
const HomeStack = () => {
  return (
    <Stack.Navigator screenOptions={{
      headerStyle: {
        borderBottomWidth: 0,
        elevation: 0,
        shadowRadius: 0,
        shadowOffset: {
          height: 0,
        },
      },
    }}>
      <Stack.Screen
        name={HOME_PAGE}
        component={() => HomeScreen({isUser: false})}
        options={{
          header: ({ navigation, route, options }) => {
            return null//<CustomHeader label={' '} />;
          }
        }}
      />
      <Stack.Screen
        name= {NOTIFICATION_SCREEN}
        component={NotificationScreen}
        options={{
          header: ({ navigation, route, options }) => {
            return null//<CustomHeader label={' '} />;
          }
        }}
      />
      <Stack.Screen
        name={DETAIL_ARTICLE}
        component={DetailArticle}
        options={{
          header: ({ navigation, route, options }) => {
            return null//<CustomHeader label={' '} />;
          }
        }}
      />
      <Stack.Screen
        name={HOT_SERVICE_ARTICLE}
        component={HotServiceScreen}
        options={{
          header: ({ navigation, route, options }) => {
            return null//<CustomHeader label={' '} />;
          }
        }}
      />
      <Stack.Screen
        name={EVENT_ARTICLE}
        component={EventScreen}
        options={{
          header: ({ navigation, route, options }) => {
            return null//<CustomHeader label={' '} />;
          }
        }}
      />
      <Stack.Screen
        name={NEW_SERVICE_ARTICLE}
        component={HotServiceScreen}
        options={{
          header: ({ navigation, route, options }) => {
            return null//<CustomHeader label={' '} />;
          }
        }}
      />
    </Stack.Navigator>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2c3e50',
  },
});

//make this component available to the app
export default HomeStack;
