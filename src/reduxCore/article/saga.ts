import { PayloadAction } from "@reduxjs/toolkit";
import ApiConfig from "config/config";
import { apiClient } from "services/baseAxios";
import { TypeArticle } from "shared/constants/common";
import { put, takeLatest, call } from "typed-redux-saga";
import {
  getArticleRequest,
  getArticleSaleOffProgramSuccess,
  getArticleHotServiceSuccess,
  getArticleHotServiceRequest,
  getArticleEventRequest,
  getArticleNewServiceRequest,
  getArticleNewServiceSuccess,
  getArticleEventSuccess,
} from "./slice";

const fetchArticleSaga = (payload: PayloadAction<any>) => {
  return apiClient.post(ApiConfig.GET_ARTICLE, payload);
};

function* getArticle({ payload }: PayloadAction<any>) {
  try {
    const res = yield* call(fetchArticleSaga, payload);
    if (res.AppCode === 200) {
      yield put(getArticleSaleOffProgramSuccess(res.Data.ListOut));
    }
  } catch (error) {}
}

function* getArticleHotService({ payload }: PayloadAction<any>) {
  try {
    const res = yield* call(fetchArticleSaga, payload);
    if (res.AppCode === 200) {
      yield put(getArticleHotServiceSuccess(res.Data.ListOut));
    }
  } catch (error) {}
}

function* getArticleEvent({ payload }: PayloadAction<any>) {
  try {
    const res = yield* call(fetchArticleSaga, payload);
    if (res.AppCode === 200) {
      yield put(getArticleEventSuccess(res.Data.ListOut));
    }
  } catch (error) {}
}

function* getArticleNewService({ payload }: PayloadAction<any>) {
  try {
    const res = yield* call(fetchArticleSaga, payload);
    if (res.AppCode === 200) {
      yield put(getArticleNewServiceSuccess(res.Data.ListOut));
    }
  } catch (error) {}
}

export function* articleSaga() {
  yield* takeLatest(getArticleRequest, getArticle);
  yield* takeLatest(getArticleHotServiceRequest, getArticleHotService);
  yield* takeLatest(getArticleEventRequest, getArticleEvent);
  yield* takeLatest(getArticleNewServiceRequest, getArticleNewService);
}
