import axios from 'axios'
import { App } from 'vue'
import { AxiosInstance } from 'axios'
import { InjectionKey } from 'vue'
import { Method } from 'axios'

import { getService } from './service-manager'

const _AUTH_TOKEN_STORAGE_KEY = 'ciu_auth_token'
const _AUTHORIZATION_HEADER_KEY = 'Authorization'

export class Backend {
  constructor() {
    this._instance = axios.create({
      baseURL: '/api',
      validateStatus () { return true },
      withCredentials: true,
      xsrfCookieName: 'csrf_access_token',
      xsrfHeaderName: 'X-CSRF-TOKEN',
    })
    this._refreshAuthHeaders()
  }

  async query<TResponse>(url: string, method: Method, data: any) {
    let response = await this._instance.request<TResponse>({
      data: data,
      method: method,
      url: url,
      baseURL: '/api',
      validateStatus () { return true },
      withCredentials: true,
      xsrfCookieName: 'csrf_access_token',
      xsrfHeaderName: 'X-CSRF-TOKEN',
    })

    if(response.status >= 500) {
      // TODO : Global error handling.
      return undefined
    }
  
    return response
  }
  
  setToken(token: string) {
    localStorage.setItem(_AUTH_TOKEN_STORAGE_KEY, token)
    this._refreshAuthHeaders()
  }

  clearToken() {
    localStorage.removeItem(_AUTH_TOKEN_STORAGE_KEY)
    this._refreshAuthHeaders()
  }

  private _refreshAuthHeaders() {
    let token = localStorage.getItem(_AUTH_TOKEN_STORAGE_KEY)
    let defaultHeaders = this._instance.defaults.headers

    if(token) {
      defaultHeaders[_AUTHORIZATION_HEADER_KEY] = "Bearer " + token
    }
    else if(_AUTHORIZATION_HEADER_KEY in defaultHeaders) {
      delete defaultHeaders[_AUTHORIZATION_HEADER_KEY]
    }
  }

  private _instance: AxiosInstance
}

const BackendKey : InjectionKey<Backend> = Symbol()

export function getBackend() {
  return getService(BackendKey, Backend)
}
