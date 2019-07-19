import store from '../app/store';

var get = require('lodash.get');

const FETCH_TIMEOUT = 180000;
let didTimeOut = false;

function timeoutPromise(promise) {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(function () {
      didTimeOut = true;
      reject(new Error('Request timed out'));
    }, FETCH_TIMEOUT);

    promise.then(
      (res) => {
        clearTimeout(timeout);
        if (!didTimeOut) {
          console.log('fetch good! ', res);
          resolve(res);
        }
      },
      (err) => {
        console.log('fetch failed! ', err);
        if (didTimeOut) return;
        reject(err);
      }
    );
  })
}

class HeaderRequestService {

  static setHeaderRequest() {

    let defaultHeader = {
      'Accept': 'application/json, */*',
      'Content-Type': 'application/json',
    }
    let accessToken = get(store.getState(), 'auth.accessToken', '')

    const headers = accessToken ? Object.assign(defaultHeader, {
      'Authorization': `Bearer ${accessToken}`
    }) : defaultHeader

    return headers

  }
}

export class HttpService {

  static getWithTimeout(url, options) {
    console.log('getWithTimeout');
    return timeoutPromise(HttpService.get(url, options))
  }

  static get(url, options) {
    const headers = Object.assign(HeaderRequestService.setHeaderRequest(), (options || {}).headers || {});
    return fetch(url, {
      headers: headers,
    }).then((response) => response.json())
      .catch(error => {
        return {statusCode: 404, message: error.message}
      });
  }

  static postWithTimeout(url, data, options) {
    console.log('postWithTimeout');
    return timeoutPromise(HttpService.post(url, data, options))
  }

  static post(url, data, options) {
    if (typeof (data) === 'object' && data.constructor !== FormData)
      data = JSON.stringify(data)

    const headers = Object.assign(HeaderRequestService.setHeaderRequest(), (options || {}).headers || {});
    return fetch(url, {
      method: 'POST',
      headers: headers,
      body: data
    }).then((response) => response.json())
      .catch(error => {
        return {statusCode: 404, message: error.message}
      });
  }

  static deleteWithTimeout(url, data, options) {
    console.log('deleteWithTimeout');
    return timeoutPromise(HttpService.delete(url, data, options))
  }

  static delete(url, data, options) {
    const headers = Object.assign(HeaderRequestService.setHeaderRequest(), (options || {}).headers || {});
    return fetch(url, {
      method: 'DELETE',
      headers: headers,
      body: JSON.stringify(data)
    }).then((response) => response.json())
      .catch(error => {
        return {statusCode: 404, message: error.message}
      });
  }

  static putWithTimeout(url, data, options) {
    console.log('putWithTimeout');
    return timeoutPromise(HttpService.put(url, data, options))
  }

  static put(url, data, options) {
    const headers = Object.assign(HeaderRequestService.setHeaderRequest(), (options || {}).headers || {});
    return fetch(url, {
      method: 'PUT',
      headers: headers,
      body: JSON.stringify(data)
    }).then((response) => response.json())
      .catch(error => {
        return {statusCode: 404, message: error.message}
      });
  }

  static defaultHeader = {
    'Accept': 'application/json, */*',
    'Content-Type': 'application/json',
  }
}