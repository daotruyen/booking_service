import  articleSlice  from './../article/slice';
import createServiceSlice  from './../createService/slice';
import { combineReducers } from '@reduxjs/toolkit';
import  authSlice from 'reduxCore/auth/slice';
import mainSlice from 'reduxCore/main/slice';
import userSlice  from 'reduxCore/user/slice';
import scheduleSlice from '../schedule/slice';
import  notificationSlice from '../notification/slice';
import  loadingSlice  from 'reduxCore/loading/slice';

export type RootReducer = ReturnType<typeof rootReducer>;

export const rootReducer = combineReducers({
  main: mainSlice,
  auth: authSlice,
  schedule: scheduleSlice,
  user: userSlice,
  createService: createServiceSlice,
  notification: notificationSlice,
  loading: loadingSlice,
  article: articleSlice,
});
