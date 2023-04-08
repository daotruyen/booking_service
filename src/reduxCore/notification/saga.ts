import axios from 'axios';
import ApiConfig from 'config/config';
import { apiClient } from 'services/baseAxios';
import { put, takeLatest, call } from 'typed-redux-saga';
import { getNotificationRequest, getNotificationSuccess } from './slice';

const fetchTodoSaga = (data: any) => {
  const dataRequest = {
    pageIndex: data.pageIndex,
    pageSize: data.pageSize,
  }
  return apiClient.get(`${ApiConfig.GET_NOTIFICATION}${data.userId}`, dataRequest);
};

function* getNotificationSaga(payload: any) {
  try {
    const response = yield* call(fetchTodoSaga, payload.payload);
    const { AppCode, Data } = response;
    if(AppCode == 200) {
        yield put(getNotificationSuccess(Data));
    }
  } catch (error) {
    console.log(error,)
  }
}

export function* notificationSaga() {
  yield* takeLatest(getNotificationRequest , getNotificationSaga);
}
