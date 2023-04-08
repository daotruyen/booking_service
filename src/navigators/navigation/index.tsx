import CounselorNavigation from 'navigators/counselorNavigation';
import TechnicalNavigation from 'navigators/technicalNavigation';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectAuth } from 'reduxCore/auth/slice';
import { selectLoading } from 'reduxCore/loading/slice';
import StartUpScreen from 'screens/start-up/startUpScreen';
import { roleName, TypeArticle } from 'shared/constants/common';
import AuthNavigation from '../../navigators/authNavigation';
import MainNavigation from '../../navigators/mainNavigation';
import AuthMainStack from '../authNavigation/authMainStack';
import { useDispatch } from 'react-redux';
import { getArticleEventRequest, getArticleHotServiceRequest, getArticleNewServiceRequest, getArticleRequest } from 'reduxCore/article/slice';

export type RootStackParamList = Record<string, any>;

const Navigation: React.FunctionComponent = () => {
  const dispatch = useDispatch()
  
  const isLoggedIn = useSelector((state: any) => state.auth.isLoggedIn);
  const {isAppLoading} = useSelector(selectLoading)
  const {role, Token} = useSelector(selectAuth)
  useEffect(() => {
    dispatch(
      getArticleRequest({
        PageIndex: 1,
        PageSize: 0,
        SortBy: null,
        SortDirection: 0,
        Keyword: null,
        ArticleGroup: TypeArticle.SaleOffProgram,
        DateFrom: null,
        DateTo: null,
        IsActive: true,
      })
    );
    dispatch(
      getArticleHotServiceRequest({
        PageIndex: 1,
        PageSize: 4,
        SortBy: null,
        SortDirection: 0,
        Keyword: null,
        ArticleGroup: TypeArticle.HotService,
        DateFrom: null,
        DateTo: null,
        IsActive: true,
      })
    );
    dispatch(
      getArticleEventRequest({
        PageIndex: 1,
        PageSize: 0,
        SortBy: null,
        SortDirection: 0,
        Keyword: null,
        ArticleGroup: TypeArticle.Event,
        DateFrom: null,
        DateTo: null,
        IsActive: true,
      })
    );
    dispatch(
      getArticleNewServiceRequest({
        PageIndex: 1,
        PageSize: 0,
        SortBy: null,
        SortDirection: 0,
        Keyword: null,
        ArticleGroup: TypeArticle.NewService,
        DateFrom: null,
        DateTo: null,
        IsActive: true,
      })
    );
  }, []);
  let roleUser = '';
  if(typeof role == 'string') {
    roleUser = role;
  } else {
    roleUser = role[0];
  }

  console.log('====================================');
  console.log(isAppLoading, 'isAppLoading');
  console.log('====================================');

  if(isAppLoading) {
    return <StartUpScreen />
  }

  if (Token) {
    switch (roleUser) {
      case roleName.CUSTOMER:
        return <MainNavigation />;
        break;
      case roleName.COUNSELOR:
        return <CounselorNavigation />;
        break;
      case roleName.TECHNICIAN:
        return <TechnicalNavigation />;
        break;
      default:
        return <AuthMainStack />;
        break;
    }    
  } else {
    return <AuthMainStack />;
  }

};

export default Navigation;
