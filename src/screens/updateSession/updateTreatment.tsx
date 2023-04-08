import {
  Image,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Header from "components/Headers";
import React, { useEffect, useMemo, useState } from "react";
import TextComponent from "components/Text";
import { COLORS } from "shared/constants/colors";
import { image } from "assets/image";
import Ionicons from "react-native-vector-icons/Ionicons";
import { sizes, UserType } from "shared/constants/common";
import { treatmentCommonStyles } from "screens/treatment/styles";
import { useDispatch } from "react-redux";
import { width } from "shared/metrics/index";
import AntDesign from "react-native-vector-icons/AntDesign";
import { navigate } from "navigators";
import { ROUTE_HOME } from "shared/constants/routeNames";
import sharedStyles from "shared/constants/styles";
import InputCustom from "components/input";
import { Colors } from "react-native/Libraries/NewAppScreen";
import { icon } from "assets/icon";
import Button from "components/CustomButton";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import { apiClient } from "services/baseAxios";
import ApiConfig from "config/config";
import { globalLoading } from "components";
import { showMessage } from "react-native-flash-message";
import { Dropdown } from "react-native-element-dropdown";
import { isIOS, scale } from "react-native-size-scaling";
import { useNavigation } from "@react-navigation/core";
import { getServiceRequest } from "reduxCore/createService/slice";

const optionsSelectImage = {
  selectionLimit: 0,
  mediaType: "photo",
  includeBase64: false,
  includeExtra: true,
};

const optionCamera = isIOS ? {
    saveToPhotos: true,
    mediaType: 'mixed',
    includeExtra: true,
    presentationStyle: 'fullScreen',
  } : {
    saveToPhotos: true,
    mediaType: "photo",
    includeBase64: false,
    includeExtra: true,   
} ;

const convertFile = (file: any) => {
  return {
    name: file.fileName,
    type: file.type,
    uri: Platform.OS === "ios" ? file.uri.replace("file://", "") : file.uri,
  };
};

const UpdateTreatmentSessionScreen = ({ route }: any) => {
  const { CustomerName, Id } = route.params.sessionItem;
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [modalVisible, setModalVisible] = useState(false);
  const [modalSelectType, setModalSelectType] = useState(false);
  const [currentSelectedIndexImage, setCurrentSelectedIndexImage] = useState(0);
  const sessionItem = route.params?.sessionItem;
  const treatmentItem = route.params?.treatmentItem;
  const doctor = {
    Fullname: sessionItem?.DoctorName ?? "",
    UserId: sessionItem?.DoctorId ?? "",
  };
  const [name, setName] = useState(CustomerName);
  const [doctorName, setDoctorName] = useState(doctor);
  const [regimen, setRegimen] = useState(sessionItem.TreatmentRegimen ?? "");
  const [consults, setConsults] = useState(
    sessionItem.ConsultingInformation ?? ""
  );
  const arrImage = useMemo(() => {
    const listImage = sessionItem.ImageUrls ?? "";
    if (listImage) {
      let arrImage: any[] = [];
      let arr = listImage.split(";");
      arr.forEach((element: any) => {
        if (element != "") {
          arrImage.push(element);
        }
      });
      return arrImage.map((e: string) => {
        return { uri: e };
      });
    }
    return [];
  }, []);

  const [listImageStorage, setListImageStorage] = useState<any[]>([]);
  const [listImages, setListImages] = React.useState<any[]>([
    ...arrImage,
    ...listImageStorage,
  ]);
  const [linkImageDelete, setLinkImageDelete] = useState<any[]>([]);
  const [listDoctor, setListDoctor] = React.useState<any[]>([]);
  const [isFocusServices, setIsFocusServices] = useState(false);

  const enlargeImage = (item: any, index: number) => {
    setCurrentSelectedIndexImage(index);
    setModalVisible(true);
  };

  const movePrevious = () => {
    let index = currentSelectedIndexImage;
    setCurrentSelectedIndexImage(
      currentSelectedIndexImage == 0 ? listImages.length - 1 : index - 1
    );
  };

  const getListDoctor = async () => {
    const res = await apiClient.get(
      ApiConfig.TYPE_USERS + "/" + UserType.Doctor,
      null
    );
    const { AppCode, Data } = res;
    if (AppCode == 200) {
      setListDoctor(Data);
    } else {
      setListDoctor([]);
    }
  };

  useEffect(() => {
    getListDoctor();
  }, []);

  const moveNext = () => {
    setCurrentSelectedIndexImage(
      currentSelectedIndexImage == listImages.length - 1
        ? 0
        : currentSelectedIndexImage + 1
    );
  };

  const hideModal = () => {
    setModalVisible(false);
  };

  const onButtonPress = (type: any, options: any) => {
    if (type === "capture") {
      setTimeout(() => {
        launchCamera(options).then((response) => {
        let arr: any[] = [...listImageStorage];
        let arrList: any[] = [...listImages];
        if (response.assets != null) {
          arr = arr.concat(response.assets![0]);
          arrList = arrList.concat(response.assets![0]);
          setListImageStorage(arr);
          setListImages(arrList);
        }
      })}, 200);   
    } else {
      launchImageLibrary(options).then((response) => {
        let arr: any[] = [...listImageStorage];
        let arrList: any[] = [...listImages];
        if (response.assets != null) {
          arr = arr.concat(response.assets);
          arrList = arrList.concat(response.assets);
          setListImageStorage(arr);
          setListImages(arrList);
        }
      });
    }
  };

  const onUpdatePress = async () => {
    globalLoading.show();
    let formData = new FormData();
    if (regimen) {
      formData.append("TreatmentRegimen", regimen);
    }
    if (consults) {
      formData.append("ConsultingInformation", consults);
    }
    formData.append("CustomerFeedback", "");
    if (sessionItem?.TreatmentDate) {
      formData.append("TreatmentDate", sessionItem?.TreatmentDate);
    }
    if (sessionItem?.LocationId) {
      formData.append("LocationId", sessionItem?.LocationId);
    }
    if (doctorName?.UserId) {
      formData.append("DoctorId", doctorName?.UserId);
    }
    if (listImageStorage?.length > 0) {
      for (let i = 0; i < listImageStorage.length; i++) {
        let data = convertFile(listImageStorage[i]);
        formData.append("ListFiles", data);
      }
    }
    if (linkImageDelete.length > 0) {
      linkImageDelete.forEach((element) => {
        formData.append("LinksToDelete", element);
      });
    }
    try {
      const resUpdate = await apiClient.put(
      `${ApiConfig.SERVICE_USER_PROCESSES}/${Id}`,
      formData
    );
    const { AppCode, Data } = resUpdate;
    if (AppCode == 200) {
      globalLoading.hide();
      showMessage({
        message: "🎉 Cập nhật thành công",
        description: "Chi tiết liệu trình của khách hàng đã được ghi nhận!.",
        type: "success",
      });
    } else {
      globalLoading.hide();
      showMessage({
        message: "Cập nhật thất bại",
        description: "Chi tiết liệu trình của khách hàng chưa được ghi nhận!.",
        type: "danger",
      });
    }
    } catch (error) {
      globalLoading.hide();
      showMessage({
        message: "Cập nhật thất bại",
        description: "Chi tiết liệu trình của khách hàng chưa được ghi nhận!.",
        type: "danger",
      });
    } 
    if (route.params?.userId) {
      dispatch(
        getServiceRequest({
          Keyword: "",
          Status: "",
          UserId: route.params?.userId,
        })
      );
    }
    navigation.goBack();
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.white }}>
      <Header
        title=""
        showBack={true}
        onPressRight={() => navigate(ROUTE_HOME)}
      />
      <ScrollView
        style={{
          padding: 16,
          flex: 1,
          paddingBottom: 32,
        }}
      >
        <View style={treatmentCommonStyles.sessionBlock}>
          <TextComponent style={styles.title}>
            Thông tin Liệu Trình
          </TextComponent>
          <View style={{ flexDirection: "row" }}>
            <Image
              style={sharedStyles.treatmentServiceImage}
              source={image.image}
            />
            <View style={treatmentCommonStyles.leftServiceBlock}>
              <TextComponent
                numberOfLines={1}
                style={{
                  paddingVertical: 2,
                  fontSize: 16,
                  textTransform: "uppercase",
                  fontWeight: "500",
                }}
              >
                {treatmentItem.ServiceName}
              </TextComponent>
              <View style={treatmentCommonStyles.rowSection}>
                <Ionicons name="location" color={COLORS.YankeesBlue} />
                <TextComponent
                  numberOfLines={1}
                  style={treatmentCommonStyles.textDetail}
                  fontSize={sizes[3]}
                >
                  {treatmentItem.LocationAddress}
                </TextComponent>
              </View>
              <View style={treatmentCommonStyles.rowSpaceBetween}>
                <View style={treatmentCommonStyles.rowSection}>
                  <Ionicons name="timer-outline" color={COLORS.YankeesBlue} />
                  <TextComponent
                    style={treatmentCommonStyles.textDetail}
                    fontSize={sizes[3]}
                  >
                    {treatmentItem.timeStart} -{" "}
                    {treatmentItem.timeEnd
                      ? treatmentItem.timeEnd
                      : "--/--/----"}
                  </TextComponent>
                </View>
                <TextComponent
                  style={
                    treatmentItem.Status === "Doing"
                      ? treatmentCommonStyles.textDoing
                      : treatmentCommonStyles.textCompleted
                  }
                >
                  {treatmentItem.Status === "Doing" ? "Đang làm" : "Hoàn thành"}
                </TextComponent>
              </View>
            </View>
          </View>
          <View>
            <InputCustom
              wrapperStyle={styles.input}
              title="Khách hàng"
              onChangeText={(text: string) => setName(text)}
              placeholder="Nhập tên khách hàng"
              value={name}
              editable={false}
            />
            <View style={styles.input}>
              <TextComponent color={COLORS.Gray} fontSize={sizes[3]}>
                Bác sĩ
              </TextComponent>
              <Dropdown
                style={[styles.dropdown]}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                data={listDoctor}
                search
                maxHeight={scale(200)}
                labelField="Fullname"
                valueField="Fullname"
                placeholder={!isFocusServices ? "Vui lòng chọn bác sĩ" : "..."}
                searchPlaceholder="Tìm kiếm"
                value={`${doctorName?.Fullname}`}
                onFocus={() => setIsFocusServices(true)}
                onBlur={() => setIsFocusServices(false)}
                onChange={(item) => {
                  setDoctorName(item);
                }}
              />
            </View>
            <InputCustom
              wrapperStyle={styles.input}
              title="Liệu trình"
              placeholder="Nhập buổi liệu trình"
              value={`Buổi ${sessionItem.NoOfProcess}`}
              editable={false}
            />
            <InputCustom
              wrapperStyle={styles.input}
              title="Phác đồ điều trị"
              onChangeText={(text: string) => setRegimen(text)}
              placeholder="Nhập phác đồ điều trị"
              value={regimen}
              isRequired
            />
            <InputCustom
              wrapperStyle={[styles.input, { height: 110 }]}
              style={{
                flex: 1,
                justifyContent: "flex-start",
                alignContent: "flex-start",
                paddingTop: 8,
                textAlignVertical: "top",
                padding: 0,
              }}
              title="Tư vấn"
              placeholder="Nhập tư vấn khách hàng"
              value={consults}
              onChangeText={(text) => setConsults(text)}
              numberOfLines={999}
            />
          </View>
        </View>
        <View
          style={[treatmentCommonStyles.sessionBlock, { marginVertical: 16 }]}
        >
          <TextComponent style={styles.title}>Ảnh khách hàng</TextComponent>
          {listImages.length > 0 ? (
            <>
              <View style={styles.imageWrapper}>
                {listImages.map((e, i) => {
                  return (
                    <View key={i + Math.random()}>
                      <Pressable onPress={() => enlargeImage(e, i)}>
                        <Image
                          style={styles.imageBlock}
                          source={{ uri: e?.uri }}
                        />
                      </Pressable>
                      <Pressable
                        style={[
                          styles.close,
                          {
                            backgroundColor: COLORS.Charleston,
                            borderRadius: 100,
                          },
                        ]}
                        onPress={() => {
                          let arr: any[] = [...listImages];
                          let arrDelete: any[] = [...linkImageDelete];
                          if (arrImage.indexOf(e) != -1) {
                            arrDelete.push(e?.uri);
                            setLinkImageDelete(arrDelete);
                          }
                          arr.splice(i, 1);
                          setListImages(arr);
                        }}
                      >
                        <AntDesign name="close" color={COLORS.White} />
                      </Pressable>   
                    </View>
                  );
                })}
                <Pressable
                  style={styles.chooseImage}
                  onPress={() => setModalSelectType(true)}
                >
                  <AntDesign name="plus" size={20} />
                </Pressable>
              </View>
            </>
          ) : (
            <Pressable onPress={() => setModalSelectType(true)}>
              <View
                style={{
                  backgroundColor: COLORS.Gray100,
                  padding: 16,
                  alignItems: "center",
                  borderWidth: 1,
                  borderStyle: "dashed",
                  borderColor: COLORS.Gray200,
                }}
              >
                <Image source={icon.icon_upload} />
                <TextComponent style={{ paddingVertical: 12 }}>
                  Tải lên Ảnh / Video
                </TextComponent>
                <TextComponent>
                  File (Video, Ảnh, Zip,...) có dung lượng không quá 10Mb
                </TextComponent>
              </View>
            </Pressable>
          )}
        </View>
        <View style={{ flexDirection: "row", flex: 1, marginBottom: 32 }}>
          <Button
            label="Huỷ"
            style={styles.buttonCancel}
            labelColor={COLORS.YankeesBlue}
            onPress={() => {
              navigation.goBack();
            }}
          />
          <View style={{ width: 16 }}></View>
          <Button
            // loading = {loading}
            label="Cập nhật"
            style={styles.button}
            onPress={onUpdatePress}
          />
        </View>
      </ScrollView>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={{ backgroundColor: "rgba(0,0,0,0.5)", flex: 1 }}>
          <TouchableOpacity style={styles.centeredView} onPressOut={hideModal}>
            <TouchableWithoutFeedback>
              <View style={styles.modalView}>
                <Pressable onPress={movePrevious} style={styles.modalIconLeft}>
                  <View style={styles.modalWrapperIcon}>
                    <AntDesign name="left" size={14} color={COLORS.Gray} />
                  </View>
                </Pressable>
                {listImages.length > 0 && (
                  <Image
                    style={{ height: "100%", width: "100%" }}
                    source={{ uri: listImages[currentSelectedIndexImage]?.uri }}
                  />
                )}

                <Pressable onPress={moveNext} style={styles.modalIconRight}>
                  <View style={styles.modalWrapperIcon}>
                    <AntDesign name="right" size={14} color={COLORS.Gray} />
                  </View>
                </Pressable>
              </View>
            </TouchableWithoutFeedback>
          </TouchableOpacity>
        </View>
      </Modal>
      <Modal transparent={true} visible={modalSelectType} style={{}}>
        <View
          style={{
            backgroundColor: "rgba(0,0,0,0.5)",
            flex: 1,
            borderRadius: 10,
          }}
        >
          <TouchableOpacity
            style={styles.centeredView}
            onPressOut={() => setModalSelectType(false)}
          >
            <View style={styles.modalSelect}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  width: width - 32,
                  alignItems: "center",
                  padding: 10,
                }}
              >
                <TextComponent bold fontSize={sizes[4]}>
                  Đăng tải ảnh
                </TextComponent>
                <TouchableOpacity
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 20,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  onPress={() => setModalSelectType(false)}
                >
                  <AntDesign name="close" size={16} />
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={[styles.buttonSelect, { borderTopWidth: 0 }]}
                onPress={() => {
                  onButtonPress("capture", optionCamera);
                  setModalSelectType(false);
                }}
              >
                <TextComponent>Bật camera</TextComponent>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.buttonSelect}
                onPress={() => {
                  onButtonPress("library", optionsSelectImage);
                  setModalSelectType(false);
                }}
              >
                <TextComponent>Chọn ảnh từ thư viện</TextComponent>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

