import { Resource } from './resource'

export interface IResourceObject {
  load() : Promise<void>
  save(fields: string[] | undefined) : Promise<void>
  delete() : Promise<void>
}
export class ResourceObject<TObject> extends Resource implements IResourceObject {
  state: TObject | undefined = undefined;

  async load(force: boolean = false) {
    if(!force && this.state != undefined) {
      return
    }

    this.state = await this._get<TObject>()
  }

  async save(fields: string[] | undefined = undefined) {
    if(this.state == undefined) {
      return
    }

    let data: Record<string, any> = {}
    let state = this.state as Record<string, any>

    if(fields != undefined) {
      for(let field of fields) {
        if(field in state) {
          data[field] = state[field]
        }
      }
    }
    else {
      data = state
    }

    await this._patch<void, Record<string, any>>(data)
  }

  async delete() {
    await this._delete()
  }
}
