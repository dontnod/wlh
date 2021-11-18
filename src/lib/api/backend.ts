import axios, { AxiosRequestConfig } from 'axios'
import { AxiosInstance, Method } from 'axios'
import { InjectionKey } from 'vue'
import { Resource } from './resource'

import { getService } from '../common/service-manager'

const _AUTH_TOKEN_STORAGE_KEY = 'wlh_auth_token'
const _AUTHORIZATION_HEADER_KEY = 'Authorization'

type ResourceConstructor<TResource extends Resource> = {
  new (url: string, backend: Backend): TResource
}

export class Backend {
  constructor() {
    this._instance = axios.create({
      baseURL: '/api',
      validateStatus() {
        return true
      },
      withCredentials: true,
      xsrfCookieName: 'csrf_access_token',
      xsrfHeaderName: 'X-CSRF-TOKEN',
    })
    this._refreshAuthHeaders()
  }

  get<TResource extends Resource>(
    constructor: ResourceConstructor<TResource>,
    url: string
  ): TResource {
    if (url in this._resources) {
      let resourceRef = this._resources[url]
      let resource = resourceRef.deref()
      if (resource) {
        return resource as TResource
      }
    }

    let resource = new constructor(url, this) as TResource
    this._resources[url] = new WeakRef(resource)
    return resource
  }

  async query<TResponse>(url: string, method: Method, data: any) {
    const config: AxiosRequestConfig = {
      method: method,
      url: url,
      baseURL: '/api',
      validateStatus() {
        return true
      },
      withCredentials: true,
      xsrfCookieName: 'csrf_access_token',
      xsrfHeaderName: 'X-CSRF-TOKEN',
    }

    if (method == 'GET') {
      config.params = data
    } else {
      config.data = data
    }

    let response = await this._instance.request<TResponse>(config)
    if (response.status >= 500) {
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

    if (token) {
      defaultHeaders[_AUTHORIZATION_HEADER_KEY] = 'Bearer ' + token
    } else if (_AUTHORIZATION_HEADER_KEY in defaultHeaders) {
      delete defaultHeaders[_AUTHORIZATION_HEADER_KEY]
    }
  }

  private _instance: AxiosInstance
  private _resources: Record<string, WeakRef<Resource>> = {}
}

const BackendKey: InjectionKey<Backend> = Symbol()

export function getBackend() {
  return getService(BackendKey, Backend)
}

export function getResource<TResource extends Resource>(
  constructor: ResourceConstructor<TResource>,
  url: string
) {
  const backend = getService(BackendKey, Backend)
  return backend.get(constructor, url)
}
