//import liraries
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { StyleSheet } from 'react-native';
import DetailArticle from 'screens/detailArticle';
import ForgotPasswordScreen from 'screens/forgotPassword';
import HomeScreen from 'screens/home';
import UserScreen from 'screens/user';
import { AUTH_PAGE, DETAIL_ARTICLE, FORGOT_PASSWORD, HOME_PAGE } from 'shared/constants/routeNames';

const Stack = createNativeStackNavigator();

// create a component
const AuthStack = () => {
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
        name={AUTH_PAGE}
        component={HomeScreen}
        options={{
          header: ({ navigation, route, options }) => {
            return null//<CustomHeader label={' '} />;
          }
        }}
      />
      <Stack.Screen
        name={FORGOT_PASSWORD}
        component={ForgotPasswordScreen}
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
export default AuthStack;
