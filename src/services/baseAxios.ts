import { logout } from 'reduxCore/auth/slice';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TOKEN_KEY, REFRESH_TOKEN_KEY } from "shared/constants/common";
import { Platform } from 'react-native';

import { navigate } from "navigators/index"
import { ROUTE_LOGIN } from 'shared/constants/routeNames';
import { getItem } from 'shared/ultis/storageHelpers';
import { Constants } from '../reduxCore/type/index';
import { useDispatch } from 'react-redux';
// import { BASE_URL } from '../config/config';
// const BASE_URL = Platform.OS == 'ios' ? 'http://localhost:3000/api/v1' : 'http://10.0.2.2:3000/api/v1';

const BASE_URL = 'https://api.hkmedi.company/api/v1'
export const httpClient = axios.create({
  baseURL: BASE_URL,
  timeout: 50000,
  headers: {
    "Access-Control-Allow-Origin": "*",
  },
  withCredentials: true,
});

httpClient.interceptors.request.use(
  async (config) => {
    const token = await getItem(Constants.ACCESS_TOKEN);
    config.headers = {
      'Authorization': `Bearer ${token}`
    }
    return config;
  },
  error => {
    Promise.reject(error)
  });

httpClient.interceptors.response.use(
  // Any status code that lie within the range of 2xx cause this function to trigger
  // Do something with response data
  function (response) {
    return response;
  },
  // Any status codes that falls outside the range of 2xx cause this function to trigger
  // Do something with response error
  async function (error) {
    const originalConfig = error.config;
    if (error?.response?.status === 401 && !originalConfig._retry) {
      originalConfig._retry = true;

      // Handle refresh token 
      const token = await AsyncStorage.getItem(TOKEN_KEY);
      const refreshToken = await AsyncStorage.getItem(REFRESH_TOKEN_KEY);
      if (!refreshToken) {
        logoutAction();
        return Promise.reject(error);
      }

      try {
        const res = await httpClient.post("/Auth/refresh-token", { AccessToken: token, RefreshToken: refreshToken });
        if (res?.data?.Success) {
          await AsyncStorage.setItem(TOKEN_KEY, res.data.Data.Token);
          await AsyncStorage.setItem(REFRESH_TOKEN_KEY, res.data.Data.RefreshToken);
          return httpClient(originalConfig);
        }
        else {
          logoutAction();
        }
      } catch (_error: any) {
        if (_error.response && _error.response.data) {
          logoutAction();
        }
      }
    }

    return Promise.reject(error);
  }
);

const logoutAction = async () => {
  const dispatch = useDispatch()
  dispatch(logout())
  await AsyncStorage.removeItem(TOKEN_KEY);
  await AsyncStorage.removeItem(REFRESH_TOKEN_KEY);
  await AsyncStorage.removeItem(Constants.PHONE_NUMBER);
  await AsyncStorage.removeItem(Constants.PASSWORD)
}

const apiClient = {
  get: (url: any, data: any) => {
    console.log(url, data);

    return httpClient({
      method: 'get',
      url: url,
      params: data
    })
      .then((response) => {
        console.log(response);

        return response.data;
      })
      .catch((err) => {
        console.log(err);

        throw err;
      });
  },
  post: (url: any, data: any, params?: any) => {
    console.log('post ', { url }, { data });
    return httpClient({
      method: 'post',
      url: url,
      data: data,
      params: params,
    })
      .then((response) => {
        return response.data;
      })
      .catch((err) => {
        console.log(err);

        throw err;
      });
  },
  patch: (url: any, data: any) => {
    return httpClient({
      method: 'patch',
      url: url,
      data: data,
    })
      .then((response) => {
        return response.data;
      })
      .catch((err) => {
        throw err;
      });
  },
  delete: (url: any, data: any) => {
    return httpClient({
      method: 'delete',
      url: url,
      data: data,
    })
      .then((response) => {
        return response.data;
      })
      .catch((err) => {
        throw err;
      });
  },
  put: (url: any, data: any) => {
    console.log(url, data);
    return httpClient({
      method: 'put',
      url: url,
      data: data,
    })
      .then((response) => {
        return response.data;
      })
      .catch((err) => {
        throw err;
      });
  },
};

export { apiClient };


