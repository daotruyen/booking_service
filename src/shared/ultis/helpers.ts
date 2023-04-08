import moment from "moment";
import { Platform } from "react-native";

const isEmpty = (str: string) => {
  return (str.trim().length == 0);
};

const getFormattedDate = (date: any) => {
  if (!date) return "";

  var year = date.getFullYear();

  var month = (1 + date.getMonth()).toString();
  month = month.length > 1 ? month : '0' + month;

  var day = date.getDate().toString();
  day = day.length > 1 ? day : '0' + day;

  return day + '/' + month + '/' + year;
}

const convertUtcTime = (time: string) => {  
  return moment.utc(time).format('DD-MM-YYYY');
}

const textTime = () => {
  const key = moment().hour();
  if(key > 0 && key < 13) {
    return 'Chào buổi sáng';
  } else if( key > 12 && key < 18) {
    return "Chào buổi chiều";
  } else if (key < 24) {
    return "Chào buổi tối";
  } else {
    return "Chào"
  }
}

const currencyFormat = (num: number, seperator: string = ".") => {
  if (!num) return 0;
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, `$1${seperator}`)
}

const convertStatusCodeToString = (code: number) => {
  switch (code) {
    case 200:
      return 'Yêu cầu đã thành công';
      break;
    case 400:
      return 'Yêu cầu đã thành công';
      break;
    case 201:
      return 'Đăng ký thành công';
      break;
    case 401:
      return 'Tài khoản không xác thực';
      break;
    case 403:
      return 'Bạn không có quyền truy cập tính năng này';
      break;
    case 404:
      return 'Không thể tìm thấy dữ liệu';
      break;
      case 409:
        return 'Số điện thoại đã được đăng ký';
        break;
    case 500:
      return 'Máy chủ bảo trì';
      break;
    default:
      break;
  }
}

const isIos = () => {
  if(Platform.OS === 'ios') {
    return true
  } else { return false}
}

const convertTime = (time: string) => {
  
  const timeConvert = moment(time).format("HH:mm");
  const date = moment(time)
  const currentDate = moment();
  const daysDifference = currentDate.diff(date, 'days');
  if(daysDifference == 0) {
    return `Hôm nay, ${timeConvert}`;
  } else if(daysDifference == 1){
    return `Hôm qua, ${timeConvert}`;
  } else {
    return `${daysDifference} ngày trước`
  }
}

export const helpers = {
  isEmpty,
  getFormattedDate,
  convertUtcTime,
  currencyFormat,
  convertStatusCodeToString, 
  isIos,
  convertTime,
  textTime,
}
