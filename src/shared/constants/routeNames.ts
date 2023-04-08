const ROUTE_MAIN = "Main";
const ROUTE_LOGIN = "Login";
const ROUTE_REGISTER = "Register";
const ROUTE_HOME = "HomeAuth";

//Auth
export const ROUTE_HOME_AUTH =  'HomeAuth';
export const ROUTE_SERVICE_AUTH =  'ServiceAuth';
export const ROUTE_PROMOTION_AUTH =  'PromotionAuth';
export const ROUTE_EVENT_AUTH =  'EventAuth';
export const ROUTE_HOTLINE_AUTH =  'HotlineAuth';

//Main
export const ROUTE_HOME_STACK =  'HomeStack';
export const ROUTE_TREATMENT_STACK =  'TreatmentStack';
export const ROUTE_SCHEDULE_STACK =  'ScheduleStack';
export const ROUTE_EVENT_STACK =  'EventStack';
export const ROUTE_FEEDBACK_STACK =  'FeedbackStack';

//Counselor
export const ROUTE_HOME_COUNSELOR = "HomeCounselor";
export const ROUTE_CREATE_USER = 'CreateUser';
export const ROUTE_CREATE_SERVICE = "CreateService";
export const ROUTE_USER = "UserCounselor"

//HomeStack
export const HOME_PAGE = 'HomePage';
export const USER_SCREEN ='UserScreen';
export const NOTIFICATION_SCREEN = "Notification";
export const HOT_SERVICE_ARTICLE = 'HotServiceArticle';
export const EVENT_ARTICLE = 'EventArticle';
export const NEW_SERVICE_ARTICLE = 'NewServiceArticle';

//AuthStack
export const AUTH_PAGE = 'AuthPage';
export const FORGOT_PASSWORD = 'ForgotPassword';
export const AUTH_MAIN_PAGE = 'AuthMainPage';
export const DETAIL_ARTICLE = 'DetailArticle';

//CreateServiceStack
export const CREATE_SERVICE_PAGE = "CreateServicePage";
export const INFO_USER = "InfoUser";
export const INFO_USER_SCREEN = 'InfoUserScreen'

const treatmentRoutes = {
  MAIN: "TreatmentScreen.Main",
  SESSION: "TreatmentScreen.Session"
};

export const purchaseHistoryRoutes = {
  PURCHASE: 'PurchaseScreen',
  PURCHASE_DETAIL: 'PurchaseDetailScreen'
}

export { ROUTE_LOGIN, ROUTE_MAIN, ROUTE_REGISTER, treatmentRoutes, ROUTE_HOME }
