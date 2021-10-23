/**
 * Handle to an API Resource usable in vue Components
 */
import { Resource, ChangedHandler } from './resource'
import { Signal } from '../common/signal'
import { ref, Ref, onMounted, watch } from 'vue'
import { getApi, ResourceConstructor } from './api'
import { Api } from '.'

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
    return new ResourceHandle(() => api.get(constructor, url))
  }

  /**
   * Create a ref to a boolean indicating the loading status of the proxied resource.
   * @returns A ref to a boolean that'll be true until the proxied resource is loaded 
   */
  get loading() { return this._loading }

  get available() { return this._available}

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
      const resource = this._resource.value
      if(!resource) {
        return
      }

      reference.value = getter(resource)
      const refresh = () => reference.value = getter(resource)

      resource.onChanged.attach(refresh)

      watch(this._resource, (value, oldValue) => {
        if(oldValue != undefined) {
          oldValue.onChanged.detach(refresh)
        }

        if(value != undefined) {
          value.onChanged.attach(refresh)
        }

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
      const resource = this._resource.value
      if(resource === undefined) {
        return undefined
      }

      const nested = getter(resource)
      return await nested
    }

    const handle = new ResourceHandle(getNested)
    this._onChange.attach(() => handle._refresh())
    return handle
  }

  /**
   * Create a method performing an operation on the proxied resource, and a ref to a boolean telling if the operation is running
   * @param method The operation to perform when calling the returned method
   * @returns A tuple [ref to a boolean telling if the operation is running, method to call to perform the operation]
   */
  do<TReturn>(method: (resource: TResource) => Promise<TReturn>) : [ Ref<boolean>, () => Promise<TReturn | undefined> ] {
    const loading = ref(false)
    const loadMethod = async () => {
      const resource = this._resource.value
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

  private constructor(resourceFactory: () => Promise<TResource | undefined>) {
    this._resourceFactory = resourceFactory
    onMounted(async () => {
      await this._refresh()
    })
  }

  private async _refresh() {
    let resource = this._resource.value
    if(resource != null) {
      resource.onChanged.detach((resource) => this._onResourceChange(resource))
    }

    this._loading.value = true
    this._resource.value = await this._resourceFactory()
    this._loading.value = false
    this._available.value = !!this._resource.value

    resource = this._resource.value
    if(resource != null) {
      resource.onChanged.attach((resource) => this._onResourceChange(resource))
    }
  }

  private _onResourceChange(resource: Resource) {
    this._onChange.raise(resource)
  }

  private readonly _resourceFactory: () => Promise<TResource | undefined>
  private _resource: Ref<TResource | undefined> = ref(undefined)
  private _loading: Ref<boolean> = ref(true)
  private _available: Ref<boolean> = ref(false)
  private readonly _onChange = new Signal<ChangedHandler>()
}
