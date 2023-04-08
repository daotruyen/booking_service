//import liraries
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import CreateServiceScreen from 'screens/createService';
import InfoUserScreen from 'screens/createService/infoUser';
import PurchaseHistoryDetail from 'screens/purchaseHistory/purchaseHistoryDetail';
import { TreatmentItemSessionDetail } from 'screens/treatment/treatmentItemSession';
import { CREATE_SERVICE_PAGE, INFO_USER_SCREEN, purchaseHistoryRoutes, treatmentRoutes } from 'shared/constants/routeNames';

const Stack = createNativeStackNavigator();

// create a component
const CreateServicesStack = () => {
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
    }} tabBarOptions={{
      keyboardHidesTabBar: true
   }} >
      <Stack.Screen
        name={CREATE_SERVICE_PAGE}
        component={CreateServiceScreen}
        options={{
          header: ({ navigation, route, options }) => {
            return null//<CustomHeader label={' '} />;
          }
        }}
      />
      <Stack.Screen
        name={INFO_USER_SCREEN}
        component={InfoUserScreen}
        options={{
          header: ({ navigation, route, options }) => {
            return null//<CustomHeader label={' '} />;
          }
        }}
      />
      <Stack.Screen
        name={purchaseHistoryRoutes.PURCHASE_DETAIL}
        component={PurchaseHistoryDetail}
        options={{
          header: ({ navigation, route, options }) => {
            return null//<CustomHeader label={' '} />;
          }
        }}
      />
      <Stack.Screen
        name={treatmentRoutes.SESSION}
        component={TreatmentItemSessionDetail}
        options={{
          header: ({ navigation, route, options }) => {
            return null//<CustomHeader label={' '} />;
          }
        }}
      />
    </Stack.Navigator>
  );
};

export default CreateServicesStack;
