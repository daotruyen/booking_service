//import liraries
import TextComponent from "components/Text";
import { COLORS } from "shared/constants/colors";
import { sizes } from "shared/constants/common";
import React, { useState } from "react";
import { View, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import Button from "components/CustomButton";
import { ScheduleModel } from "../../model/scheduleModel";
import { helpers } from "shared/ultis/helpers";
import { useDispatch } from "react-redux";
import {
  getScheduleRequest,
} from "reduxCore/schedule/slice";
import { useSelector } from "react-redux";
import { selectAuth } from "reduxCore/auth/slice";
import { apiClient } from "services/baseAxios";
import ApiConfig from "config/config";
import { showMessage } from "react-native-flash-message";
import moment from "moment";
import { width } from "shared/metrics";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { isAndroid } from "react-native-size-scaling";
import { useEffect } from 'react';

// create a component

interface Props {
  schedule: ScheduleModel;
  onPressButton: (index: number) => void;
}
const ChangeSchedule: React.FC<Props> = (props) => {
  const dispatch = useDispatch();
  const { userId } = useSelector(selectAuth);
  const { onPressButton, schedule } = props;
  const [date, setDate] = useState(new Date());
  
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const dateUpdate = () => {
    const dateTime = new Date(moment(schedule?.BookingTime).format("YYYY-MM-DD"));
    setDate(dateTime);
  };

  useEffect(() => {
    dateUpdate()
  }, [schedule])

  const handleConfirmDate = (date: any) => {
    if (
      moment(schedule?.BookingTime).valueOf() < moment(date).valueOf() &&
      moment(schedule?.BookingTime).add(3, "days").valueOf() >
        moment(date).valueOf()
    ) {
      setDate(date);
      hideDatePicker();
    } else {
      showMessage({
        message: "Chọn ngày thất bại",
        description: "Bạn chỉ được thay đổi quá 2 ngày so với lịch",
        type: "danger",
      });
      hideDatePicker();
    }
  };

  const updateSchedule = async () => {
    const url: string = ApiConfig.UPDATE_SCHEDULE + schedule.Id;
    const data = {
      BookingTime: moment(
        `${moment.utc(date).format("YYYY-MM-DD")} 00:00`,
        "YYYY-MM-DD h:mm"
      )
        .utc()
        .local()
        .format(),
    };
    try {
      const response = await apiClient.put(url, data);
      if (response.AppCode == 200) {
        onPressButton(1);
        dispatch(getScheduleRequest({ userId: userId }));
        showMessage({
          message: "🎉 Thông tin đã được ghi nhận",
          description: "Nhân viên tư vấn sẽ gọi lại cho quý khách để xác nhận",
          type: "success",
        });
      } else {
        onPressButton(1);
        showMessage({
          message: "Chọn ngày thất bại",
          description: "Bạn chỉ được thay đổi quá 2 ngày so với lịch",
          type: "danger",
        });
      }
    } catch (error) {
      onPressButton(1);
        showMessage({
          message: "Cập nhật thông tin thất bại",
          description: "Có lỗi xảy ra. Bạn vui lòng thử lại",
          type: "danger",
        });
    }
    
  };

  return (
    <View style={styles.container}>
      <TextComponent fontSize={sizes[6]} style={{ textAlign: "center" }}>
        Đổi lịch hẹn
      </TextComponent>
      <View style={{ padding: 16 }}>
        <TextComponent color={COLORS.Tertiary} fontSize={sizes[4]}>
          Thông tin liệu trình
        </TextComponent>
        <View>
          <View style={styles.row}>
            <View style={{ width: 70 }}>
              <TextComponent fontSize={sizes[4]}>Liệu trình</TextComponent>
            </View>
            <TextComponent fontSize={sizes[4]}>
              {schedule?.ServiceName ?? ""}
            </TextComponent>
          </View>
          <View style={styles.row}>
            <View style={{ width: 70 }}>
              <TextComponent fontSize={sizes[4]}>Thời gian</TextComponent>
            </View>
            <TextComponent fontSize={sizes[4]}>
              {helpers.convertUtcTime(schedule?.BookingTime)}
            </TextComponent>
          </View>
          <View style={styles.row}>
            <View style={{ width: 70 }}>
              <TextComponent fontSize={sizes[4]}>Cơ sở</TextComponent>
            </View>
            <TextComponent
              style={{ flex: 1, textAlign: "right" }}
              fontSize={sizes[4]}
              numberOfLines={1}
            >
              {schedule?.LocationAddress}
            </TextComponent>
          </View>
        </View>
      </View>
      <View style={{ padding: 16 }}>
        <TextComponent color={COLORS.Tertiary} fontSize={sizes[4]}>
          Lịch điều trị tiếp theo
        </TextComponent>
        <View style={{ paddingTop: 16 }}>
          <View>
            <TextComponent fontSize={sizes[4]}>
              Chọn ngày
            </TextComponent>
            <View>
              <TouchableOpacity style={styles.input} onPress={showDatePicker}>
                  <View style={styles.iconInput}>
                    <Ionicons name="calendar" color={COLORS.Gray} size={20} />
                  </View>
                <TextComponent style={{}}>
                  {date ? moment(date, 'MMM DD YYYY').format('DD-MM-YYYY') : 'Chọn ngày diễn ra liệu trình'}
                </TextComponent>
              </TouchableOpacity>
            </View>
          </View>
          <View style={{ paddingTop: 16 }}>
            <View style={{ flexDirection: "row", marginTop: 24 }}>
              <Button
                label="Huỷ"
                onPress={() => {
                  onPressButton(0);
                }}
                style={{
                  flex: 1,
                  marginRight: 8,
                  backgroundColor: COLORS.Lavender,
                }}
                labelColor={COLORS.YankeesBlue}
              />
              <Button
                label="Gửi yêu cầu"
                onPress={() => {
                  updateSchedule();
                }}
                style={{ flex: 1, marginLeft: 8 }}
              />
            </View>
          </View>
        </View>
      </View>

        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          date={new Date(moment(date,  'MMM DD YYYY').format())}
          onConfirm={handleConfirmDate}
          onCancel={hideDatePicker}
        />

    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.White,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 9,
  },
  input: {
    marginTop: 5,
    borderWidth: 2,
    borderColor: COLORS.Grayscale,
    padding: 16,
    paddingVertical: 12,
    borderRadius: 8,
    fontSize: sizes[3],
  },
  iconInput: {
    position: "absolute",
    right: 16,
    top: isAndroid ? 20 : 12,
  },
  datePicker: {
    width: 320,
    height: 260,
    position: "absolute",
    right: (width - 320) / 2,
    backgroundColor: COLORS.White,
    borderColor: COLORS.Gray,
    borderWidth: 1,
  },
});

//make this component available to the app
export default ChangeSchedule;
