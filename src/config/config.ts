/* App config for apis
 */

export const BASE_URL = 'http://localhost:3000/api/v1';

const ApiConfig = {
  LOGIN: `/auths/authenticate`,
  SIGN_UP: `/auths/register`,
  SIGN_UP_VERIFIED_USER: `/auths/register-verified-user`,
  GET_SCHEDULE: '/bookings/user/',
  UPDATE_SCHEDULE: '/bookings/',
  GET_SERVICE_OF_USER: '/service-users/search',
  GET_PURCHASE_HISTORY: '/product-users/user',
  USER: '/users/',
  USER_CUSTOMER: '/users/customers',
  FEEDBACK: '/customer-feedback',
  PROVINCES: '/locations/provinces',
  DISTRICTS: '/locations/districts',
  WARDS: '/locations/wards',
  PRODUCTS: '/products',
  SPA_SERVICES: '/spa-services',
  CREATE_PRODUCT: '/product-users',
  LOCATION_SPAS: '/locations/my-spas',
  CREATE_SERVICE: '/service-users',
  CREATE_CUSTOMER: '/users',
  SERVICE_USER_PROCESSES: '/service-user-processes',
  TYPE_USERS: '/users/users-by-type',
  ACCOUNT_VERIFICATION: '/auths/account-verification',
  REGISTER_VERIFICATION: '/auths/register-verification',
  OTP_VERIFICATION: '/auths/otp-verification',
  RESET_PASSWORD: '/auths/reset-password',
  GET_NOTIFICATION: '/notifications/user/',
  READ_NOTIFICATION: '/notifications/',
  REGISTER_DEVICE: '/notifications/device-registration',
  GET_ARTICLE: '/articles/paging',
  GET_DETAIL_ARTICLE: '/articles/',
  REMOVE_TOKEN: '/notifications/device-deregistration',
};

export default ApiConfig;
