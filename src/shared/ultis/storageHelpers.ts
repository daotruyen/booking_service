import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const saveItem = async (key: string, value: any) => {
  try {
    const convertValue =
      typeof value == 'object' ? JSON.stringify(value) : String(value);
    await AsyncStorage.setItem(key, convertValue);
  } catch (error) {
    console.log('error when save' + key);
  }
};

const getItem = async (key: string) => {
  try {
    const result = await AsyncStorage.getItem(key);
    return result;
  } catch (e) {
    console.log('errrr', e);
    return null;
  }
};

const insertItem = async (key: string, value: any) => {
  try {
    const valLocal = await getItem(key);

    if (valLocal) {
      const newData = [value, ...valLocal];
      saveItem(key, newData);
    } else {
      saveItem(key, [value]);
    }
  } catch (err) {
    console.log('err insert local storage', err);
  }
};

const useStorage = (key = '', context = []) => {
  const [value, setValue] = useState('');

  useEffect(() => {
    getItem(key).then((val: string | null) => {
      console.log({ val });
      setValue(val ?? "");
    });
  }, context);

  useEffect(() => {
    saveItem(key, value);
  }, [value, ...context]);

  return [value, setValue];
};

export { useStorage, saveItem, getItem, insertItem };
