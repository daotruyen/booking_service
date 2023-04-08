//import liraries
import Header from "components/Headers";
import React from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { COLORS } from "shared/constants/colors";
import TextComponent from "components/Text";
import InputCustom from "components/input";
import { useState } from "react";
import Button from "components/CustomButton";
import { useDispatch } from "react-redux";
import { apiClient } from "services/baseAxios";
import ApiConfig from "config/config";
import { globalLoading } from "components";
import FlashMessage, { showMessage } from "react-native-flash-message";
import { HOME_PAGE } from "shared/constants/routeNames";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from "moment";
import Ionicons from "react-native-vector-icons/Ionicons";
import { sizes } from "shared/constants/common";
import { navigate } from "navigators";

// create a component
const FeedbackScreen = () => {
  const dispatch = useDispatch();
  // const navigation = useNavigation();

  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [content, setContent] = useState("");
  const [errorTitle, setErrorTitle] = useState("");
  const [errorContent, setErrorContent] = useState("");
  const [errorDate, setErrorDate] = useState("");

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirmDate = (date: any) => {
    setDate(date);
    hideDatePicker();
  };
  const onSendFeedback = async () => {
    if (title != "" && content != "" && date != "") {
      globalLoading.show();
      try {
        const res = await apiClient.post(ApiConfig.FEEDBACK, {
          Title: title,
          Content: content,
        });
        if (res.AppCode == 200) {
          globalLoading.hide();
          setTitle("");
          setContent("");
          setDate("");
          await showMessage({
            message: "🎉 Khiếu nại đã được ghi nhận",
            description:
              "Chúng tôi sẽ khắc phục sự cố này và sớm có phản hồi tới quý khách",
            type: "success",
          });
          setTimeout(() => {
            navigate(HOME_PAGE);
          }, 2000);
        } else {
          globalLoading.hide();
          showMessage({
            message: "Khiếu nại chưa được ghi nhận",
            description:
              "Chúng tôi sẽ khắc phục sự cố này và sớm có phản hồi tới quý khách",
            type: "danger",
          });
        }
      } catch (error) {
        globalLoading.hide();
      }
    } else {
      if (title == "") {
        setErrorTitle("Chưa nhập tiêu đề");
      } else {
        setErrorTitle("");
      }
      if (content == "") {
        setErrorContent("Chưa nhập nội dung");
      } else {
        setErrorContent("");
      }
      if (date == "") {
        setErrorDate("Chưa chọn ngày");
      } else {
        setErrorDate("");
      }
    }
  };
  return (
    <ScrollView style={styles.container}>
      <Header showBack={false} />
      <View style={{ margin: 16 }}>
        <TextComponent fontSize={sizes[4]} bold>
          Gửi khiếu nại
        </TextComponent>
      </View>
      <View style={{ marginHorizontal: 16 }}>
        <InputCustom
          wrapperStyle={{ marginBottom: 16 }}
          title="Tiêu đề"
          isRequired={true}
          titleStyle={styles.titleStyle}
          style={{ fontSize: 16 }}
          placeholder="Vui lòng nhập tiêu đề"
          value={title}
          onChangeText={(text) => setTitle(text)}
          error={errorTitle}
        />
        <View style={{ paddingBottom: 16 }}>
          <TextComponent color={COLORS.Gray} fontSize={sizes[3]}>
            Thời gian <TextComponent style={{ color: "red" }}> *</TextComponent>
          </TextComponent>
          <View style={{ paddingTop: 5 }}>
            <TouchableOpacity onPress={showDatePicker}>
              <View pointerEvents="none">
                <TextInput
                  editable={false}
                  style={styles.input}
                  value={
                    date != "" ? moment.utc(date).format("YYYY-MM-DD") : ""
                  }
                  placeholder="Vui lòng chọn thời gian"
                />
                {errorDate && (
                  <TextComponent color="red">{errorDate}</TextComponent>
                )}
              </View>
            </TouchableOpacity>
            <View style={styles.iconInput}>
              <Ionicons name="calendar" color={COLORS.Gray} size={20} />
            </View>
          </View>
        </View>
        <InputCustom
          wrapperStyle={{ height: 110 }}
          style={{
            flex: 1,
            justifyContent: "flex-start",
            alignContent: "flex-start",
            textAlignVertical: 'top',
            paddingTop: 8,
          }}
          title="Nội dung"
          isRequired={true}
          titleStyle={styles.titleStyle}
          placeholder="Vui lòng nhập nội dung khiếu nại"
          value={content}
          onChangeText={(text) => setContent(text)}
          numberOfLines={999}
          error={errorContent}
        />
        <Button
          label="Gửi phản ánh"
          onPress={onSendFeedback}
          style={{ marginTop: 16 }}
        />
      </View>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        date={new Date()}
        onConfirm={handleConfirmDate}
        onCancel={hideDatePicker}
      />
      <FlashMessage position="top" />
    </ScrollView>
  );
};
// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.White,
  },
  logoName: {
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 16,
    paddingBottom: 36,
  },
  input: {
    height: 40,
    borderWidth: 1,
    padding: 16,
    paddingVertical: 12,
    borderRadius: 8,
    fontSize: sizes[4],
    borderColor: COLORS.LightSilver,
  },
  iconInput: {
    position: "absolute",
    right: 16,
    top: 14,
  },
  titleStyle: {
    fontSize: sizes[4],
  },
});

//make this component available to the app
export default FeedbackScreen;
