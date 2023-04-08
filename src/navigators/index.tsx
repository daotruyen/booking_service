import { PortalProvider } from "@gorhom/portal";
import {
  NavigationContainer,
  NavigationContainerRef,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useEffect } from "react";
import FlashMessage from "react-native-flash-message";
import { useDispatch } from "react-redux";
import Navigation from "./navigation";
import SplashScreen from "react-native-splash-screen";
import RNPermissions, {
  RESULTS,
} from "react-native-permissions";
import messaging from "@react-native-firebase/messaging";
import {
  GetFCMToken,
} from "shared/ultis/pushNotificationHelpers";
import PushNotification from "react-native-push-notification";
import { getNewNotification } from "reduxCore/notification/slice";
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import { isAndroid } from "react-native-size-scaling";
import { NOTIFICATION_SCREEN } from "shared/constants/routeNames";

export const navigationRef: React.RefObject<NavigationContainerRef<any>> =
  React.createRef();

export const navigate = (name: any, params: any = null) => {
  if (navigationRef.current) {
    navigationRef.current.navigate(name, params);
  }
};

const Stack = createNativeStackNavigator();
const checkPermission = async () => {
  const check = await RNPermissions.checkNotifications();
  if (check.status === RESULTS.DENIED) {
    await RNPermissions.requestNotifications(["alert", "sound"]);
    return null;
  }
  return check.status;
};

function AppNavigator() {
  const dispatch = useDispatch()
  const onRemoteNotification = (notification: any) => {
    const isClicked = notification.getData().userInteraction === 1;

    if (isClicked) {
      // Navigate user to another screen
      navigate(NOTIFICATION_SCREEN);
    }
    // Use the appropriate result based on what you needed to do for this notification
    const result = PushNotificationIOS.FetchResult.NoData;
    notification.finish(result);
  };

  useEffect(() => {
    const type = 'notification';
    PushNotificationIOS.addEventListener(type, onRemoteNotification);
    return () => {
      PushNotificationIOS.removeEventListener(type);
    };
  });

  useEffect(() => {
    let permissionNotification: any;
    checkPermission().then((a) => {
      permissionNotification = a;
    });
    GetFCMToken();

    messaging().onNotificationOpenedApp((remoteMessage) => {
      navigate(NOTIFICATION_SCREEN);
    });

    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        if (remoteMessage) {
          console.log(
            "Notification caused app to open from quit state:",
            remoteMessage.notification
          );
        }
      });
    messaging().onMessage(async (remoteMessage) => {
      dispatch(getNewNotification({newNotification: remoteMessage.data?.newNotiCount ?? 0}))

      if(isAndroid) {
      PushNotification.createChannel(
        {
          channelId: "Channel-id",
          channelName: "My channel",
          channelDescription: "A channel to categorise your notifications",
          playSound: false,
          soundName: "default",
          importance: 4,
          vibrate: true,
        },
        (created) => console.log(`createChannel returned '${created}'`)
      );


      PushNotification.localNotification({
        title: remoteMessage.notification?.title ?? "",
        message: remoteMessage.notification?.body ?? "",
        playSound: true,
        soundName: "sound.mp3",
        //android only properties
        channelId: "Channel-id",
        autoCancel: true,
        smallIcon: "ic_launcher",
        vibrate: true,
        vibration: 300,
        priority: "high",
      });
    } else {
      PushNotificationIOS.addNotificationRequest({
        id: 'notificationWithSound',
        title: remoteMessage.notification?.title ?? "",
        body: remoteMessage.notification?.body ?? "",
        sound: 'customSound.wav',
        badge: 1,
      });
    }
    });
  }, []);

  return (
    <NavigationContainer ref={navigationRef}>
      <PortalProvider>
        <Navigation />
        <FlashMessage position="top" />
      </PortalProvider>
    </NavigationContainer>
  );
}
export default AppNavigator;
