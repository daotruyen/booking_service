import { COLORS } from 'shared/constants/colors';
import {
  StyleSheet
} from "react-native";

const sharedStyles = StyleSheet.create({
  tabTitleStyle: {
    color: COLORS.PhilippineSilver,
    fontSize: 16,
    fontWeight: "500"
  },
  tabTitleActive: {
    color: COLORS.YankeesBlue,
    fontSize: 16,
    fontWeight: "500"
  },
  treatmentServiceImage: {
    width: 75,
    height: 75
  },
  rowSpaceBetween: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
});

export default sharedStyles;
