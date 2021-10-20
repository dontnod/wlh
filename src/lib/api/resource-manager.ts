import { App } from 'vue'
import { Backend } from './backend'
import { InjectionKey } from 'vue'
import { getService } from './service-manager'
import { Resource } from './resource'
import { getBackend } from './backend'
import { reactive } from 'vue'

type ResourceConstructor<TResource extends Resource> = { new(url: string, backend: Backend) : TResource }

class ResourceManager {
  constructor() {
    this._backend = getBackend()
  }

  get<TResource extends Resource>(constructor: ResourceConstructor<TResource>, url: string) : TResource {
    if(url in this._resources) {
      let resourceRef = this._resources[url]
      let resource = resourceRef.deref()
      if(resource) {
        return resource as TResource
      }
    }

    let resource = reactive(new constructor(url, this._backend)) as TResource
    this._resources[url] = new WeakRef(resource)
    return resource
  }

  private _resources: Record<string, WeakRef<Resource>> = {}
  private _backend: Backend
}

const ResourceManagerKey : InjectionKey<ResourceManager> = Symbol()

export function getResource<TResource extends Resource>(constructor: ResourceConstructor<TResource>, url: string) {
  const manager = getService(ResourceManagerKey, ResourceManager)
  return manager.get(constructor, url)
}
