export const getFromStorage = (key, defaultVal) => {
  const val = window.localStorage.getItem(key);
  if (val) {
    return val;
  } else {
    window.localStorage.setItem(key, defaultVal);
    return val;
  }
};
