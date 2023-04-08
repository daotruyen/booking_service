//import liraries
import TextComponent from "components/Text";
import React from "react";
import { View, StyleSheet } from "react-native";
import { notificationReference, roleName, sizes } from "shared/constants/common";
import { apiClient } from "services/baseAxios";
import ApiConfig from "config/config";
import { getNotificationRequest } from "reduxCore/notification/slice";
import { useDispatch, useSelector } from "react-redux";
import { selectAuth } from "reduxCore/auth/slice";
import { Pressable } from "react-native";
import { helpers } from "shared/ultis/helpers";
import { navigate } from "navigators";
import { DETAIL_ARTICLE, ROUTE_CREATE_SERVICE, ROUTE_EVENT_STACK, ROUTE_SCHEDULE_STACK } from "shared/constants/routeNames";

// create a component
const ItemNotification = ({ item, callback }: any) => {
  const dispatch = useDispatch();
  const {role, userId } = useSelector(selectAuth);
  
  const onReadNotification = async () => {
    try {
      const res = await apiClient.post(
        `${ApiConfig.READ_NOTIFICATION}${item.Id}/ack`,
        {}
      );
      const { AppCode, Data } = res;
      if (AppCode == 200) {
        callback();
        dispatch(
          getNotificationRequest({
            userId: userId,
            pageIndex: 1,
            pageSize: 10,
          })
        );
      }
    } catch (error) {
      console.log(error);
    } 
  };

  const onPressNotification = () => {
    if(item.Status === 1) {
      onReadNotification();
    } 
    switch (item.NotificationReference.Page) {
      case notificationReference.BOOKING_MANAMENT:
        if(role === roleName.CUSTOMER) {
          navigate(ROUTE_SCHEDULE_STACK);
        }
        break;
      case notificationReference.PURCHASE_HISTORY:
        if(role === roleName.CUSTOMER) {
          navigate(ROUTE_EVENT_STACK);
        }
        break;
      case notificationReference.DETAIL_ARTICLE:
        navigate(DETAIL_ARTICLE, item.NotificationReference);
        break;
      case notificationReference.TREATMENT_SESSION_CREATION:
        if(role === roleName.TECHNICIAN) {
          navigate(ROUTE_CREATE_SERVICE);
        }
        break; 
      default:
        break;
    }
  }
  return (
    <Pressable style={styles.container} onPress={onPressNotification}>
      <View style={styles.titleNoti}>
        <View>
          <TextComponent bold fontSize={sizes[4]}>
            {item.Title + item.Id}
          </TextComponent>
          <TextComponent>{helpers.convertTime(item.Time)}</TextComponent>
        </View>
        {item.Status == 1 ? <View style={styles.dot} /> : <View />}
      </View>
      <View>
        <TextComponent>{item.Content}</TextComponent>
      </View>
    </Pressable>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderColor: "#EBEBEB",
  },
  dot: {
    backgroundColor: "#1E2329",
    width: 8,
    height: 8,
    borderRadius: 8,
  },
  titleNoti: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    paddingBottom: 12,
    paddingTop: 16,
  },
});

//make this component available to the app
export default ItemNotification;
