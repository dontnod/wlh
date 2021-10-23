/**
 * ResourceObject encapsulate an object API endpoint.
 * The endpoint should allow get method, returning it's properties, and patch method, allowing
 * to modify the object.
 */
import { Api, ApiObjectData, ResourceConstructor } from './api'
import { Resource } from './resource'

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
    this.onChanged.raise(this)
  }

  getNested<TNested extends Resource>(constructor: ResourceConstructor<TNested>, fieldName: string) {
    const url = this.get<string>(fieldName)
    if(!url) {
      return undefined
    }
    return this.api.get<TNested>(constructor, url)
  }

  async _load() {
    let data = await this._get() as ApiObjectData | undefined
    if(data === undefined) {
      data = {}
      return false
    }

    this._data = data
    await this.onChanged.raise(this)
    return true
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
    await this.load(true)
  }

  async delete() {
    await this._delete()
  }

  private _data: Record<string, any> = {}
}
