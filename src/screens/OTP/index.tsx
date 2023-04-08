//import liraries
import RnOtpTimer from "components/CountDown";
import Button from "components/CustomButton";
import InputCustom from "components/input";
import OTPTextView from "components/OTPInput";
import TextComponent from "components/Text";
import ApiConfig from "config/config";
import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Pressable,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { apiClient } from "services/baseAxios";
import { COLORS } from "shared/constants/colors";
interface Props {
  callBack: (tokenReset: string) => void;
  callBackPop: () => void;
  phone: string;
  timeToLive: number;
}
// create a component
const OTPScreen: React.FC<Props> = ({
  callBack,
  callBackPop,
  phone,
  timeToLive,
}) => {
  const [valueOTP, setValueOTP] = useState("");
  const [errorOTP, setErrorOTP] = useState("");
  const [loading, setLoading] = useState(false);
  const onConfirmOTP = async () => {
    setLoading(true);
    setErrorOTP("");
    if (valueOTP.length == 7) {
      const res = await apiClient.post(ApiConfig.OTP_VERIFICATION, {
        PhoneNumber: phone,
        OTP: valueOTP,
      });
      const { Data, AppCode } = res;
      if (AppCode == 200) {
        callBack(Data.VerifiedUserToken);
      } else {
        setErrorOTP("OTP không đúng")
      }

    } else {
      setErrorOTP("OTP chưa đúng");
    }
    setLoading(false)
  };
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={callBackPop}>
          <Ionicons name="arrow-back" size={20} />
        </Pressable>
        <TextComponent children="Nhập Mã Xác Nhận" bold />
        <View />
      </View>
      <View style={{ paddingVertical: 24 }}>
        <TextComponent
          color={COLORS.Gray}
          children={`Quý khách vui lòng nhập mã OTP được gửi tới số điện thoại ${phone}`}
        />
      </View>
      <OTPTextView
        handleTextChange={(text: any) => {
          setValueOTP(text);
        }}
        containerStyle={styles.textInputContainer}
        textInputStyle={styles.roundedTextInput}
        inputCount={7}
        inputCellLength={1}
        tintColor="#1E2329"
      />
      {<TextComponent color="red">{errorOTP}</TextComponent>}
      <Button
        label="Xác nhận"
        labelColor={COLORS.White}
        onPress={onConfirmOTP}
        loading={loading}
      />
      <TextComponent>
        Quý khách chưa nhận được mã?{" "}
        <TouchableWithoutFeedback>
          <TextComponent color={COLORS.BrownYellow}>
            Gửi lại mã xác nhận
          </TextComponent>
        </TouchableWithoutFeedback>
      </TextComponent>
      <RnOtpTimer
        minutes={0}
        seconds={timeToLive}
        resendButtonStyle={styles.button}
        resendButtonTextStyle={styles.buttonText}
        resendButtonAction={() => {
          console.log("otp resent!");
        }}
      />
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  disable: {
    backgroundColor: COLORS.Grayscale,
  },
  textInputContainer: {
    marginBottom: 20,
  },
  roundedTextInput: {
    borderRadius: 10,
    borderWidth: 1,
    width: 40,
    height: 40,
  },
  button: {
    elevation: 8,
    backgroundColor: "#009688",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  buttonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
    alignSelf: "center",
  },
});

//make this component available to the app
export default OTPScreen;
