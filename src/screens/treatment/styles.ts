import { StyleSheet } from "react-native";
import { COLORS } from "shared/constants/colors";

export const treatmentCommonStyles = StyleSheet.create({
  rowSection: {
    flexDirection: 'row',
    paddingVertical: 2,
    alignItems: 'center',
    lineHeight: 20
  },
  rowSpaceBetween: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  textDetail: {
    paddingLeft: 5,
    color: COLORS.Gray
  },
  textDoing: {
    fontSize: 14,
    color: COLORS.Yellow
  },
  textCompleted: {
    fontSize: 14,
    color: COLORS.Eucalyptus
  },
  session: {
    borderRadius: 8,
    padding: 8,
    shadowColor: "rgba(34, 34, 34, 0.15)",
    shadowOpacity: 0.8,
    shadowOffset: {
      width: 0,
      height: 1
    },
    elevation: 1,
    backgroundColor: COLORS.White
  },
  sessionBlock: {
    borderRadius: 8,
    padding: 16,
    shadowColor: "rgba(34, 34, 34, 0.15)",
    shadowOpacity: 0.8,
    shadowOffset: {
      width: 0,
      height: 1
    },
    elevation: 1,
    backgroundColor: COLORS.White
  },
  leftServiceBlock: {
    flex: 1,
    paddingLeft: 8,
    flexDirection: "column",
    justifyContent: "space-between"
  }
});
