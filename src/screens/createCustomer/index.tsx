//import liraries
import Button from "components/CustomButton";
import Header from "components/Headers";
import InputCustom from "components/input";
import TextComponent from "components/Text";
import ApiConfig from "config/config";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import FlashMessage, { showMessage } from "react-native-flash-message";
import { apiClient } from "services/baseAxios";
import { COLORS } from "shared/constants/colors";
import { CustomerRoleId } from "shared/constants/common";
import { validatePassword, validatePhone } from "shared/function";
import { Constants } from '../../reduxCore/type/index';
import { Portal } from "@gorhom/portal";
import BottomSheet, { BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import OTPScreen from "screens/OTP";
import { globalLoading } from "components";

// create a component
const CreateCustomerScreen = () => {
  const bottomSheetRef = useRef<BottomSheet>(null);

  // variables
  const snapPoints = useMemo(() => ["1", "60%", "80%"], []);

  const [username, setUsername] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorsUsername, setErrorsUsername] = useState("");
  const [errorsPassword, setErrorsPassword] = useState("");
  const [errorsPhone, setErrorsPhone] = useState("");
  const [errorsConfirmPw, setErrorsConfirmPw] = useState("");
  const [errorsRegisterFail, setErrorsRegisterFail] = useState("");
  const [loading, setLoading] = useState(false);
  const [timeToLive, setTimeToLive] = useState(0);
  const [isOpenOTPScreen, setIsOpenOTPScreen] = useState(false);

  const handleSnapPress = useCallback((index: number) => {
    bottomSheetRef.current?.snapToIndex(index);
  }, []);

  const errorDefault = () => {
    setErrorsRegisterFail("");
    setErrorsPassword("");
    setErrorsConfirmPw("");
    setErrorsUsername("");
    setErrorsPhone("");
  };

  const valueDefault = () => {
    setPhoneNumber("");
    setUsername("");
    setPassword("");
    setConfirmPassword("");
  }

  const onVerifyUser = async () => {
    errorDefault();

    let isValidated = true;
    if (!validatePassword(password) && password != "") {
      setErrorsPassword(
        "Mật khẩu phải có tối đa 8 ký tự"
      );
      isValidated = false;
    }
    if (!validatePhone(phoneNumber) && phoneNumber != "") {
      setErrorsPhone("Số điện thoại không đúng định dạng");
      isValidated = false;
    }
    if (username == "") {
      setErrorsUsername("Chưa nhập tên");
      isValidated = false;
    }
    if (phoneNumber == "") {
      setErrorsPhone("Chưa nhập số điện thoại");
      isValidated = false;
    }
    if (password == "") {
      setErrorsPassword("Chưa nhập mật khẩu");
      isValidated = false;
    }
    if (confirmPassword != password) {
      setErrorsConfirmPw("Mật khẩu không trùng khớp");
      isValidated = false;
    }

    if (!isValidated) {
      return
    }
    else {
      // Gửi OTP đến SĐT đăng ký
      await sendOTPForRegisterUser(phoneNumber);
    }
  }

  const openOTPScreen = () => {
    handleSnapPress(1);
    setIsOpenOTPScreen(true);
  }

  const closeOTPScreen = () => {
    closeBottomSheet();
    setIsOpenOTPScreen(false);
  }

  const sendOTPForRegisterUser = async (phoneNumber: string) => {
    globalLoading.show();
    try {
      const res = await apiClient.post(ApiConfig.REGISTER_VERIFICATION, {
      PhoneNumber: phoneNumber
    });
    globalLoading.hide();
    const { AppCode, Data } = res;
    if (AppCode == 200) {
      setTimeToLive(Data.TimeToLive);
      // Show màn nhập OTP để xác minh người dùng
      openOTPScreen();
    }
    else {
      // Thông báo lỗi
      showMessage({
        message: "Thất bại",
        description: "Có lỗi xảy ra. Vui lòng thử lại sau giây lát!",
        type: "danger",
      });
    }
    } catch (error) {
      globalLoading.hide();
      showMessage({
        message: "Thất bại",
        description: "Có lỗi xảy ra. Vui lòng thử lại sau giây lát!",
        type: "danger",
      });
    }
  }

  const onCallBackOTPScreen = async (token: string) => {
    // Tạo mới tài khoản người dùng
    try {
      setLoading(true);
      const model = { PhoneNumber: phoneNumber, Password: password, FullName: username, VerifiedUserToken: token }
      const res = await apiClient.post(ApiConfig.SIGN_UP_VERIFIED_USER, model);
      setLoading(false);
      if (res.AppCode == 200) {
        valueDefault()
        showMessage({
          message: "🎉 Đăng ký tài khoản khách thành công",
          description: "Thông tin tài khoản khách hàng đã được thêm.",
          type: "success",
        });
        closeOTPScreen();
      }
      else {
        showMessage({
          message: "Đăng ký tài khoản khách thất bại",
          description: "Thông tin tài khoản khách hàng chưa được thêm.",
          type: "danger",
        });
        setErrorsRegisterFail("Tạo mới thất bại");
      }
    } catch (error) {
      setLoading(false);
      // Thông báo lỗi
      showMessage({
        message: "Thất bại",
        description: "Có lỗi xảy ra. Vui lòng thử lại sau giây lát!",
        type: "danger",
      });
    }
  }

  const closeBottomSheet = () => {
    bottomSheetRef.current?.close();
  }

  useEffect(() => {
    closeBottomSheet();
  }, []);

  return (
    <View style={styles.container}>
      <Header />
      <ScrollView style={{ marginVertical: 12 }}>
        <InputCustom
          wrapperStyle={styles.wrapInput}
          titleStyle={{ color: COLORS.Gray }}
          title="Số điện thoại"
          value={phoneNumber}
          onChangeText={(phone) => setPhoneNumber(phone)}
          placeholder="Nhập số điện thoại"
          error={errorsPhone}
          keyboardType="numeric"
        />
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
        <InputCustom
          wrapperStyle={styles.wrapInput}
          titleStyle={{ color: COLORS.Gray }}
          title="Nhập họ và tên"
          value={username}
          onChangeText={(text) => setUsername(text)}
          placeholder="Nhập họ và tên"
          error={errorsUsername}
        />

        <Button
          label="Đăng ký"
          labelColor={COLORS.White}
          onPress={onVerifyUser}
          style={{ margin: 16, marginTop: 32 }}
          loading={loading}
        />
        {errorsRegisterFail && (
          <TextComponent color="red" style={{ marginHorizontal: 16 }}>{errorsRegisterFail}</TextComponent>
        )}
      </ScrollView>
      <FlashMessage position="top" />
      <Portal>
        <BottomSheet
          ref={bottomSheetRef}
          index={-1}
          snapPoints={snapPoints}
          onChange={(index) => {
          }}
          enablePanDownToClose={true}
          backdropComponent={BottomSheetBackdrop}
          style={{ zIndex: 99 }}
        >
          {
            isOpenOTPScreen &&
            <OTPScreen
              callBack={onCallBackOTPScreen}
              callBackPop={closeBottomSheet}
              phone={phoneNumber}
              timeToLive={timeToLive}
            />
          }
        </BottomSheet>
      </Portal>
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  wrapInput: { marginHorizontal: 16, marginTop: 16 },
});

//make this component available to the app
export default CreateCustomerScreen;
