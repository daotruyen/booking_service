//import liraries
import Header from "components/Headers";
import TextComponent from "components/Text";
import { navigate } from "navigators";
import React, { useEffect, useMemo, useState } from "react";
import { View, StyleSheet } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { scale } from "react-native-size-scaling";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import {
  getLocationMySpasRequest,
  getProductRequest,
  getPurchaseRequest,
  getServiceRequest,
  getSpaServicesRequest,
  getUserRequest,
  selectCreateService,
  User,
} from "reduxCore/createService/slice";
import { COLORS } from "shared/constants/colors";
import { sizes } from "shared/constants/common";
import { INFO_USER_SCREEN } from "shared/constants/routeNames";

export interface Data {
  id: number;
  name: string;
}

// create a component
const CreateServiceScreen = () => {
  const dispatch = useDispatch();
  const { data } = useSelector(selectCreateService);
  const [isFocusServices, setIsFocusServices] = useState(false);
  const [value, setValue] = useState<User>();
  const [phoneNumber, setPhoneNumber] = useState("");

  useEffect(() => {
    dispatch(getUserRequest(phoneNumber));
  }, []);

  const dataUser = useMemo(() => {
    const arrDataUser: any[] = []
    data.forEach((element: any) => {
      arrDataUser.push({...element, valueInfo : `${element.PhoneNumber} ${element.Fullname}` })
    });
    return arrDataUser
  } , [data])

  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.input}>
        <TextComponent color={COLORS.Gray} fontSize={sizes[3]}>
          Khách hàng
        </TextComponent>
        <Dropdown
          style={[styles.dropdown]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          data={dataUser}
          search
          maxHeight={scale(200)}
          labelField="valueInfo"
          valueField="valueInfo"
          placeholder={!isFocusServices ? "Vui lòng chọn khách hàng" : "..."}
          searchPlaceholder="Tìm kiếm bằng số điện thoại"
          value={`${value?.valueInfo}`}
          onFocus={() => setIsFocusServices(true)}
          onBlur={() => setIsFocusServices(false)}
          onChange={(item) => {
            setValue(item);
            setIsFocusServices(false);
            dispatch(
              getServiceRequest({
                Keyword: "",
                Status: "",
                UserId: item.UserId,
              })
            );
            dispatch(
              getPurchaseRequest({
                PageIndex: 0,
                PageSize: 0,
                SortBy: "string",
                SortDirection: 0,
                UserId: item.UserId,
                IsPaging: false,
                Keyword: "",
              })
            );
            dispatch(getProductRequest({Keyword: ""}));
            dispatch(getSpaServicesRequest({Keyword: ""}));
            dispatch(getLocationMySpasRequest())
            navigate(INFO_USER_SCREEN, item);
          }}
        />
      </View>
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.White,
  },
  input: {
    backgroundColor: "white",
    paddingVertical: 5,
    margin: 16,
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
export default CreateServiceScreen;
