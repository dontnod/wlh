/**
 * ResourceObject encapsulate an object API endpoint.
 * The endpoint should allow get method, returning it's properties, and patch method, allowing
 * to modify the object.
 */
import { Api, ApiData, ApiObjectData } from './api'
import { Resource } from './resource'
import { ResourceConstructor } from './api'
import { Signal } from '../common/signal'

export type FieldChangedHandler = (object: Resource, field: string, oldValue: any, newValue: any) => void

export class ObjectResource extends Resource {
  constructor(url: string, api: Api) {
    super(url, api)
  }

  get<T>(fieldName: string) {
    return this._data[fieldName]
  }

  set<T>(fieldName: string, newValue: T) {
    const oldValue = this._data[fieldName]

    if(oldValue == newValue) {
      return
    }

    this._data[fieldName] = newValue
    this._onFieldChanged.raise(this, fieldName, oldValue, newValue)
  }

  async getChild<T extends Resource>(constructor: ResourceConstructor<T>, fieldName: string) {
    const url = this.get<string>(fieldName)
    return this.api.get<T>(constructor, url)
  }

  async load() {
    const data = await this._get() as ApiObjectData | undefined
    if(data === undefined) {
      return
    }

    for(const fieldName in data) {
      this.set(fieldName, data[fieldName])
    }

    for(const oldFieldName in this._data) {
      if(!(oldFieldName in data)) {
        this.set(oldFieldName, undefined)
      }
    }
  }

  async save(fields: string[] | undefined = undefined) {
    const dataToSave : Record<string, any> = {}
    const data = await this._data

    if(fields != undefined) {
      for(let field of fields) {
        if(field in data) {
          dataToSave[field] = data[field]
        }
      }
    }
    else {
      Object.assign(dataToSave, data)
    }

    await this._patch(dataToSave)
    await this.load()
  }

  async delete() {
    await this._delete()
  }

  private readonly _data: Record<string, any> = {}
  private _onFieldChanged = new Signal<FieldChangedHandler>()
}
