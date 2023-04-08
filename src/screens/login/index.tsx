//import liraries
import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  Pressable,
  Alert,
} from "react-native";
import { useDispatch } from "react-redux";
import TextComponent from "components/Text";
import CheckBox from "@react-native-community/checkbox";
import { helpers } from "shared/ultis/helpers";
import { apiClient } from "../../services/baseAxios";
import ApiConfig from "../../config/config";
import { loginRequest, loginSuccess, parserToken } from "reduxCore/auth/slice";
import { COLORS } from "shared/constants/colors";
import { roleName, sizes } from "shared/constants/common";
import jwtDecode from "jwt-decode";
import { getUserRequest } from "reduxCore/user/slice";
import { isAndroid, isIOS } from "react-native-size-scaling";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { saveItem } from "shared/ultis/storageHelpers";
import { Constants } from "reduxCore/type";
import { validatePassword } from "shared/function";
import { GetFCMToken } from "shared/ultis/pushNotificationHelpers";
interface Props {
  callBack: () => void;
}
// create a component
const LoginScreen: React.FC<Props> = ({ callBack }) => {
  const dispatch = useDispatch();
  const [phone, setPhone] = useState("0966891479");
  const [password, setPassword] = useState("12345678@Abc");
  const [errorsPhone, setErrorsPhone] = useState("");
  const [errorsPassword, setErrorsPassword] = useState("");
  const [saveLogin, setSaveLogin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const createThreeButtonAlert = () => Alert.alert('Có lỗi xảy ra', 'Tài khoản/mật khẩu không phù hợp, vui lòng thử lại', [
    {text: 'OK', onPress: () => console.log('OK Pressed')},
  ]);

  const handleSubmit = async () => {
    setError("")
    setErrorsPhone("");
    setErrorsPassword("");
    if (helpers.isEmpty(phone)) {
      setErrorsPhone("Chưa nhập số điện thoại");
      return
    }
    if (helpers.isEmpty(password)) {
      setErrorsPassword("Chưa nhập password");
      return
    }
    if (!validatePassword(password) && password != "") {
      setErrorsPassword(
        "Mật khẩu phải có tối đa 8 ký tự"
      );
      return
    }
    if (!errorsPhone && !errorsPassword) {
      if(saveLogin) {
        saveItem(Constants.PHONE_NUMBER, phone);
        saveItem(Constants.PASSWORD, password);
      }
      try {
        setLoading(true);
        const res = await apiClient.post(ApiConfig.LOGIN, {
          PhoneNumber: phone,
          Password: password,
        });
        if (res.AppCode == 200) {
          let parsertoken: any = jwtDecode(res.Data.Token);
          if(parsertoken.role === roleName.CUSTOMER || parsertoken.role === roleName.COUNSELOR || parsertoken.role === roleName.TECHNICIAN ) {
            await saveItem(Constants.ACCESS_TOKEN, res.Data.Token);
            await saveItem(Constants.REFRESH_TOKEN, res.Data.RefreshToken);
            await saveItem(Constants.USER_ID, parsertoken.user_id);
            dispatch(getUserRequest(parsertoken.user_id)); 
            dispatch(parserToken(parsertoken));
            GetFCMToken()
            let fcmToken = await AsyncStorage.getItem("fcmToken");
            if(!!fcmToken) {
              await apiClient.post(ApiConfig.REGISTER_DEVICE, {
              UserId: parsertoken.user_id,
              DeviceToken: fcmToken,
              DeviceType: Platform.OS === "android" ? 1 : 2,
            });          
            }
            setTimeout(() => {
              setLoading(false);
              dispatch(loginSuccess(res.Data));
            }, 300);
          } else {
            setLoading(false);
            createThreeButtonAlert()
          }
        } else {
          setError('Tài khoản/mật khẩu không phù hợp, vui lòng thử lại')
          setLoading(false);
          createThreeButtonAlert()
        }
      } catch (error) {
        setError('Tài khoản/mật khẩu không phù hợp, vui lòng thử lại')
        setLoading(false);
        createThreeButtonAlert()
      }
    }

  };

  return (
    <View style={{ marginVertical: 12 }}>
      <View style={{ margin: 16 }}>
        <TextComponent color={COLORS.Gray}>Số điện thoại</TextComponent>
        <TextInput
          style={style.textinput}
          value={phone}
          textContentType="oneTimeCode"
          onChangeText={(text) => setPhone(text)}
          placeholder="Nhập số điện thoại"
          placeholderTextColor="gray"
          keyboardType="numeric"
        />
        {errorsPhone && (
          <TextComponent color="red">{errorsPhone}</TextComponent>
        )}
      </View>
      <View style={{ marginHorizontal: 16 }}>
        <TextComponent color={COLORS.Gray}>Mật khẩu</TextComponent>
        <TextInput
          style={style.textinput}
          value={password}
          textContentType="oneTimeCode"
          onChangeText={(text) => setPassword(text)}
          placeholder="Nhập mật khẩu"
          placeholderTextColor="gray"
          secureTextEntry
        />
        {errorsPassword && (
          <TextComponent color="red">{errorsPassword}</TextComponent>
        )}
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          margin: 16,
        }}
      >
        <View style={style.checkWrap}>
          <CheckBox
            value={saveLogin}
            onValueChange={(newValue) => setSaveLogin(newValue)}
            offAnimationType="fill"
            onFillColor={COLORS.CatalinaBlue}
            tintColors={{ true: COLORS.CatalinaBlue, false: "#A1ADC8" }}
            style={{
              width: 20,
              height: 20,
            }}
            boxType="square"
            onCheckColor={COLORS.White}
            onTintColor={COLORS.White}
          />
          {isAndroid && <View style = {{width: 5}}/>}
          <Pressable onPress = {() => {setSaveLogin(!saveLogin)}}>
            <TextComponent style={{ paddingLeft: 5, color: COLORS.Gray }}>
            Lưu đăng nhập
            </TextComponent>
          </Pressable>
        </View>
        <TouchableOpacity style={style.checkWrap} onPress={() => callBack()}>
          <TextComponent style={{ color: COLORS.CatalinaBlue }}>
            Quên mật khẩu?
          </TextComponent>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={style.buttonLogin} onPress={handleSubmit}>
        {loading == false ? (
          <TextComponent
            style={{
              fontSize: sizes[4],
              fontWeight: "500",
              color: COLORS.White,
            }}
          >
            Đăng nhập
          </TextComponent>
        ) : (
          <ActivityIndicator
            animating={true}
            size="small"
            color={COLORS.White}
          />
        )}
      </TouchableOpacity>
      {/* {error && <TextComponent color="red" style={{paddingHorizontal: 15,}}>{error}</TextComponent>} */}
    </View>
  );
};

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.Cultured,
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
  buttonLogin: {
    backgroundColor: COLORS.YankeesBlue,
    padding: isIOS ? 16 : 10,
    borderRadius: 12,
    alignItems: "center",
    marginVertical: 8,
    marginHorizontal: 16,
  },
});

//make this component available to the app
export default LoginScreen;
