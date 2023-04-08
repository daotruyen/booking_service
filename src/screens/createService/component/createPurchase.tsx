//import liraries
import Button from "components/CustomButton";
import InputCustom from "components/input";
import TextComponent from "components/Text";
import ApiConfig from "config/config";
import React, { useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { scale } from "react-native-size-scaling";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import {
  getPurchaseRequest,
  selectCreateService,
} from "reduxCore/createService/slice";
import { apiClient } from "services/baseAxios";
import { COLORS } from "shared/constants/colors";
import { sizes } from "shared/constants/common";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'


interface Product {
  Code: string;
  Id: string;
  Instruction: string;
  LocationId: string;
  Name: string;
  ProductTypeId: string;
}

// create a component
const CreatePurchaseComponent = (props: any) => {
  const { handelCancel, userId, showNotiSuccess } = props;
  const dispatch = useDispatch();
  const { products } = useSelector(selectCreateService);
  const [isFocusProvinces, setIsFocusProvinces] = useState(false);
  const [dataProduct, setDataProduct] = useState<Product>();
  const [costPurchase, setCostPurchase] = useState("");
  const [loading, setLoading] = useState(false);
  const onAddPurchase = async () => {
    if(!!costPurchase && !!dataProduct ) {
      setLoading(true);
      try {
        const response = await apiClient.post(ApiConfig.CREATE_PRODUCT, {
          UserId: userId,
          ProductId: dataProduct?.Id,
          Price: costPurchase,
        });
        const {AppCode, Data} = response;
        if(AppCode === 200) {
          setLoading(false)
          dispatch(
            getPurchaseRequest({
              PageIndex: 0,
              PageSize: 0,
              SortBy: "string",
              SortDirection: 0,
              UserId: userId,
              IsPaging: false,
              Keyword: "",
            })
          );
          handelCancel();
          showNotiSuccess()
        } else {
          setLoading(false)
          handelCancel();
        }
      } catch (error) {
        setLoading(false)
        handelCancel();
      }
    } else {
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
          Sản phẩm
        </TextComponent>
        <Dropdown
          style={[styles.dropdown]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          data={products}
          search
          maxHeight={scale(200)}
          labelField="Name"
          valueField="Name"
          placeholder={!isFocusProvinces ? "Chọn sản phẩm" : "..."}
          searchPlaceholder="Tìm kiếm"
          value={dataProduct?.Name ?? ""}
          onFocus={() => setIsFocusProvinces(true)}
          onBlur={() => setIsFocusProvinces(false)}
          onChange={(item) => {
            setDataProduct(item);
            setIsFocusProvinces(false);
          }}
        />
      </View>
      <View>
        <InputCustom
          wrapperStyle={{ marginBottom: 16 }}
          title="Giá sản phẩm"
          placeholder="Nhập giá bán sản phẩm"
          value={costPurchase}
          onChangeText={(text) => setCostPurchase(text)}
          keyboardType="numeric"
        />
        <TextComponent style={{ position: "absolute", bottom: 27, right: 16 }}>
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
          loading = {loading}
          label="Thêm sản phẩm"
          style={styles.button}
          onPress={onAddPurchase}
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
export default CreatePurchaseComponent;
