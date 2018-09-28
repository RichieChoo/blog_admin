import { message } from 'antd';
import request from './request';

// set baseUrl
const baseUrl = '/api/';
// const baseUrl = 'http://192.168.27.219:10001/api/';
// const baseUrl = 'http://192.168.27.52:8080/pss-operation-web/';
/**
 *  对request再做一次定制化封装
 * @author Yoonthe
 * @param {String} url
 * @param {Object} config
 * @param {Boolean} noAlert = false
 * @return {Promise} resolve(res.data) / reject(res)
 */
const reqRest = (url, config, noAlert = false) => {
  return request(baseUrl + url.replace(/^\//, ''), config)
    .then((res) => {
      message.destroy();
      if (!noAlert && !res) {
        message.error('请求失败!');
      } else if (!noAlert && !res.success) {
        message.error(`请求失败，错误码:${res.errorCode}，错误描述:${res.errorDesc}`);
      }
      return res;
    });
};
/**
 *  对request再做一次定制化封装, 请求方法为 GET
 * @author Yoonthe
 * @param {String} url
 * @param {Object} config
 * @return {Promise} resolve(res.data) / reject(res)
 */
reqRest.get = (url, config, ...params) => {
  return reqRest(url, {
    ...config,
    method: 'GET',
  }, ...params);
};
/**
 *  对request再做一次定制化封装，请求方法为 POST
 * @author Yoonthe
 * @param {String} url
 * @param {Object} body
 * @param {Object} config
 * @return {Promise} resolve(res.data) / reject(res)
 */
reqRest.post = (url, body, config, ...params) => {
  return reqRest(url, {
    ...config,
    body,
    method: 'POST',
  }, ...params);
};
export default reqRest;
