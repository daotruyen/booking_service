import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SearchBar } from '@rneui/themed';
import { COLORS } from 'shared/constants/colors';

export interface Props {
  placeholder?: string;
  value?: string;
  customStyle?: {};
  onChangeText?: (value: any) => void;
}

export const HSearchBar: React.FC<Props> = props => {
  const [isFocusing, setIsFocusing] = useState(false);
  const { placeholder, value, customStyle, onChangeText } = props;

  return (
    <View style={[customStyle]}>
      <SearchBar
        placeholder={placeholder}
        onChangeText={onChangeText}
        value={value}
        containerStyle={styles.containerSearchBar}
        inputContainerStyle={[styles.inputContainerSearchBarStyle, { borderColor: isFocusing ? COLORS.YankeesBlue : COLORS.LightSilver }]}
        inputStyle={{ fontSize: 14, marginLeft: -3 }}
        onFocus={() => setIsFocusing(true)}
        onBlur={() => setIsFocusing(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  containerSearchBar: {
    backgroundColor: COLORS.White,
    borderTopColor: "transparent",
    borderBottomColor: "transparent"
  },
  inputContainerSearchBarStyle: {
    backgroundColor: COLORS.White,
    borderRadius: 6,
    height: 36,
    marginHorizontal: 16,
    marginVertical: 12,
    borderWidth: 1,
    borderBottomWidth: 1,
  },
});


