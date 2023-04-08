import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TreatmentScreen from "screens/treatment";
import { TreatmentItemSessionDetail } from "screens/treatment/treatmentItemSession";
import { treatmentRoutes } from "shared/constants/routeNames";
import React from "react";

const TreatmentStack = createNativeStackNavigator();

const screenOptions = {
  headerShown: false
};

export const TreatmentStackScreen = () => {
  return (
    <TreatmentStack.Navigator screenOptions={screenOptions} initialRouteName={treatmentRoutes.MAIN}>
      <TreatmentStack.Screen name={treatmentRoutes.MAIN} component={TreatmentScreen} />
      <TreatmentStack.Screen name={treatmentRoutes.SESSION} component={TreatmentItemSessionDetail} />
    </TreatmentStack.Navigator>
  );
};
