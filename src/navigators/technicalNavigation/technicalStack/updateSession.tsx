//import liraries
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import CreateServiceScreen from 'screens/createService';
import PurchaseHistoryDetail from 'screens/purchaseHistory/purchaseHistoryDetail';
import UpdateSessionScreen from 'screens/updateSession';
import UpdateTreatmentSessionScreen from 'screens/updateSession/updateTreatment';
import { CREATE_SERVICE_PAGE, INFO_USER, purchaseHistoryRoutes, treatmentRoutes } from 'shared/constants/routeNames';

const Stack = createNativeStackNavigator();

// create a component
const UpdateSessionStack = () => {
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
        name={CREATE_SERVICE_PAGE}
        component={CreateServiceScreen}
        options={{
          header: ({ navigation, route, options }) => {
            return null//<CustomHeader label={' '} />;
          }
        }}
      />
      <Stack.Screen
        name={INFO_USER}
        component={UpdateSessionScreen}
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
        component={UpdateTreatmentSessionScreen}
        options={{
          header: ({ navigation, route, options }) => {
            return null//<CustomHeader label={' '} />;
          }
        }}
      />
    </Stack.Navigator>
  );
};

export default UpdateSessionStack;
