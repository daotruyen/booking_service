import TextComponent from 'components/Text';
import { COLORS } from 'shared/constants/colors';
import { sizes } from 'shared/constants/common';
import React, { Component } from 'react';
import { View, Text, StyleSheet, StatusBar, Pressable, Platform } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { isIOS } from 'react-native-size-scaling';

// create a component
export interface Props {
  title?: string;
  style?: {};
  showBack?:  boolean;
  iconRight? : boolean;
  onPressRight?: () => void;
}
const Header: React.FC<Props> = props => {
  const { title, style, showBack, iconRight, onPressRight } = props
  const navigation = useNavigation();
  return (
    <View style={[styles.container, style]}>
      <StatusBar backgroundColor={COLORS.YankeesBlue} barStyle="light-content" />
      {showBack ?
        <Pressable
          onPress={() => {
            navigation.goBack();
          }}
          style={{
            padding: 25,
            paddingTop: isIOS ? 40: 20,
            paddingBottom: 20
          }}>
          <Ionicons name='md-arrow-back' size={25} color={COLORS.White} />
        </Pressable>
        :
        <View style={{ height: isIOS ? 80 : 40}} />
      }
      <TextComponent fontSize={sizes[6]} color={COLORS.White}>{title}</TextComponent>
      {/* {iconRight ?
        <Pressable
          onPress={onPressRight}
          style={{
            padding: 25,
            paddingTop: isIOS ? 40: 20,
            paddingBottom: 20
          }}>
          <Ionicons name='ios-home' size={25} color={COLORS.White} />
        </Pressable>
        :
        <View style={{ height: 60}} />
      } */}
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: { 
    backgroundColor: COLORS.YankeesBlue, 
    // padding: Platform.OS == 'ios' ? 24 : 12, 
    alignItems: 'center', 
    borderBottomRightRadius: 24, 
    borderBottomLeftRadius: 24, 
    justifyContent:'space-between',
    flexDirection: 'row',

  },
});

//make this component available to the app
export default Header;
