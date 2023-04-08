import AsyncStorage from "@react-native-async-storage/async-storage";
import messaging from "@react-native-firebase/messaging";

const requestUserPermission = async () => {
  
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;
  if (enabled) {
  }
}

 const GetFCMToken = async() => {
  let fcmToken = await  AsyncStorage.getItem("fcmToken");
  if (!fcmToken) {
    await messaging().registerDeviceForRemoteMessages();
    try {
      let fcmToken = await messaging().getToken();
      await AsyncStorage.setItem("fcmToken", fcmToken);
    } catch (error) {
      console.log(error)
    }
    if (!!fcmToken) {
      await AsyncStorage.setItem("fcmToken", fcmToken);
    }
  }
}

const NotificationListener = () => {
  messaging().onNotificationOpenedApp((remoteMessage) => {

  });

  messaging()
    .getInitialNotification()
    .then((remoteMessage) => {
      if (remoteMessage) {

      }
    });
  
    messaging().onMessage( remoteMessage => {
    })
};

export {requestUserPermission, GetFCMToken, NotificationListener}
