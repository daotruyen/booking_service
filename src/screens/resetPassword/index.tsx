//import liraries
import Button from "components/CustomButton";
import InputCustom from "components/input";
import TextComponent from "components/Text";
import React, { Component, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { COLORS } from "shared/constants/colors";
import { validatePassword } from "shared/function/validate";
import { Pressable } from "react-native";
import { apiClient } from "services/baseAxios";
import ApiConfig from "config/config";
interface Props {
  callBack: () => void;
  callBackPop: () => void;
  tokenResetPassword: string;
  phone: string;
}
// create a component
const ResetPasswordScreen: React.FC<Props> = ({
  callBack,
  callBackPop,
  tokenResetPassword,
  phone,
}) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorsPassword, setErrorsPassword] = useState("");
  const [errorsConfirmPw, setErrorsConfirmPw] = useState("");
  const [loading, setLoading] = useState(false);

  const errorDefault = () => {
    setErrorsPassword("");
    setErrorsConfirmPw("");
  };
  const onCreateCustomer = async () => {
    errorDefault();
    if (!validatePassword(password) && password != "") {
      setErrorsPassword(
        "Mật khẩu phải có tối đa 8 ký tự"
      );
    }

    if (password === "") {
      setErrorsPassword("Chưa nhập mật khẩu");
    }
    if (confirmPassword !== password) {
      setErrorsConfirmPw("Mật khẩu không trùng khớp");
    }
    setLoading(true);
    if (validatePassword(password) && confirmPassword == password) {

      const res = await apiClient.post(ApiConfig.RESET_PASSWORD, {
        ResetPasswordToken: tokenResetPassword,
        PhoneNumber: phone,
        Password: password,
      });
      const {Data, AppCode} = res;
      if(AppCode === 200) {
        callBack()
      } 
    }

    setLoading(false);
  };
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={callBackPop}>
          <Ionicons name="arrow-back" size={20} />
        </Pressable>
        <TextComponent children="Khôi Phục Mật Khẩu" bold />
        <View />
      </View>
      <View style={{ paddingVertical: 24 }}>
        <TextComponent
          color={COLORS.Gray}
          children="Quý khách vui lòng tạo mật khẩu mới"
        />
      </View>
      <InputCustom
        wrapperStyle={styles.wrapInput}
        titleStyle={{ color: COLORS.Gray }}
        title="Nhập mật khẩu"
        value={password}
        onChangeText={(text) => setPassword(text)}
        placeholder="Nhập mật khẩu"
        secureTextEntry={true}
        error={errorsPassword}
      />
      <InputCustom
        wrapperStyle={styles.wrapInput}
        titleStyle={{ color: COLORS.Gray }}
        title="Xác nhận mật khẩu"
        value={confirmPassword}
        onChangeText={(text) => setConfirmPassword(text)}
        placeholder="Xác nhận mật khẩu"
        secureTextEntry={true}
        error={errorsConfirmPw}
      />
      <Button
        label="Xác nhận"
        labelColor={COLORS.White}
        onPress={onCreateCustomer}
        loading={loading}
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
  wrapInput: { paddingBottom: 16 },
});

//make this component available to the app
export default ResetPasswordScreen;
