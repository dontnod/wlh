import { App } from 'vue'
import { InjectionKey } from 'vue'
import { inject } from 'vue'
import { reactive } from 'vue'

type ServiceConstructor<TService extends Object> = { new() : TService }

class ServiceManager {

  get<TService extends Object>(key: InjectionKey<TService>, constructor: ServiceConstructor<TService>) : TService {
    // Typescript has a weird stuff going around symbols as indexers, so the workarounds
    if((key as symbol) in this._services) {
      let service = this._services[key as any]
      return service as TService
    }

    let service = new constructor() as TService
    this._services[key as any] = service
    return service
  }

  private _services: Record<any, Object> = {}
}

const ServiceManagerInstance = new ServiceManager()


export function useService<TService extends Object>(key: InjectionKey<TService>, constructor: ServiceConstructor<TService>) {
  return ServiceManagerInstance.get(key, constructor)
}
