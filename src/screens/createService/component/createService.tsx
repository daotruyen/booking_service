//import liraries
import Button from "components/CustomButton";
import InputCustom from "components/input";
import TextComponent from "components/Text";
import ApiConfig from "config/config";
import { LocationSpa, Service } from "interfaces/commonInterface";
import React, { useState } from "react";
import { View, StyleSheet, KeyboardAvoidingView, Alert } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { scale } from "react-native-size-scaling";
import { useDispatch, useSelector } from "react-redux";
import {
  getServiceRequest,
  selectCreateService,
} from "reduxCore/createService/slice";
import { apiClient } from "services/baseAxios";
import { COLORS } from "shared/constants/colors";
import { sizes } from "shared/constants/common";
import { ScrollView } from "react-native";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

// create a component
const CreateServiceComponent = (props: any) => {
  const dispatch = useDispatch();
  const { handelCancel, userId, showNotiSuccess } = props;
  const { spaServices, mySpas } = useSelector(selectCreateService);
  const [isFocusProvinces, setIsFocusProvinces] = useState(false);
  const [isFocusLocation, setIsFocusLocation] = useState(false);
  const [dataService, setDataService] = useState<Service>();
  const [spa, setSpa] = useState<LocationSpa>();
  const [costService, setCostPurchase] = useState("");
  const [loading, setLoading] = useState(false);

  const onAddService = async () => {
    if(!!spa && !!dataService && !!costService) {
    setLoading(true);
    const response = await apiClient.post(ApiConfig.CREATE_SERVICE, {
      UserId: userId,
      ServiceId: dataService?.Id,
      Price: costService,
      LocationId: spa?.Id,
    });
    const { AppCode, Data } = response;
    if (AppCode === 200) {
      setLoading(false);
      dispatch(
        getServiceRequest({
          Keyword: "",
          Status: "",
          UserId: userId,
        })
      );
      handelCancel();
      showNotiSuccess();
    } else {
      setLoading(false);
      handelCancel();
    } } else {
      Alert.alert('Có lỗi xảy ra', 'Vui lòng nhập đủ thông tin', [
        {text: 'OK', onPress: () => console.log('OK Pressed')},
      ]);
    }
  };
  return (
    <KeyboardAwareScrollView>
      <View style={styles.container}>
        <View style={styles.input}>
          <TextComponent color={COLORS.Gray} fontSize={sizes[3]}>
            Dịch vụ
          </TextComponent>
          <Dropdown
            style={[styles.dropdown]}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            data={spaServices}
            search
            maxHeight={scale(200)}
            labelField="Name"
            valueField="Name"
            placeholder={!isFocusProvinces ? "Chọn dịch vụ" : "..."}
            searchPlaceholder="Tìm kiếm"
            value={dataService?.Name ?? ""}
            onFocus={() => setIsFocusProvinces(true)}
            onBlur={() => setIsFocusProvinces(false)}
            onChange={(item) => {
              setDataService(item);
              setIsFocusProvinces(false);
            }}
          />
        </View>
        <View style={styles.input}>
          <TextComponent color={COLORS.Gray} fontSize={sizes[3]}>
            Cơ sở
          </TextComponent>
          <Dropdown
            style={[styles.dropdown]}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            data={mySpas}
            search
            maxHeight={scale(200)}
            labelField="Name"
            valueField="Name"
            placeholder={!isFocusLocation ? "Chọn cơ sở" : "..."}
            searchPlaceholder="Tìm kiếm"
            value={spa?.Name ?? ""}
            onFocus={() => setIsFocusLocation(true)}
            onBlur={() => setIsFocusLocation(false)}
            onChange={(item) => {
              setSpa(item);
              setIsFocusLocation(false);
            }}
          />
        </View>
        <View>
          <InputCustom
            wrapperStyle={{ marginBottom: 16 }}
            title="Giá dịch vụ"
            placeholder="Nhập giá bán dịch vụ"
            value={costService}
            onChangeText={(text) => setCostPurchase(text)}
            keyboardType="numeric"
          />
          <TextComponent
            style={{ position: "absolute", bottom: 27, right: 16 }}
          >
            đ
          </TextComponent>
        </View>
        <View style={{ flexDirection: "row", flex: 1 }}>
          <Button
            label="Huỷ"
            style={styles.buttonCancel}
            labelColor={COLORS.YankeesBlue}
            onPress={handelCancel}
          />
          <View style={{ width: 16 }}></View>
          <Button
            label="Thêm dịch vụ"
            style={styles.button}
            onPress={onAddService}
          />
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
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
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  button: {
    flex: 1,
    marginVertical: 5,
    height: 40,
    padding: 0,
    justifyContent: "center",
  },
  buttonCancel: {
    flex: 1,
    marginVertical: 5,
    height: 40,
    padding: 0,
    justifyContent: "center",
    backgroundColor: COLORS.Lavender,
  },
});

//make this component available to the app
export default CreateServiceComponent;
