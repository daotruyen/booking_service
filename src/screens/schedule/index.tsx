//import liraries
import { image } from "assets/image";
import Button from "components/CustomButton";
import Header from "components/Headers";
import TextComponent from "components/Text";
import { COLORS } from "shared/constants/colors";
import { BAC_NINH_PHONE, HA_NOI_PHONE, PHONE_DEFAULT, SAI_GON_1_PHONE, sizes } from "shared/constants/common";
import React, { useMemo, useState, useRef, useCallback } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  StatusBar,
  ActivityIndicator,
  Linking,
} from "react-native";
import { Calendar, CalendarProvider } from "react-native-calendars";
import NoScheduleComponent from "./noSchedule";
import Ionicons from "react-native-vector-icons/Ionicons";
import BottomSheet, { BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import ChangeSchedule from "./changeSchedule";
import FlashMessage from "react-native-flash-message";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getScheduleRequest, selectSchedule } from "reduxCore/schedule/slice";
import { useSelector } from "react-redux";
import moment from "moment";
import { helpers } from "shared/ultis/helpers";
import { selectAuth } from "reduxCore/auth/slice";
import { ScheduleModel } from "../../model/scheduleModel";
import FlatListComponent from "components/FlatList";
import { Portal } from "@gorhom/portal";
import sharedStyles from "shared/constants/styles";

interface Props {}

