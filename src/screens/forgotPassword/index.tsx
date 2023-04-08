//import liraries
import Button from "components/CustomButton";
import InputCustom from "components/input";
import TextComponent from "components/Text";
import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { COLORS } from "shared/constants/colors";
import { Pressable } from 'react-native';
import { validatePhone } from 'shared/function';
import { apiClient } from 'services/baseAxios';
import ApiConfig from "config/config";

interface Props {
  callBack: (phone: string, timeToLive: number) => void;
  callBackPop: () => void;
}

// create a component
const ForgotPasswordScreen: React.FC<Props>  = ({callBack,callBackPop}) => {
  const [phone, setPhone] = useState("");
  const [errorPhone, setErrorPhone] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const sendOTP = async() => {
    setLoading(true)
    setErrorPhone("");
    setError("")
    if(validatePhone(phone)) {
      const verifyAccount = await apiClient.post(ApiConfig.ACCOUNT_VERIFICATION, {
        PhoneNumber: phone
      });
      const {AppCode, Data} = verifyAccount;
      if(AppCode == 200) {
        callBack(phone, Data.TimeToLive)
      }
       else {
        setError('Số điện thoại chưa được đăng ký')
       }
    } else {
      setErrorPhone('Số điện thoại không đúng định dạng')
    }
    setLoading(false)
  }
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={callBackPop}>
          <Ionicons name="arrow-back" size={20} />
        </Pressable>
        <TextComponent children="Quên mật khẩu" bold />
        <View />
      </View>
      <View style={{ paddingVertical: 24 }}>
        <TextComponent
          color={COLORS.Gray}
          children="Hệ thống sẽ gửi vào số điện thoại dùng để đăng ký tài khoản của quý khách mã OTP để khôi phục mật khẩu"
        />
      </View>
      <InputCustom
        wrapperStyle={{ marginBottom: 16 }}
        title="Số điện thoại đăng ký"
        placeholder="Nhập số điện thoại đăng ký"
        value={phone}
        onChangeText={(text) => setPhone(text)}
        error = {errorPhone}
      />
      <Button
        label="Gửi"
        style={!phone ? styles.disable : {}}
        labelColor={!phone ? COLORS.Gray : COLORS.White}
        disabled={!phone}
        onPress={sendOTP}
        loading={loading}
      />
      <TextComponent color="red">{error}</TextComponent>
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
});

//make this component available to the app
export default ForgotPasswordScreen;