export default UpdateTreatmentSessionScreen;

const styles = StyleSheet.create({
  imageWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  imageBlock: {
    backgroundColor: COLORS.Gray,
    maxWidth: 72,
    height: 72,
    marginHorizontal: 4,
    minWidth: 72,
    minHeight: 72,
    marginTop: 12,
    borderRadius: 4,
    cursor: "pointer",
  },
  buttonSelect: {
    width: width - 32,
    borderTopWidth: 0.5,
    padding: 12,
  },

  title: {
    fontSize: 16,
    color: COLORS.Tertiary,
    fontWeight: "500",
    marginBottom: 12,
  },
  rowTextTitle: {
    fontSize: 14,
    color: COLORS.Gray,
  },
  rowTextDetail: {
    fontSize: 14,
    fontWeight: "500",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  modalIconLeft: {
    position: "absolute",
    left: 20,
    top: 0,
    bottom: 0,
    justifyContent: "center",
    zIndex: 1,
  },
  modalIconRight: {
    position: "absolute",
    right: 20,
    top: 0,
    bottom: 0,
    justifyContent: "center",
    zIndex: 1,
  },
  modalWrapperIcon: {
    backgroundColor: COLORS.White,
    width: 24,
    height: 24,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    opacity: 0.5,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    width: width - 25,
    height: width - 25,
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalSelect: {
    margin: 20,
    backgroundColor: "white",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    width: width - 32,
    // height: 100,
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    borderRadius: 10,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  input: { marginTop: 16 },
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
  chooseImage: {
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: COLORS.Gray200,
    width: 72,
    height: 72,
    marginTop: 12,
    borderRadius: 4,
    marginHorizontal: 4,
    justifyContent: "center",
  },
  close: {
    position: "absolute",
    padding: 8,
    zIndex: 99,
    right: 4,
    top: 12,
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
