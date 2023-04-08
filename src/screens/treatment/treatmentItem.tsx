import { image } from "assets/image";
import FlatListComponent from "components/FlatList";
import TextComponent from "components/Text";
import { COLORS } from "shared/constants/colors";
import { sizes } from "shared/constants/common";
import { ServiceUserStatus } from "shared/constants/status";
import React, { useState } from "react";
import {
  View,
  Image,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { TouchableOpacity } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { helpers } from "shared/ultis/helpers";
import { apiClient } from "services/baseAxios";
import { globalLoading } from "components";
import moment from 'moment'
import { navigate } from "navigators";
import { treatmentRoutes } from "shared/constants/routeNames";
import { treatmentCommonStyles } from 'screens/treatment/styles';
import sharedStyles from "shared/constants/styles";

const TreatmentItemSession = (props: any) => {
  const { sessionItem } = props;
  const treatmentDate = sessionItem.TreatmentDate ? moment(sessionItem.TreatmentDate).format("DD/MM/YYYY") : "N/A";
  const treatmentTime = sessionItem.TreatmentDate ? moment(sessionItem.TreatmentDate).format('LT') : "N/A";

  return (
    <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
      <View>
        <TextComponent style={{ width: 320 }} fontSize={sizes[4]}>Buổi {sessionItem.NoOfProcess}: {sessionItem.TreatmentRegimen}</TextComponent>
        <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
          <MaterialCommunityIcons name="clock-outline" color={COLORS.OldSilver} />
          <TextComponent style={{ color: COLORS.OldSilver }}> {treatmentTime}, {treatmentDate}</TextComponent>
        </View>

      </View>
      <View>
        <Ionicons name="chevron-forward-outline" color={COLORS.YankeesBlue} />
      </View>
    </View>
  );
};

export const TreatmentItemComponent = (props: any) => {
  const [listSession, setListSession] = useState([]);
  const [isExpand, setIsExpand] = useState(false);
  const [loading, setLoading] = useState(false);
  const { treatmentItem, isShowListSession, userId } = props;
  const timeStart = helpers.getFormattedDate(treatmentItem.TimeStart ? new Date(treatmentItem.TimeStart) : null);;
  const timeEnd = helpers.getFormattedDate(treatmentItem.TimeFinish ? new Date(treatmentItem.TimeFinish) : null);;

  const toggleTreamentItemSession = () => {
    if (isExpand == false) {
      getListSession();
    }
    setIsExpand(!isExpand);
  }

  const getListSession = async () => {
    setLoading(true);
    const res = await apiClient.get(`/service-user-processes/service-user/${treatmentItem.Id}`, null);
    setLoading(false);
    setListSession(res?.Success ? res.Data : []);
  }

  const openTreatmentSessionDetail = async (sessionItem: any) => {
    navigate(treatmentRoutes.SESSION, { sessionItem: sessionItem, treatmentItem: treatmentItem, userId: userId,  });
  };

  const renderItem = ({ item, index }: any) => (
    <View>
      <TouchableOpacity style={{ marginTop: 16 }} onPress={() => openTreatmentSessionDetail(item)} >
        <TreatmentItemSession sessionItem={item} />
      </TouchableOpacity>
    </View >
  );

  return (
    <TouchableOpacity style={[styles.container, treatmentCommonStyles.session, { paddingVertical: 16 }]} onPress={toggleTreamentItemSession} activeOpacity = {1} disabled = {!isShowListSession}>
      <View style={{ flexDirection: 'row' }}>
        <Image style={sharedStyles.treatmentServiceImage} source={image.image} />
        <View style={treatmentCommonStyles.leftServiceBlock}>
          <TextComponent numberOfLines={1} style={{ color: COLORS.YankeesBlue, lineHeight: 22, textTransform: 'uppercase', fontWeight: '500' }} fontSize={sizes[4]}>{treatmentItem.ServiceName}</TextComponent>
          <View>
            <View style={treatmentCommonStyles.rowSpaceBetween}>
              <View style={treatmentCommonStyles.rowSection}>
                <Ionicons name="location" color={COLORS.YankeesBlue} />
                <TextComponent numberOfLines={1} style={[treatmentCommonStyles.textDetail, { width: 200 }]} fontSize={sizes[3]}>{treatmentItem.LocationAddress}</TextComponent>
              </View>
              {
                isShowListSession &&
                <>
                  {
                    loading == false ? <View style={styles.iconToggleWrapper}>
                      <Ionicons name={isExpand ? 'chevron-up-outline' : 'chevron-down-outline'} color={COLORS.White} size={12}  />
                    </View> :
                      <ActivityIndicator
                        animating={true}
                        size="small"
                        color={COLORS.YankeesBlue}
                      />
                  }
                </>
              }
            </View>
          </View>
          <View>
            <View style={treatmentCommonStyles.rowSpaceBetween}>
              <View style={treatmentCommonStyles.rowSection}>
                <Ionicons name="timer-outline" color={COLORS.YankeesBlue} />
                <TextComponent style={treatmentCommonStyles.textDetail} fontSize={sizes[3]}>{timeStart} - {timeEnd ? timeEnd : "--/--/----"}</TextComponent>
              </View>
              <TextComponent style={treatmentItem.Status == ServiceUserStatus.DOING ? treatmentCommonStyles.textDoing : treatmentCommonStyles.textCompleted}>{treatmentItem.Status == ServiceUserStatus.DOING ? 'Đang làm' : 'Hoàn thành'}</TextComponent>
            </View>
          </View>
        </View>
      </View>
      <View>
        <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-between", marginTop: 4 }}>
          <TextComponent color={COLORS.Gray}>Giá dịch vụ:
            <TextComponent color={COLORS.YankeesBlue}> {helpers.currencyFormat(treatmentItem.Price)}đ</TextComponent>
          </TextComponent>
          <TextComponent color={COLORS.Gray}>Đã thanh toán:
            <TextComponent color={treatmentItem.Status == ServiceUserStatus.DOING ? COLORS.Yellow : COLORS.Eucalyptus}> {helpers.currencyFormat(treatmentItem.ActualPaidAmount)}đ</TextComponent>
          </TextComponent>
        </View>
        <View>
        </View>
      </View>
      {/* List session */}
      {isExpand &&
          <FlatListComponent
            data={listSession}
            renderItem={renderItem}
            keyExtractor={item => item.id}
          />

      }
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: COLORS.Grayscale,
    padding: 8,
    borderRadius: 8,
    width: "100%"
  },
  iconToggleWrapper: {
    width: 16,
    height: 16,
    backgroundColor: COLORS.YankeesBlue,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center"
  }
});