// create a component
const ScheduleScreen: React.FC<Props> = () => {
  const dispatch = useDispatch();
  const { userId } = useSelector(selectAuth);
  let newDaysObject = {};
  let scheduleObject: any = {};
  const { schedule, loading } = useSelector(selectSchedule);
  const INITIAL_DATE = moment().format("YYYY-MM-DD");
  const [isDirty, setIsDirty] = useState<number>();
  const [selected, setSelected] = useState(INITIAL_DATE);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["1", "70%"], []);
  const [itemSchedule, setItemSchedule] = useState<ScheduleModel>();
  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);
  }, []);

  const handleSnapPress = useCallback((index: number) => {
    bottomSheetRef.current?.snapToIndex(index);
  }, []);

  const onPress = (index: number, schedule?: any, indexItem?: any) => () => {
    if (schedule.IsDirty == true) {
      setIsDirty(indexItem);
    } else {
      setItemSchedule(schedule);
      handleSnapPress(index);
    }
  };

  useEffect(() => {
    dispatch(getScheduleRequest({ userId: userId }));
    schedule.forEach((day: any) => {
      newDaysObject = {
        ...newDaysObject,
        [day.BookingTime.slice(0, 10)]: {
          // selected: true,
          marked: true,
        },
      };
    });
  }, []);

  const callService = (address: string) => {
    const location: string[] = address.split('-', 5);
    const check = (location[location.length - 1] ?? "").trim()
    switch (check) {
      case 'Hà Nội':
        Linking.openURL(`tel:${HA_NOI_PHONE}`)
        break;
      case 'Bắc Ninh':
        Linking.openURL(`tel:${BAC_NINH_PHONE}`)
        break;
      case 'HCM':
        Linking.openURL(`tel:${SAI_GON_1_PHONE}`)
        break; 
      default:
        Linking.openURL(`tel:${PHONE_DEFAULT}`)
        break;
    }
  }

  const marked = useMemo(() => {
    schedule.forEach((day: ScheduleModel) => {
      newDaysObject = {
        ...newDaysObject,
        [day.BookingTime.slice(0, 10)]: {
          // selected: true,
          marked: true,
        },
      };
      scheduleObject = {
        ...scheduleObject,
        [day.BookingTime.slice(0, 10)]: {
          ...day,
        },
      };
    });
    
    return {
      ...newDaysObject,
      [selected]: {
        selected: true,
        disableTouchEvent: true,
        selectedColor: COLORS.YankeesBlue,
        selectedTextColor: COLORS.White,
      },
    };
  }, [selected, schedule]);

  const onDayPress = useCallback((day: any) => {
    setSelected(day.dateString);
  }, []);

  const dataDateSelected = useMemo(() => {
    return schedule.filter((item: ScheduleModel) => item.BookingTime.slice(0, 10) === selected)
  } ,[selected, schedule])

  const renderChangeTime = useMemo(() => {
    return <ChangeSchedule
    onPressButton={(index) => {
      bottomSheetRef.current?.close();
    }}
    schedule = {itemSchedule as ScheduleModel}
  />
  }, [itemSchedule])

  const renderItem = ({ index, item }: any) => {
    return (
      <View style={[styles.card, styles.shadowProp]}>
        <View
          style={{
            borderBottomWidth: 1,
            borderColor: COLORS.Grayscale,
            paddingBottom: 16,
            flexDirection: "row",
          }}
        >
          <Image
            style={sharedStyles.treatmentServiceImage}
            source={image.image}
          />
          <View
            style={{
              paddingLeft: 8,
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <TextComponent
              style={{
                paddingVertical: 2,
                fontSize: sizes[4],
                textTransform: "uppercase",
              }}
            >
              {item?.ServiceName}
            </TextComponent>
            <View style={[styles.commonDetail]}>
              <Ionicons name="location" color={COLORS.YankeesBlue} size={14} />
              <TextComponent
                numberOfLines={1}
                style={[styles.textDetail, { width: 200 }]}
                fontSize={sizes[3]}
              >
                {item?.LocationAddress}
              </TextComponent>
            </View>
            <View style={styles.commonDetail}>
              <Ionicons
                name="timer-outline"
                color={COLORS.YankeesBlue}
                size={14}
              />
              <TextComponent style={styles.textDetail} fontSize={sizes[3]}>
                {helpers.convertUtcTime(item?.BookingTime)}
              </TextComponent>
            </View>
          </View>
        </View>
        <View style={{ paddingVertical: 8 }}>
          <View style={{ flexDirection: "row" }}>
            <Button
              label="Gọi tư vấn"
              onPress={() => {
                callService(item?.LocationAddress)
              }}
              style={{
                flex: 1,
                marginRight: 8,
                backgroundColor: COLORS.Lavender,
              }}
              labelColor={COLORS.YankeesBlue}
            />
            <Button
              label="Đổi lịch hẹn"
              onPress={onPress(1, item, index)}
              style={{ flex: 1, marginLeft: 8 }}
            />
          </View>
          {index == isDirty && (
            <View style={{ flexDirection: "row", paddingRight: 16 }}>
              <Ionicons name="warning" color={COLORS.Yellow} size={18} />
              <TextComponent fontSize={sizes[3]} style={{ paddingBottom: 8 }}>
                Quý khách đã thay đổi lịch hẹn 1 lần, vui lòng liên hệ nhân viên
                cskh để được tư vấn thêm
              </TextComponent>
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Header title="" />

      {!loading ? (
        <ScrollView style={{ flex: 1 }}>
          <View style={{ padding: 8 }}>
            <TextComponent fontSize={sizes[5]} style={{ paddingLeft: 8 }}>
              Lịch hẹn
            </TextComponent>
            {schedule.length == 0 ? (
              <NoScheduleComponent />
            ) : (
              <FlatListComponent data={schedule} renderItem={renderItem} />
            )}
          </View>
          {schedule.length != 0 && (
            <View>
              <TextComponent
                fontSize={sizes[5]}
                style={{ color: COLORS.YankeesBlue, marginHorizontal: 16 }}
              >
                Chi Tiết
              </TextComponent>
              <CalendarProvider date={""}>
                <Calendar
                  enableSwipeMonths
                  current={INITIAL_DATE}
                  style={styles.calendar}
                  onDayPress={(date) => {
                    onDayPress(date);
                  }}
                  markedDates={marked}
                />
              </CalendarProvider>
            </View>
          )}
          {dataDateSelected.map((item: ScheduleModel) => {
            return <View style={{ padding: 16 }}>
            <View style={styles.row}>
              <View style={{ width: 70 }}>
                <TextComponent>Liệu trình</TextComponent>
              </View>
              <TextComponent>
                {item.ServiceName}
              </TextComponent>
            </View>
            <View style={styles.row}>
              <View style={{ width: 70 }}>
                <TextComponent>Thời gian</TextComponent>
              </View>
              <TextComponent>
                {helpers.convertUtcTime(
                  item.BookingTime
                )}
              </TextComponent>
            </View>
            <View style={styles.row}>
              <View style={{ width: 70 }}>
                <TextComponent>Cơ sở</TextComponent>
              </View>
              <TextComponent style={{ flex: 1, textAlign: "right" }}>
                {item.LocationAddress}
              </TextComponent>
            </View>
          </View>
          })}
        </ScrollView>
      ) : (
        <View style={styles.main}>
          <ActivityIndicator
            animating={true}
            color={"rgba(0, 0, 0, .7)"}
            size="large"
          />
        </View>
      )}
      <Portal>
        <BottomSheet
          ref={bottomSheetRef}
          index={-1}
          snapPoints={snapPoints}
          onChange={(index) => {
            handleSheetChanges(index);
          }}
          enablePanDownToClose={true}
          backdropComponent={BottomSheetBackdrop}
        >
          {renderChangeTime}
        </BottomSheet>
      </Portal>
      <FlashMessage position="top" />
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.White,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 8,
    marginVertical: 10,
    padding: 16,
    paddingBottom: 0,
    margin: 8,
  },
  main: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  shadowProp: {
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowRadius: 5,
    shadowOpacity: 8,
    shadowColor: "rgba(34, 34, 34, 0.15)",
  },
  text: {
    marginBottom: 16,
  },
  calendar: {
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    flex: 1,
    paddingTop: 9,
  },
  commonDetail: {
    flexDirection: "row",
    paddingVertical: 2,
    alignItems: "center",
    flex: 1,
  },
  textDetail: {
    paddingLeft: 5,
    color: COLORS.Gray,
  },
});

//make this component available to the app
export default ScheduleScreen;
