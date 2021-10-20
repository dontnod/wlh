import { Backend } from './backend'
import { Method } from 'axios'

type ApiResponse<TResponse> = TResponse | Record<string, string>

export abstract class Resource {
  constructor(url: string, backend: Backend) {
    this._url = url
    this._backend = backend
  }

  get error() { return this._error }
  get fieldsErrors() { return this._fieldsErrors }
  get loading() { return this._loading }

  protected get backend() { return this._backend }

  resetErrors() {
    this._error = ""
    this._fieldsErrors = {}
  }

  protected async _get<TResponse>() : Promise<TResponse | undefined> {
    return await this._query<TResponse, void>('GET', undefined)
  }

  protected async _patch<TResponse, TData>(data: TData) : Promise<TResponse | undefined> {
    return await this._query<TResponse, TData>('PATCH', data)
  }

  protected async _post<TResponse, TData>(data: TData) : Promise<TResponse | undefined> {
    return await this._query<TResponse, TData>('POST', data)
  }

  protected async _delete() : Promise<void> {
    await this._query<void, void>('GET', undefined)
  }

  private async _query<TResponse, TData>(method: Method, data: TData) {
    this._loading = true
    let response = await this._backend.query<ApiResponse<TResponse>>(this._url, method, data)
    this._loading = false

    if(!response) {
      return undefined
    }

    this.resetErrors()

    if(response.status < 400) {
      return response.data as TResponse
    }

    let errors = response.data as Record<string, string | string[]>
    for(let key in errors) {
      let message = errors[key]
      if(key == 'detail') {
        this._error = message as string
      }
      else {
        this._fieldsErrors[key] = message as string[]
      }
    }
  }

  private _backend: Backend
  private _error: string | undefined
  private _fieldsErrors: Record<string, string[]> = {}
  private _loading: boolean = false;
  private _url: string
}
