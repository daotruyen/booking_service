//import liraries
import { image } from 'assets/image';
import React, { Component, useEffect } from 'react';
import { View, Text, StyleSheet, Image, StatusBar } from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import LinearGradient from 'react-native-linear-gradient';
import { COLORS } from 'shared/constants/colors';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { useDispatch, useSelector } from 'react-redux';
import { getUserRequest } from 'reduxCore/createService/slice';
import { autoLoginRequest, selectAuth } from 'reduxCore/auth/slice';
import { getItem } from 'shared/ultis/storageHelpers';
import { Constants } from 'reduxCore/type';
import { disableAutoLoader } from 'reduxCore/loading/slice';


// create a component
const StartUpScreen = () => {
  const dispatch = useDispatch()
  const {isLoggedIn, userId} = useSelector(selectAuth);

  const onAutoLogin = async() =>{
    const phone = await getItem(Constants.PHONE_NUMBER);
    const password = await getItem(Constants.PASSWORD);
    if(!!phone && !!password) {
      dispatch(autoLoginRequest({ PhoneNumber: phone, Password: password }));
      if (isLoggedIn) {
        dispatch(getUserRequest(userId));
      }
    } else {
      dispatch(disableAutoLoader())
    }
  }

  useEffect(() => {
    console.log('====================================');
    console.log('vao day');
    console.log('====================================');
    SplashScreen.hide();
    onAutoLogin()
  }, []);
  
  return (
    <View style={[styles.container, { backgroundColor: COLORS.White }]}>
      <LinearGradient
        style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        colors={['#fff', '#fff']}>
        <StatusBar backgroundColor={COLORS.White} barStyle="light-content" />
        <Image
          source={image.logo2}
          style={{
            width: 128,
            height: 128,
            resizeMode: 'contain',
          }}
        />
      </LinearGradient>
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  label: {
    fontSize: 26,
    marginTop: 15,
    fontWeight: '600'
  },
});

//make this component available to the app
export default StartUpScreen;
