import PushNotification, { Importance } from "react-native-push-notification";
export const LocalNotification = () => {
  PushNotification.createChannel(
    {
      channelId: "channel-id", // (required)
      channelName: "My channel", // (required)
      channelDescription: "A channel to categorise your notifications", // (optional) default: undefined.
      playSound: false, // (optional) default: true
      soundName: "default", // (optional) See `soundName` parameter of `localNotification` function
      importance: 4, // (optional) default: 4. Int value of the Android notification importance
      vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
    },
    (created) => console.log(`createChannel returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
  );

  PushNotification.localNotification({
    //ios and android properties
    title: 'Face2Face: Beacon Timer Expired',
    message: 'Perhaps set your beacon timer for another hour?',
    playSound: true,
    soundName: 'sound.mp3',
    //android only properties
    channelId: "channel-id", // (required)
    autoCancel: true,
    // largeIcon: 'ic_launcher',
    // smallIcon: 'ic_launcher',
    bigText: 'Face2Face: Beacon Timer Expired',
    subText: 'Perhaps set your beacon timer for another hour?',
    vibrate: true,
    vibration: 300,
    priority: 'high',
    //ios only properties...is there any?
  });

};
