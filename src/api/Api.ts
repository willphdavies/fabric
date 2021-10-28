import axios, { AxiosResponse } from 'axios';
import { merge } from 'lodash';
const api = axios.create({});
class ApiInstance {
  apiInstance = api;

  get(url: string, opts: any, returnResponse = false): Promise<any> {
    let headers = {
      Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
    };
    const extendedOpts = { headers, ...opts };
    
    return new Promise((resolve, reject) => {
      api
        .get(url, extendedOpts)
        .then((response: AxiosResponse) => {
          resolve(returnResponse ? response : response.data);
        })
        .catch(reject);
    });
  }
  post(
    url: string,
    params: any = {},
    opts: any = {},
    stringify: boolean = true,
  ): Promise<any> {
    const body = stringify ? stringifyParams(params) : params;
    let headers = {
      'Content-Type': 'application/json',
    };
    return new Promise((resolve, reject) => {
      api
        .post(
          url,
          body,
          merge(
            {
              headers,
            },
            opts,
          ),
        )
        .then((response: AxiosResponse) => resolve(response.data))
        .catch(reject);
    });
  }
}
function stringifyParams(params: any) {
  if (Array.isArray(params) || typeof params === 'string') {
    return JSON.stringify(params);
  } else {
    return JSON.stringify({ ...params });
  }
}

export default new ApiInstance();
