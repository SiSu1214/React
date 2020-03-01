/**
 *
 * Storing data
 *
 */

import AsyncStorage from '@react-native-community/async-storage';

export default class DeviceStorage {
  /**
   * Get
   * @param key
   * @returns {Promise<T>|*|Promise.<TResult>}
   */
  static get(key) {
    return AsyncStorage.getItem(key).then(value => {
      const jsonValue = JSON.parse(value);
      return jsonValue;
    });
  }

  /**
   * Save
   * @param key
   * @param value
   * @returns {*}
   */
  static save(key, value) {
    return AsyncStorage.setItem(key, JSON.stringify(value));
  }

  /**
   * Update
   * @param key
   * @param value
   * @returns {Promise<T>|Promise.<TResult>}
   */
  static update(key, value) {
    return DeviceStorage.get(key).then(item => {
      const newValue =
        typeof value === 'string' ? value : Object.assign({}, item, value);
      return AsyncStorage.setItem(key, JSON.stringify(newValue));
    });
  }

  /**
   * Delete
   * @param key
   * @returns {*}
   */
  static delete(key) {
    return AsyncStorage.removeItem(key);
  }
}
