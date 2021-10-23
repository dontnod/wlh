/**
 * Handle to an API Resource usable in vue Components
 */
import { Resource } from './resource'
import { ref, Ref, onMounted, watch } from 'vue'
import { getApi, ResourceConstructor } from './api'

type FieldGetter<TResource extends Resource, TField> = (owner: TResource) => TField
type FieldSetter<TResource extends Resource, TField> = (owner: TResource, value: TField) => void
type NestedGetter<TResource extends Resource, TNested extends Resource> = (owner: TResource) => Promise<TNested | undefined>

/**
 * A handle to a not-already loaded API resource.
 * This class is meant to be used in VueJS component's setup function, when the resource isn't already loaded.
 * It allows to easily declare reactive references to resource fields, nested resource, and to ease manipulation
 * of API resources in an UI context.
 */
export class ResourceHandle<TResource extends Resource> {
  /**
   * Create a ResourceHandle proxying a resource of the given type, pointing at the given endpoint.
   * The resource will be created by injecting the Api object and calling get on it, so this method
   * shoud only be called in components setup() function.
   * @param constructor The resource constructor
   * @param url Url of the resource
   * @returns A ResourceHandle encapsulating the wanted resource
   */
  static get<TResource extends Resource>(constructor: ResourceConstructor<TResource>, url: string) {
    const api = getApi()
    const resource = api.get(constructor, url)
    return new ResourceHandle(resource)
  }

  /**
   * Create a ref to a boolean indicating the loading status of the proxied resource.
   * @returns A ref to a boolean that'll be true until the proxied resource is loaded 
   */
  loading() : Ref<boolean> {
    let reference = ref(true)
    onMounted(async () => {
      await this._resource
      reference.value = false
    })
    return reference
  }

  /**
   * Create a ref to a boolean indicating the resource was successfully loaded.
   * @returns The created ref
   */
  available(): Ref<boolean> {
    let reference = ref(false)
    onMounted(async () => {
      const resource = await this._resource
      reference.value = !!resource
    })
    return reference
  }

  /**
   * Create a ref that will be synchronized with a field of a resource
   * @param getter The field getter
   * @param setter The field setter. If undefined, the field will not be updated when the UI updates the returned ref
   * @returns A ref that will be synchronized with the proxied Resource field
   */
  field<TField>(
    getter: FieldGetter<TResource, TField>,
    setter: FieldSetter<TResource, TField> | undefined = undefined
    ) : Ref<TField | undefined> {
    const reference = ref(undefined) as Ref<TField | undefined>

    onMounted(async () => {
      const resource = await this.resource
      if(!resource) {
        return
      }

      reference.value = getter(resource)
      resource.onChanged.attach(() => {
        reference.value = getter(resource)
      })

      if(setter != undefined) {
        watch(reference, () => {
          if(reference.value) {
            setter(resource, reference.value)
          }
        })
      }
    })

    return reference
  }

  /**
   * Create a ResourceHandle to a nested resource
   * @param getter The nested resource's getter method
   * @returns A ResourceHandle on the nested resource.
   */
  nested<TNested extends Resource>(getter: NestedGetter<TResource, TNested>): ResourceHandle<TNested> {
    const getNested = async () => {
      const resource = await this._resource
      if(resource === undefined) {
        return undefined
      }

      const nested = getter(resource)
      return await nested
    }

    return new ResourceHandle(getNested())
  }

  /**
   * Create a method performing an operation on the proxied resource, and a ref to a boolean telling if the operation is running
   * @param method The operation to perform when calling the returned method
   * @returns A tuple [ref to a boolean telling if the operation is running, method to call to perform the operation]
   */
  do<TReturn>(method: (resource: TResource) => Promise<TReturn>) : [ Ref<boolean>, () => Promise<TReturn | undefined> ] {
    const loading = ref(false)
    const loadMethod = async () => {
      const resource = await this._resource
      if(resource === undefined) {
        return
      }

      loading.value = true
      const result = await method(resource)
      loading.value = false

      return result
    }
    return [ loading, loadMethod ]
  }

  protected get resource() { return this._resource }

  private constructor(resource: Promise<TResource | undefined>) {
    this._resource = resource
  }

  private readonly _resource: Promise<TResource | undefined>
}
