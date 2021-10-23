import { InjectionKey } from 'vue'
import { Resource } from '../api/resource'
import { inject } from 'vue'
import { provide } from 'vue'
import { ResourceHandle } from '.'

const CurrentResourceKey: InjectionKey<ResourceHandle<Resource>> = Symbol()

export function setCurrentResource(resource: ResourceHandle<Resource>) {
  provide(CurrentResourceKey, resource)
}

export function getCurrentResource() : ResourceHandle<Resource> {
    let resource = inject(CurrentResourceKey)
    if(!resource) {
      throw new Error("No resource provided.")
    }
    return resource
}
