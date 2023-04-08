export const validateEmail = (email: string) => {
  var re =
    /^(([^<>()\\[\]\\.,;:\s@"]+(\.[^<>()\\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

export const validatePersonName = (fullName: string) => {
  return /^[a-zA-Z ]+$/.test(fullName);
};

export const validatePassword = (password: string) => {
  if(password.length > 7) {
    return true;
  } 
  return false;
}

export const validatePhone = (phone: string) => {
  const regexPhone = new RegExp(
    /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
  );
  return regexPhone.test(phone);
};
