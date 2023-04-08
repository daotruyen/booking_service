import TextComponent from "components/Text";
import ApiConfig from "config/config";
import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TextInput
} from "react-native";
import { apiClient } from "../../services/baseAxios";
import { helpers } from "shared/ultis/helpers";
import { COLORS } from 'shared/constants/colors';
import { sizes } from "shared/constants/common";
import { isIOS } from "react-native-size-scaling";
import { RegisterModel } from "interfaces/RegisterModel";
import { validatePassword } from "shared/function";

interface Props {
  callBack: (index: number) => void;
  onRegisterUser: (registerModel: RegisterModel) => void;
}

const RegisterScreen: React.FC<Props> = ({ callBack, onRegisterUser }) => {
  const [username, setUsername] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorsUsername, setErrorsUsername] = useState("");
  const [errorsPassword, setErrorsPassword] = useState("");
  const [errorsPhone, setErrorsPhone] = useState("");
  const [errorsConfirmPw, setErrorsConfirmPw] = useState("");
  const [errorsRegisterFail, setErrorsRegisterFail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setErrorsUsername("")
    setErrorsConfirmPw("")
    setErrorsPassword("")
    setErrorsPhone("")
    // check email
    if (helpers.isEmpty(username)) {
      setErrorsUsername("Chưa nhập họ và tên");
      return;
    }
    if (helpers.isEmpty(phoneNumber)) {
      setErrorsPhone("Chưa nhập số điện thoại");
      return;
    }
    if (helpers.isEmpty(password)) {
      setErrorsPassword('Chưa nhập mật khẩu');
      return;
    }
    if (password !== confirmPassword) {
      setErrorsConfirmPw('Mật khẩu không đúng');
      return;
    }
    if (!validatePassword(password) && password != "") {
      setErrorsPassword(
        "Mật khẩu phải có tối đa 8 ký tự"
      );
      return
    }

    setLoading(true);
    if (!helpers.isEmpty(username) && !helpers.isEmpty(password) && !helpers.isEmpty(phoneNumber) && password === confirmPassword) {
      // try {
      //   const res = await apiClient.post(ApiConfig.SIGN_UP, { FullName: username, PhoneNumber: phoneNumber, Password: password, });
      //   await setLoading(false);
      //   if (res.AppCode == 200) {
      //     callBack(1)
      //   } else {
      //     setErrorsRegisterFail(helpers.convertStatusCodeToString(res.AppCode) ?? 'Đăng ký thất bại!');
      //   }
      // } catch (error) {
      //   await setLoading(false);
      //   setErrorsRegisterFail('Đăng ký thất bại!')
      // }
      var registerModel = { FullName: username, PhoneNumber: phoneNumber, Password: password } as RegisterModel;

      onRegisterUser(registerModel);

    }
    setLoading(false);
  }
  return (
    <ScrollView style={{ marginVertical: 12 }}>
      <View style={style.wrapInput}>
        <TextComponent color={COLORS.Gray}>Số điện thoại</TextComponent>
        <TextInput
          style={style.textinput}
          value={phoneNumber}
          textContentType="none"
          onChangeText={(phone) => setPhoneNumber(phone)}
          placeholder="Nhập số điện thoại"
          placeholderTextColor="gray"
          keyboardType="numeric"
        />
        {errorsPhone && <TextComponent color="red">{errorsPhone}</TextComponent>}
      </View>
      <View style={style.wrapInput}>
        <TextComponent color={COLORS.Gray}>Mật khẩu</TextComponent>
        <TextInput
          style={style.textinput}
          value={password}
          textContentType="none"
          onChangeText={(text) => setPassword(text)}
          placeholder="Nhập mật khẩu"
          placeholderTextColor="gray"
          secureTextEntry
        />
        {errorsPassword && <TextComponent color="red">{errorsPassword}</TextComponent>}
      </View>
      <View style={style.wrapInput}>
        <TextComponent color={COLORS.Gray}>Xác nhận mật khẩu</TextComponent>
        <TextInput
          style={style.textinput}
          value={confirmPassword}
          textContentType="none"
          onChangeText={(text) => setConfirmPassword(text)}
          placeholder="Xác nhận mật khẩu"
          placeholderTextColor="gray"
          secureTextEntry
        />
        {errorsConfirmPw && <TextComponent color="red">{errorsConfirmPw}</TextComponent>}
      </View>
      <View style={style.wrapInput}>
        <TextComponent color={COLORS.Gray}>Họ và tên</TextComponent>
        <TextInput
          style={style.textinput}
          value={username}
          textContentType="none"
          onChangeText={(text) => setUsername(text)}
          placeholder="Nhập họ và tên"
          placeholderTextColor="gray"
        />
        {errorsUsername && <TextComponent color="red">{errorsUsername}</TextComponent>}
      </View>
      <TouchableOpacity
        style={{
          backgroundColor: COLORS.YankeesBlue,
          padding: isIOS ? 16 : 10,
          borderRadius: 12,
          alignItems: "center",
          marginVertical: 8,
          marginHorizontal: 16,
          marginTop: 16,
        }}
        onPress={
          handleSubmit
        }
      >
        {loading == false ?
          <TextComponent style={{ fontSize: sizes[4], fontWeight: "500", color: COLORS.White }}>
            Đăng ký
          </TextComponent> :
          <ActivityIndicator
            animating={true}
            size="small"
            color={COLORS.White}
          />}
      </TouchableOpacity>
      <View style={{ padding: 16 }}>
        {errorsRegisterFail && <TextComponent color="red">{errorsRegisterFail}</TextComponent>}
      </View>
    </ScrollView>
  );
};
const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  placeholderStyle: {},
  textinput: {
    padding: isIOS ? 16 : 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginVertical: 5,
    borderColor: COLORS.LightSilver,
  },
  checkWrap: {
    flexDirection: "row",
    alignItems: "center",
    // marginTop: 15,
  },
  wrapInput: { marginHorizontal: 16, marginTop: 16 }
});

export default RegisterScreen;
