//import liraries
import Header from "components/Headers";
import React, { useRef } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { COLORS } from "shared/constants/colors";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { selectAuth } from "reduxCore/auth/slice";
import ItemNotification from "./itemNotification";
import TextComponent from "components/Text";
import { sizes } from "shared/constants/common";
import { apiClient } from "services/baseAxios";
import ApiConfig from "config/config";
import { useState } from "react";
import { useEffect } from "react";

// create a component
const NotificationScreen = (props: any) => {
  const { route } = props;
  const { userId } = useSelector(selectAuth);
  const ref = useRef(null);
  const [listNotification, setListNotification] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [refreshing, setRefreshing] = React.useState(false);
  const canMomentum = React.useRef(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getNotification(1);
    setRefreshing(false);
  }, []);
  const renderItem = ({ item, callback }: any) => {
    return <ItemNotification item={item} callback={onRefresh} />;
  };

  const getNotification = async (current?: number) => {
    setLoading(true);
    const res = await apiClient.get(`${ApiConfig.GET_NOTIFICATION}${userId}`, {
      pageIndex: current ?? currentPage,
      pageSize: 50,
    });

    const { Data, AppCode } = res;
    if (AppCode === 200) {
      const data: any[] = [...listNotification, ...Data.Notifications];
      setListNotification(data);
      setLoading(false);
    } else {
      
      setLoading(false);
    }
  };
  const onMomentumScrollBegin = () => {
    canMomentum.current = true;
    setLoading(true);
  };

  console.log(listNotification);

  const onMomentumScrollEnd = () => {
    if (canMomentum.current) {
      setCurrentPage(currentPage + 1);
    }

    canMomentum.current = false;
  };

  useEffect(() => {
    getNotification();
  }, [currentPage]);

  const renderFooter = () => {
    return loading ? (
      <View style={{ marginTop: 10, alignItems: "center" }}>
        <ActivityIndicator size="large" color="#1f1f1f" />
      </View>
    ) : null;
  };

  return (
    <View style={styles.container}>
      <Header showBack={route.params?.showBack ?? true} />
      <View style={[styles.container, { padding: 16 }]}>
        <TextComponent fontSize={sizes[4]} bold style={styles.title}>
          Thông báo
        </TextComponent>
        {listNotification.length != 0 ? (
          <FlatList
            ref={ref}
            data={listNotification}
            keyExtractor={(index: number) => index.toString() + Math.random()}
            renderItem={renderItem}
            style={styles.container}
            showsVerticalScrollIndicator={false}
            ListFooterComponent={renderFooter}
            onEndReachedThreshold={0}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            onMomentumScrollBegin={onMomentumScrollBegin}
            onMomentumScrollEnd={onMomentumScrollEnd}
          />
        ) : (
          !loading ? <View style={styles.empty}>
            <TextComponent>Không có thông báo nào!!</TextComponent>
          </View> : renderFooter()
        )}
      </View>
    </View>
  );
};
// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.White,
  },
  item: {
    backgroundColor: "red",
  },
  title: {
    paddingBottom: 0,
  },
  empty: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
});

//make this component available to the app
export default NotificationScreen;
