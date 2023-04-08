import axios from 'axios';
import { put, takeLatest, call } from 'typed-redux-saga';
import { getScheduleRequest, getScheduleSuccess, putScheduleRequest, putScheduleSuccess } from './slice';
import { apiClient } from 'services/baseAxios';
import ApiConfig from 'config/config';
import { PayloadAction } from '@reduxjs/toolkit';

const fetchScheduleSaga = (userId: string) => {
  const url: string = ApiConfig.GET_SCHEDULE + userId;
  return apiClient.get(url, null);
};

const putScheduleSaga = (payload: any) => {
  const url: string = ApiConfig.UPDATE_SCHEDULE + payload.userId;
  return apiClient.put(url, payload.data);
}

function* getScheduleSaga({ payload }: PayloadAction<any>) {
  const response = yield* call(fetchScheduleSaga, payload.userId);
  if (response.AppCode == 200) {
    yield put(getScheduleSuccess(response.Data ?? []));
  } else {
    yield put(getScheduleSuccess([]));
  }
}

function* updateScheduleSaga({ payload }: PayloadAction<any>) {
  const response = yield* call(putScheduleSaga, payload)
  if (response.AppCode === 200) {
    yield put(putScheduleSuccess())
  }
}

export function* scheduleSaga() {
  yield* takeLatest(getScheduleRequest, getScheduleSaga);
  yield* takeLatest(putScheduleRequest, updateScheduleSaga);
}
