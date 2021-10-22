import { InjectionKey } from 'vue'
import { Resource } from '../api/resource'
import { inject } from 'vue'
import { provide } from 'vue'

const CurrentResourceKey: InjectionKey<Promise<Resource>> = Symbol()

export function setCurrentResource(resource: Promise<Resource>) {
  provide(CurrentResourceKey, resource)
}

export function getCurrentResource() : Promise<Resource> {
    let resource = inject(CurrentResourceKey)
    if(!resource) {
      throw new Error("No resource provided.")
    }
    return resource
}
