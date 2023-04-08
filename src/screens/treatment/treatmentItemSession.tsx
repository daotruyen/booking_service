import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Header from "components/Headers";
import React, { useMemo, useState } from "react";
import TextComponent from "components/Text";
import { COLORS } from "shared/constants/colors";
import { image } from "assets/image";
import Ionicons from "react-native-vector-icons/Ionicons";
import { sizes } from "shared/constants/common";
import { treatmentCommonStyles } from "screens/treatment/styles";
import { width } from "shared/metrics/index";
import AntDesign from "react-native-vector-icons/AntDesign";
import { navigate } from "navigators";
import { ROUTE_HOME } from "shared/constants/routeNames";
import sharedStyles from "shared/constants/styles";
import FastImage from "react-native-fast-image";

export const TreatmentItemSessionDetail = ({ route }: any) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [currentSelectedIndexImage, setCurrentSelectedIndexImage] = useState(0);
  const sessionItem = route.params.sessionItem;
  const treatmentItem = route.params.treatmentItem;
  
  const arrImage = useMemo(() => {
    const listImage = sessionItem.ImageUrls ?? "";
    if (listImage) {
      let arr = listImage.split(";");
      return arr.map((e: string) => {
        return { uri: e };
      });
    }
    return [];
  }, []);
  const listImages: any[] = [...arrImage];

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

  return (
    <View>
      <Header
        title=""
        showBack={true}
        iconRight={true}
        onPressRight={() => navigate(ROUTE_HOME)}
      />
      <ScrollView style={styles.container}>
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
                    treatmentItem.Status == "Doing"
                      ? treatmentCommonStyles.textDoing
                      : treatmentCommonStyles.textCompleted
                  }
                >
                  {treatmentItem.Status == "Doing" ? "Đang làm" : "Hoàn thành"}
                </TextComponent>
              </View>
            </View>
          </View>
          {/* Thông tin buổi điều trị */}
          <View>
            <View
              style={[treatmentCommonStyles.rowSpaceBetween, { marginTop: 16 }]}
            >
              <TextComponent style={styles.rowTextTitle}>
                Khách hàng
              </TextComponent>
              <TextComponent style={styles.rowTextDetail}>
                {sessionItem?.CustomerName}
              </TextComponent>
            </View>
            <View
              style={[treatmentCommonStyles.rowSpaceBetween, { marginTop: 16 }]}
            >
              <TextComponent style={styles.rowTextTitle}>Bác sĩ</TextComponent>
              <TextComponent style={styles.rowTextDetail}>
                {sessionItem.DoctorName}
              </TextComponent>
            </View>
            <View
              style={[treatmentCommonStyles.rowSpaceBetween, { marginTop: 16 }]}
            >
              <TextComponent style={styles.rowTextTitle}>
                Liệu trình
              </TextComponent>
              <TextComponent style={styles.rowTextDetail}>
                Buổi {sessionItem.NoOfProcess}
              </TextComponent>
            </View>
            <View
              style={[treatmentCommonStyles.rowSpaceBetween, { marginTop: 16 }]}
            >
              <TextComponent style={styles.rowTextTitle}>
                Phác đồ điều trị
              </TextComponent>
              <TextComponent numberOfLines={1} style={styles.rowTextDetail}>
                {sessionItem.TreatmentRegimen}
              </TextComponent>
            </View>
            <View
              style={[treatmentCommonStyles.rowSpaceBetween, { marginTop: 16 }]}
            >
              <TextComponent style={styles.rowTextTitle}>Tư vấn</TextComponent>
              <TextComponent numberOfLines={1} style={[styles.rowTextDetail]}>
                {sessionItem.ConsultingInformation}
              </TextComponent>
            </View>
          </View>
        </View>
        {/* Khu vực hiển thị ảnh của buổi điều trị */}
        <View style={[treatmentCommonStyles.sessionBlock, { marginTop: 16 }]}>
          <TextComponent style={styles.title}>Ảnh khách hàng</TextComponent>
          {listImages.length > 0 && (
            <>
              <TextComponent style={{ fontSize: 14, color: COLORS.Gray }}>
                Việc ghi lại hình ảnh sẽ giúp thấy rõ sự thay đổi tích cực sau
                liệu trình của quý khách!
              </TextComponent>
              <View style={styles.imageWrapper}>
                {listImages.map((e, i) => (
                    <View>
                      <Pressable onPress={() => enlargeImage(e, i)}>
                        <FastImage
                          style={styles.imageBlock}
                          source={{ uri: e.uri }}
                        />
                      </Pressable>
                    </View>
                  )
                )}
              </View>
            </>
          )}
          {(!listImages || listImages.length == 0) && (
            <TextComponent style={{ fontSize: 14, color: COLORS.Gray }}>
              Không có ghi nhận hình ảnh cho buổi điều trị này.
            </TextComponent>
          )}
        </View>
      </ScrollView>
      <View style={styles.centeredView}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        >
          <View style={{ backgroundColor: "rgba(0,0,0,0.5)", flex: 1 }}>
            <TouchableOpacity
              style={styles.centeredView}
              onPressOut={hideModal}
            >
              <TouchableWithoutFeedback>
                <View style={styles.modalView}>
                  <Pressable
                    onPress={movePrevious}
                    style={styles.modalIconLeft}
                  >
                    <View style={styles.modalWrapperIcon}>
                      <AntDesign name="left" size={14} color={COLORS.Gray} />
                    </View>
                  </Pressable>
                  {listImages.length > 0 && (
                    <FastImage
                      style={{ height: "100%", width: "100%" }}
                      source={{uri: listImages[currentSelectedIndexImage]?.uri}}
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
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  imageWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  imageBlock: {
    backgroundColor: COLORS.Gray,
    maxWidth: "25%",
    marginHorizontal: 4,
    minWidth: 72,
    minHeight: 72,
    marginTop: 12,
    borderRadius: 4,
    cursor: "pointer",
  },
  container: {
    padding: 16,
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
    marginTop: 22,
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
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});
