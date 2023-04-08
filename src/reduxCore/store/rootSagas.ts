import { fork } from 'redux-saga/effects';
import { authSaga } from 'reduxCore/auth/saga';
import { createServiceSaga } from 'reduxCore/createService/saga';
import { notificationSaga } from '../notification/saga';
import { scheduleSaga } from 'reduxCore/schedule/sagas';
import { userSaga } from '../user/saga';
import { articleSaga } from 'reduxCore/article/saga';

export default function* rootSaga() {
  yield fork(authSaga);
  yield fork(scheduleSaga);
  yield fork(notificationSaga);
  yield fork(userSaga);
  yield fork(createServiceSaga);
  yield fork(articleSaga)
}
