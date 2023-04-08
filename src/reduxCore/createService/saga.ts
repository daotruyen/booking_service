import {
  getLocationMySpasRequest,
  getLocationMySpasSuccess,
  getProductRequest,
  getProductSuccess,
  getPurchaseRequest,
  getServiceRequest,
  getServiceSuccess,
  getSpaServicesRequest,
  getSpaServicesSuccess,
} from "reduxCore/createService/slice";
import { apiClient } from "services/baseAxios";
import { put, takeLatest, call } from "typed-redux-saga";
import { getPurchaseSuccess, getUserRequest, getUserSuccess } from "./slice";
import ApiConfig from "config/config";

const fetchUserCustomer = (phoneNumber: string) => {
  return apiClient.get(ApiConfig.USER_CUSTOMER, phoneNumber);
};

const fetchPurchaseUser = (payload: any) => {
  return apiClient.post(ApiConfig.GET_PURCHASE_HISTORY, payload.payload);
};

const fetchServiceUser = (payload: any) => {
  return apiClient.post(ApiConfig.GET_SERVICE_OF_USER, payload.payload);
};

const fetchProducts = (payload: any) => {
  return apiClient.get(ApiConfig.PRODUCTS, payload.payload);
};

const fetchSpaServices = (payload: any) => {
  return apiClient.get(ApiConfig.SPA_SERVICES, payload.payload);
};

const fetchMySpas = () => {
  return apiClient.get(ApiConfig.LOCATION_SPAS, {});
};

function* getUserCustomer(payload: any) {
  const response = yield* call(fetchUserCustomer, payload);
  const { AppCode, Data } = response;

  if (AppCode === 200) {
    yield put(getUserSuccess(Data));
  } else {
    yield put(getUserSuccess([]));
  }
}

function* getServiceCustomer(payload: any) {
  const response = yield* call(fetchServiceUser, payload);
  const { AppCode, Data } = response;

  if (AppCode === 200) {
    yield put(getServiceSuccess(Data));
  } else {
    yield put(getServiceSuccess([]));
  }
}

function* getPurchaseUserCustomer(payload: any) {
  const response = yield* call(fetchPurchaseUser, payload);
  const { AppCode, Data } = response;

  if (AppCode === 200) {
    yield put(getPurchaseSuccess(Data));
  } else {
    yield put(getPurchaseSuccess([]));
  }
}

function* getProduct(payload: any) {
  const response = yield* call(fetchProducts, payload);
  const { AppCode, Data } = response;

  if (AppCode === 200) {
    yield put(getProductSuccess(Data));
  } else {
    yield put(getProductSuccess([]));
  }
}

function* getSpaServices(payload: any) {
  const response = yield* call(fetchSpaServices, payload);
  const { AppCode, Data } = response;

  if (AppCode === 200) {
    yield put(getSpaServicesSuccess(Data));
  } else {
    yield put(getSpaServicesSuccess([]));
  }
}

function* getMySpas() {
  const response = yield* call(fetchMySpas);
  const { AppCode, Data } = response;
  if (AppCode === 200) {
    yield put(getLocationMySpasSuccess(Data));
  } else {
    yield put(getLocationMySpasSuccess([]));
  }
}

export function* createServiceSaga() {
  yield* takeLatest(getUserRequest, getUserCustomer);
  yield* takeLatest(getPurchaseRequest, getPurchaseUserCustomer);
  yield* takeLatest(getServiceRequest, getServiceCustomer);
  yield* takeLatest(getProductRequest, getProduct);
  yield* takeLatest(getSpaServicesRequest, getSpaServices);
  yield* takeLatest(getLocationMySpasRequest, getMySpas);
}
