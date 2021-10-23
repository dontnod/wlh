/**
 * Layer on top of axios to request the REST Api.
 * This includes a resource caching, allowing to provide uniques JS resource objects for each endpoint of the Api,
 * and global error handling.
 */
import axios from 'axios'
import { AxiosInstance, Method } from 'axios'
import { InjectionKey } from 'vue'
import { Resource } from './resource'
import { Signal } from '../common/signal'
import { getService } from '../common/service-manager'

const _AUTH_TOKEN_STORAGE_KEY = 'wlh_auth_token'
const _AUTHORIZATION_HEADER_KEY = 'Authorization'

/**
 * Handler called when an error occurs during a request to the API.
 * @param status The HTML status code of the request that failed.
 * @param message String describing the error that occured.
 */
export type ApiErrorHandler = (status: number, message: string) => void


/**
 * Api data for an object, with fields and fields values.
 */
export type ApiObjectData = Record<string, any>

/**
 * Data for an array.
 */
export type ApiArrayData = any[]

/**
 * Type describing json data returned by a query to the API
 */
export type ApiData = ApiObjectData | ApiArrayData | undefined

/**
 * Api response aggregating the eventually returned data, and an error code.
 */
export interface ApiResponse {
  status: number
  data: ApiData | undefined
}

/**
 * Constructor type usable to create a new resource object.
 */
export type ResourceConstructor<TResource extends Resource> = { new(url: string, api: Api) : TResource }

/**
 * Api class, interfacing Axios and adding authentication, error handling and caching features.
 */
export class Api {
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

  /**
   * Get, or creates if it doesn't exists already, the resource of the given type, encapsulating the given endpoint.
   * Subsequent calls to this function with the same url will return the same JS object.
   * @param constructor Constructor to use if the resource isn't already created.
   * @param url The API endpoint the requested resource encapsulates.
   * @returns Created or existing resource object.
   */
  get<TResource extends Resource>(
    constructor: ResourceConstructor<TResource>,
    url: string
    ) : TResource {
    let resource = null
    if(url in this._resources) {
      let resourceRef = this._resources[url]
      resource = resourceRef.deref()
      if(resource) {
        return resource as TResource
      }
    }

    resource = new constructor(url, this) as TResource
    this._resources[url] = new WeakRef(resource)
    return resource
  }

  /**
   * Query the api.
   * @param url The url to query.
   * @param method HTTP method (GET, POST, PATCH...)
   * @param data The data to send along with the request, or in the URL in the case of the GET method
   * @returns Status & data returned by the query
   */
  async query(url: string, method: Method, data: any) : Promise<ApiResponse> {
    let response = await this._instance.request<ApiData>({
      data: data,
      method: method,
      url: url,
      baseURL: '/api',
      validateStatus () { return true },
      withCredentials: true,
      xsrfCookieName: 'csrf_access_token',
      xsrfHeaderName: 'X-CSRF-TOKEN',
    })

    if(response.status >= 400) {
      this._onError.raise(response.status, response.statusText)
      return {
        status: response.status,
        data: undefined
      }
    }
  
    return {
      status: response.status,
      data: response.data
    }
  }
  
  /**
   * Set the JWT token used for all queries, and stores it in local storage.
   * @param token The JWT token
   */
  setToken(token: string) {
    localStorage.setItem(_AUTH_TOKEN_STORAGE_KEY, token)
    this._refreshAuthHeaders()
  }

  /**
   * Clears the JWT token previously set through setToken.
   */
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

  private readonly _instance: AxiosInstance
  private readonly _onError = new Signal<ApiErrorHandler>()
  private readonly _resources: Record<string, WeakRef<Resource>> = {}
}

const ApiKey : InjectionKey<Api> = Symbol()

/**
 * Get the Api object.
 * @returns The Api.
 */
export function getApi() {
  return getService(ApiKey, Api)
}
