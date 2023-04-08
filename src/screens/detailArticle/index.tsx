//import liraries
import Header from 'components/Headers';
import TextComponent from 'components/Text';
import React, { useState } from 'react';
import { View, StyleSheet, Pressable, ScrollView, Linking } from 'react-native';
import { width } from 'react-native-size-scaling';
import { COLORS } from '../../shared/constants/colors';
import { PHONE_DEFAULT, sizes } from 'shared/constants/common';
import AutoHeightImage from 'react-native-auto-height-image';
import { apiClient } from 'services/baseAxios';
import ApiConfig from 'config/config';
import { useEffect } from 'react';
import { globalLoading } from 'components';

// create a component
const DetailArticle = ({ route }: any) => {
  const  item = route.params;
  const [detail, setDetail] = useState()

  const call = () => {
    Linking.openURL(`tel:${PHONE_DEFAULT}`)
  }

  const getDetailArticle = async() => {
    globalLoading.show()
    try {
      const res = await apiClient.get(`${ApiConfig.GET_DETAIL_ARTICLE}${item.Id ?? item.EntityId}`)
      const {Data, AppCode} = res;
      if(AppCode === 200) {
        setDetail(Data)
        globalLoading.hide()

      }
      globalLoading.hide()
    } catch (error) { 
      globalLoading.hide()

    }
  }

  useEffect(() => {
    getDetailArticle()
  }, [item])

  return (
    <View style={styles.container}>
      <Header showBack/>
      <ScrollView >
      <View style={{marginTop: 16,}}>
        <View style = {{alignItems: 'center', flex: 1}}>
          <AutoHeightImage 
            width = {width - 32}
            source = {{uri: detail?.ArticleImg}} 
          />
        </View>
        <View style = {{padding: 16}}>
          <TextComponent bold fontSize={sizes[5]}>{detail?.Title}</TextComponent>
          <TextComponent style ={{paddingVertical: 8, }} color = {COLORS.Tertiary}>Mô tả</TextComponent>
          <TextComponent>{detail?.Content}</TextComponent>
        </View>
      </View>
      <View style ={{justifyContent: 'flex-end', flex: 1}}>
        <Pressable style ={{backgroundColor :COLORS.Lavender, padding: 8 ,alignItems: 'center', margin: 16,marginBottom: 32,borderRadius: 6}} onPress ={call}>
          <TextComponent color={COLORS.YankeesBlue}>Liên hệ tư vấn</TextComponent>
        </Pressable>
      </View>
      </ScrollView>
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,

  },
});

//make this component available to the app
export default DetailArticle;
