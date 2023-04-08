//import liraries
import Header from "components/Headers";
import React from "react";
import { View, StyleSheet, Image, ScrollView } from "react-native";
import { COLORS } from "shared/constants/colors";
import { image } from "assets/image";
import TextComponent from "components/Text";
import InputCustom from "components/input";
import { useState } from "react";
import Button from "components/CustomButton";
import { useDispatch } from "react-redux";
import { logout } from "reduxCore/auth/slice";
import {
  getUserRequest,
  resetUser,
  selectUser,
  updateUserSuccess,
} from "reduxCore/user/slice";
import { globalLoading } from "components";
import { Dropdown } from "react-native-element-dropdown";
import { isIOS, scale } from "react-native-size-scaling";
import { useEffect } from "react";
import { apiClient } from "services/baseAxios";
import ApiConfig from "config/config";
import { useSelector } from "react-redux";
import { selectAuth } from "reduxCore/auth/slice";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from "moment";
import FlashMessage, { showMessage } from "react-native-flash-message";
import { CustomerRoleId, REFRESH_TOKEN_KEY, sizes, TOKEN_KEY, FCM_TOKEN } from "shared/constants/common";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Constants } from "reduxCore/type";

export interface Address {
  Id?: string;
  Name?: string;
}
const dataSex = [
  { id: 0, name: "Nam" },
  { id: 1, name: "Nữ" },
];

