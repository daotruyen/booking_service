import { PayloadAction } from '@reduxjs/toolkit';
import { AxiosResponse } from 'axios';
import ApiConfig from 'config/config';
import { apiClient } from 'services/baseAxios';
import { put, takeLatest, call } from 'typed-redux-saga';
import { saveItem } from 'shared/ultis/storageHelpers';
import { autoLoginRequest, loginRequest, loginSuccess } from './slice';
import { Constants } from '../type/index';
import { parserToken } from 'reduxCore/auth/slice';
import jwtDecode from 'jwt-decode';
import { getUserRequest } from 'reduxCore/user/slice';
import { delay } from 'redux-saga/effects';
import { disableAutoLoader, enableAutoLoader } from 'reduxCore/loading/slice';

const fetchLoginSaga = (payload: PayloadAction<any>) => {
  return apiClient.post(ApiConfig.LOGIN, payload);
};

function* autoLogin(payload: PayloadAction<any>) {
  yield put(enableAutoLoader());
  try {
    yield loginAsync(payload);
  } catch (error) {
    yield delay(1000);
    yield put(disableAutoLoader());
  }

  yield delay(1000);
  yield put(disableAutoLoader());
}

function* loginAsync({ payload }: PayloadAction<any>) {
  try {
    const res  = yield* call(fetchLoginSaga, payload);
    const {AppCode, Data} = res
    if (AppCode === 200) {
      let parsertoken: any = jwtDecode(Data.Token);
      yield put(getUserRequest(parsertoken.user_id));
      yield put(parserToken(parsertoken))
      saveItem(Constants.ACCESS_TOKEN, Data.Token);
      saveItem(Constants.REFRESH_TOKEN, Data.RefreshToken);
      saveItem(Constants.USER_ID, parsertoken.user_id);
      yield put(loginSuccess(Data))
      
    }
  } catch (error) {
    console.log('====================================');
    console.log('ssssss');
    console.log('====================================');
    yield put(disableAutoLoader());
  }
}

export function* authSaga() {
  yield* takeLatest(loginRequest, loginAsync);
  yield* takeLatest(autoLoginRequest, autoLogin);
}
