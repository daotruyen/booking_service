import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { PurchaseHistory } from "screens/purchaseHistory";
import PurchaseHistoryDetail from "screens/purchaseHistory/purchaseHistoryDetail";
import { purchaseHistoryRoutes } from "shared/constants/routeNames";
import React from "react";

const PurchaseStack = createNativeStackNavigator();

const screenOptions = {
  headerShown: false
};

export const PurchaseStackScreen = () => {
  return (
    <PurchaseStack.Navigator screenOptions={screenOptions} initialRouteName={purchaseHistoryRoutes.PURCHASE}>
      <PurchaseStack.Screen name={purchaseHistoryRoutes.PURCHASE} component={PurchaseHistory} />
      <PurchaseStack.Screen name={purchaseHistoryRoutes.PURCHASE_DETAIL} component={PurchaseHistoryDetail} />
    </PurchaseStack.Navigator>
  );
};
