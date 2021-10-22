import { Api, ApiData, ApiResponse } from './api'
import { Method } from 'axios'
import { Signal } from '../common/signal'

export type ResourceErrorHandler = (message: string, field: string | undefined) => void

export abstract class Resource {
  constructor(url: string, api: Api) {
    this._url = url
    this._api = api
    this._loadTask = this._load()
  }

  public get onError() { return this._onError }

  protected get api() { return this._api }

  async load(forceReload: boolean = false) : Promise<void> {
    if(forceReload) {
      this._loadTask = this._load()
    }
    await this._loadTask // Allows to call only once the _load method, except if forceReload is set to true.
  }

  protected abstract _load() : Promise<void>;

  protected async _get() : Promise<ApiData> {
    return await this._query('GET')
  }

  protected async _patch<TData>(data: TData) : Promise<ApiData> {
    return await this._query('PATCH', data)
  }

  protected async _post<TData>(data: TData) : Promise<ApiData> {
    return await this._query('POST', data)
  }

  protected async _delete() : Promise<void> {
    await this._query('DELETE')
  }

  protected async _query<TData>(method: Method, queryData: TData | undefined = undefined) : Promise<ApiData | undefined> {
    let { status, data } = await this._api.query(this._url, method, queryData)

    if(status >= 400) {
      let errors = data as Record<string, string | string[]>
      for(let key in errors) {
        let errorData = errors[key]
        if(key == 'detail') {
          this._onError.raise(errorData as string, undefined)
        }
        else {
          for(const message of errorData) {
            this._onError.raise(message, key)
          }
        }
      }

      return undefined
    }

    console.assert(data != undefined)
    return data
  }

  private readonly _api: Api
  private readonly _onError = new Signal<ResourceErrorHandler>()
  private readonly _url: string
  private _loadTask: Promise<void>
}
