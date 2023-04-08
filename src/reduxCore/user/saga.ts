import { PayloadAction } from '@reduxjs/toolkit';
import { AxiosResponse } from 'axios';
import ApiConfig from 'config/config';
import { apiClient } from 'services/baseAxios';
import { put, takeLatest, call } from 'typed-redux-saga';
import { getUserRequest, getUserSuccess, updateUserRequest, updateUserSuccess } from './slice';

const fetchUserSaga = (payload: PayloadAction<any>) => {
  const url: string = ApiConfig.USER + payload;
  return apiClient.get(url, null);
};

const updateUserSaga = (payload: PayloadAction<any>) => {
  return apiClient.put(ApiConfig.USER, payload);
};

function* getUser({ payload }: PayloadAction<any>) {
  try {
    const res: AxiosResponse<any> = yield* call(fetchUserSaga, payload);
    if (res.AppCode === 200) {
      yield put(getUserSuccess(res.Data))
    }
  } catch (error) {
    // yield put(getUserSuccess({}));
  }
}

function* updateUser({ payload }: PayloadAction<any>) {    
  try {
    const res: AxiosResponse<any> = yield* call(updateUserSaga, payload);    
    if (res.AppCode === 200) {
      yield put(getUserRequest(payload.UserId))
    }
  } catch (error) {    
    // yield put(updateUserSuccess({}));
  }
}

export function* userSaga() {
  yield* takeLatest(getUserRequest, getUser);
  yield* takeLatest(updateUserRequest, updateUser);
}
