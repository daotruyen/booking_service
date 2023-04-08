import React from "react";
import { LogBox, StatusBar } from "react-native";
import {} from "components";
import GlobalLoading, { globalLoadingRef } from "components/GlobalLoading";
import GlobalMessage, { globalMessageRef } from "components/GlobalMessage";
import { I18nextProvider } from "react-i18next";
import i18next from "shared/language";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "reduxCore/store";
import AppNavigator from "navigators";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import PushNotification from "react-native-push-notification";
import PushNotificationIOS from "@react-native-community/push-notification-ios";

LogBox.ignoreAllLogs(true);
StatusBar.setBarStyle("dark-content");
PushNotification.configure({
  onRegister: function (token) {},

  onNotification: function (notification) {
    notification.finish(PushNotificationIOS.FetchResult.NoData);
  },

  onAction: function (notification) {},
  onRegistrationError: function (err) {},

  // IOS ONLY (optional): default: all - Permissions to register.
  permissions: {
    alert: true,
    badge: true,
    sound: true,
  },
  popInitialNotification: true,
  requestPermissions: true,
});

const MyBase = () => {

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <I18nextProvider i18n={i18next}>
        <Provider store={store}>
          <PersistGate persistor={persistor}>
            <AppNavigator />
            <GlobalLoading ref={globalLoadingRef} />
            <GlobalMessage ref={globalMessageRef} />
          </PersistGate>
        </Provider>
      </I18nextProvider>
    </GestureHandlerRootView>
  );
};
export default MyBase;