// create a component
const UserScreen = (props: any) => {
  const { route, navigation } = props;
  const dispatch = useDispatch();
  const { userId, phoneNumber } = useSelector(selectAuth);
  const { name, birthday, sex, email, address, province, district, ward } =
    useSelector(selectUser);
  const [nameInput, setName] = useState(name);  
  const [errorNameInput, setErrorName] = useState('');

  const [birthdayInput, setBirthday] = useState(
    birthday == null ? "" : birthday
  );
  const [sexInput, setSex] = useState(dataSex[sex]);
  const [emailInput, setEmail] = useState(email);
  const [addressInput, setAddress] = useState(address);
  const [dataProvinces, setDataProvinces] = useState([]);
  const [provinces, setProvinces] = useState<Address>(province);
  const [dataDistricts, setDataDistricts] = useState([]);
  const [districts, setDistricts] = useState<Address>(district);
  const [dataWards, setDataWards] = useState([]);
  const [wards, setWards] = useState<Address>(ward);
  const [isFocusProvinces, setIsFocusProvinces] = useState(false);
  const [isFocusDistricts, setIsFocusDistricts] = useState(false);
  const [isFocusWards, setIsFocusWards] = useState(false);
  const [isFocusSex, setIsFocusSex] = useState(false);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);

  const onLogout = async() => {
    setLogoutLoading(true)
    try {
      let fcmToken = await AsyncStorage.getItem(FCM_TOKEN);
      const res = await apiClient.post(ApiConfig.REMOVE_TOKEN, {
        UserId: userId,
        DeviceToken: fcmToken,
      })
      if(res.AppCode === 200) {
        dispatch(logout());
        dispatch(resetUser());
        await AsyncStorage.removeItem(TOKEN_KEY);
        await AsyncStorage.removeItem(REFRESH_TOKEN_KEY);
        await AsyncStorage.removeItem(Constants.PHONE_NUMBER);
        await AsyncStorage.removeItem(Constants.PASSWORD)
      }
      setLogoutLoading(false)
    } catch (error) {
      setLogoutLoading(false)

    }
  };
  const onUpdateUser = async () => {
    setErrorName('')
    if (nameInput) {
      globalLoading.show();
      try {
        const res = await apiClient.put(ApiConfig.USER, {
        UserId: userId,
        Fullname: nameInput,
        DateOfBirth: birthdayInput == "" ? null : birthdayInput,
        Gender: sexInput?.id ?? null,
        Email: emailInput,
        ProvinceId: provinces?.Id ?? null,
        DistrictId: districts?.Id ?? null,
        WardId: wards?.Id ?? null,
        DetailAddress: addressInput,
        RoleId: null,
      });
      const { AppCode, Data } = res;
      if (AppCode === 200) {
        setTimeout(() => {
          globalLoading.hide();
          dispatch(
            updateUserSuccess({
              Fullname: nameInput,
              DateOfBirth: birthdayInput == "" ? null : birthdayInput,
              Gender: sexInput?.id ?? null,
              Email: emailInput,
              Province: provinces ?? null,
              District: districts ?? null,
              Ward: wards ?? null,
              DetailAddress: addressInput,
            })
          );
          showMessage({
            message: "🎉 Cập nhật thành công",
            description: "Thông tin cá nhân đã được cập nhật!",
            type: "success",
          });
        }, 1000);
      } else {
        setTimeout(() => {
          globalLoading.hide();
          showMessage({
            message: "Cập nhật thất bại",
            description: "Có lỗi xảy ra. Thông tin cá nhân chưa được cập nhật!",
            type: "danger",
          });
        }, 1000);
      }
      } catch (error) {
        globalLoading.hide();

        showMessage({
          message: "Cập nhật thất bại",
          description: "Có lỗi xảy ra. Thông tin cá nhân chưa được cập nhật!",
          type: "danger",
        });
      }
      
    } else {
      setErrorName('Họ và tên không được để trống')
    }
  };

  const getProvinces = async () => {
    const res = await apiClient.get(ApiConfig.PROVINCES, {});
    if (res.AppCode == 200) {
      setDataProvinces(res.Data);
    }
  };
  const getDistricts = async () => {
    const res = await apiClient.get(ApiConfig.DISTRICTS, {
      provinceId: provinces.Id,
    });
    if (res.AppCode == 200) {
      setDataDistricts(res.Data);
    }
  };
  const getWards = async () => {
    const res = await apiClient.get(ApiConfig.WARDS, {
      districtId: districts.Id,
    });
    if (res.AppCode == 200) {
      setDataWards(res.Data);
    }
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirmDate = (date: any) => {
    setBirthday(date);
    hideDatePicker();
  };
  useEffect(() => {
    dispatch(getUserRequest(userId));
    getProvinces();
  }, []);

  useEffect(() => {
    if (provinces) {
      getDistricts();
    }
  }, [provinces]);

  useEffect(() => {
    if (districts) {
      getWards();
    }
  }, [districts]);

  return (
    <View style={styles.container}>
      <Header showBack={route.params.showBack} />
      <ScrollView style={styles.container}>
        <View style={styles.logoName}>
          <Image source={image.logo2} style={{ marginBottom: 6, width: 144, height: 144 }} />
        </View>
        <View style={{ marginHorizontal: 16 }}>
          <InputCustom
            wrapperStyle={{ marginBottom: 16 }}
            title="Họ và tên"
            placeholder="Nhập họ và tên"
            value={nameInput}
            onChangeText={(text) => setName(text)}
            error = {errorNameInput}
          />
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 16,
            }}
          >
            <InputCustom
              wrapperStyle={{ flex: 1, paddingRight: 8 }}
              title="Ngày sinh"
              placeholder="Nhập ngày sinh"
              value={
                birthdayInput == ""
                  ? birthdayInput
                  : moment.utc(birthdayInput).format("DD-MM-YYYY")
              }
              onTap={showDatePicker}
              editable={false}
            />
            <View style={{ flex: 1, paddingLeft: 8 }}>
              <TextComponent color={COLORS.Gray} fontSize={sizes[3]}>
                Giới tính
              </TextComponent>
              <Dropdown
                style={[styles.dropdown]}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                data={dataSex}
                maxHeight={scale(200)}
                labelField="name"
                valueField="name"
                placeholder={!isFocusSex ? "Giới tính" : "..."}
                value={sexInput?.name ?? ""}
                onFocus={() => setIsFocusSex(true)}
                onBlur={() => setIsFocusSex(false)}
                onChange={(item) => {
                  setSex(item);
                  setIsFocusSex(false);
                }}
              />
            </View>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 16,
            }}
          >
            <InputCustom
              wrapperStyle={{ flex: 1, paddingRight: 8 }}
              title="Số điện thoại"
              placeholder="Nhập số điện thoại"
              value={phoneNumber}
              editable={false}
            />
            <InputCustom
              wrapperStyle={{ flex: 1, paddingLeft: 8 }}
              title="Email"
              placeholder="Nhập email"
              value={emailInput}
              onChangeText={(text) => setEmail(text)}
            />
          </View>
          <View style={styles.input}>
            <TextComponent color={COLORS.Gray} fontSize={sizes[3]}>
              Tỉnh/Thành phố
            </TextComponent>
            <Dropdown
              style={[
                styles.dropdown,
                isFocusProvinces && { borderColor: COLORS.LightSilver },
              ]}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              data={dataProvinces}
              search
              maxHeight={scale(200)}
              labelField="Name"
              valueField="Name"
              placeholder={!isFocusProvinces ? "Chọn tỉnh/thành phố" : "..."}
              searchPlaceholder="Tìm kiếm"
              value={provinces?.Name}
              onFocus={() => setIsFocusProvinces(true)}
              onBlur={() => setIsFocusProvinces(false)}
              onChange={(item) => {
                setProvinces(item);
                setIsFocusProvinces(false);
              }}
            />
          </View>
          <View style={styles.input}>
            <TextComponent color={COLORS.Gray} fontSize={sizes[3]}>
              Quận/Huyện
            </TextComponent>
            <Dropdown
              style={[
                styles.dropdown,
                isFocusDistricts && { borderColor: COLORS.LightSilver },
              ]}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              data={dataDistricts}
              search
              maxHeight={scale(200)}
              labelField="Name"
              valueField="Name"
              placeholder={!isFocusDistricts ? "Chọn quận/huyện" : "..."}
              searchPlaceholder="Tìm kiếm"
              value={districts?.Name}
              onFocus={() => setIsFocusDistricts(true)}
              onBlur={() => setIsFocusDistricts(false)}
              onChange={(item) => {
                setDistricts(item);
                setIsFocusDistricts(false);
              }}
            />
          </View>
          <View style={styles.input}>
            <TextComponent color={COLORS.Gray} fontSize={sizes[3]}>
              Xã/Phường
            </TextComponent>
            <Dropdown
              style={[
                styles.dropdown,
                isFocusWards && { borderColor: COLORS.LightSilver },
              ]}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              data={dataWards}
              search
              maxHeight={scale(200)}
              labelField="Name"
              valueField="Name"
              placeholder={!isFocusWards ? "Chọn xã/phường" : "..."}
              searchPlaceholder="Tìm kiếm"
              value={wards?.Name}
              onFocus={() => setIsFocusWards(true)}
              onBlur={() => setIsFocusWards(false)}
              onChange={(item) => {
                setWards(item);
                setIsFocusWards(false);
              }}
            />
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
            title="Địa chỉ"
            placeholder="Nhập dịa chỉ"
            value={addressInput}
            onChangeText={(text) => setAddress(text)}
            numberOfLines={999}
          />
          <Button
            label="Cập nhật thông tin"
            style={{ padding: isIOS ? 10 : 6, height: 40, marginTop: 16 }}
            onPress={onUpdateUser}
          />
          <Button
            loading = {logoutLoading}
            label="Đăng xuất"
            labelColor={COLORS.YankeesBlue}
            style={{
              backgroundColor: COLORS.Lavender,
              padding: isIOS ? 10 : 6,
              height: 40,
              marginTop: 16,
            }}
            onPress={onLogout}
          />
        </View>
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          date={new Date()}
          onConfirm={handleConfirmDate}
          onCancel={hideDatePicker}
        />
      </ScrollView>
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
  logoName: {
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 16,
    paddingBottom: 36,
  },
  input: {
    backgroundColor: "white",
    paddingVertical: 5,
  },
  dropdown: {
    padding: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    marginVertical: 5,
    borderColor: COLORS.LightSilver,
    height: 40,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: "absolute",
    backgroundColor: "white",
    left: 16,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
    color: COLORS.Black
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});

//make this component available to the app
export default UserScreen;
