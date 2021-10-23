/**
 * Handle to an API Resource usable in vue Components
 */
import { Resource, ChangedHandler } from './resource'
import { Signal } from '../common/signal'
import { ref, Ref, onMounted, watch, computed } from 'vue'
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
   * Ref telling if the proxied resource is currently loading.
   */
  get loading() { return this._loading }

  /* Ref telling if the proxied ressource was successfuly loaded. */
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

    const refreshValue = () => {
      if(this._resource) {
        reference.value = getter(this._resource)
      }
      else {
        reference.value = undefined
      }
    }

    const loaded = () => {
      this._onChanged.attach(refreshValue)
      refreshValue()
    }

    const unloading = () => {
      this._onChanged.detach(refreshValue)
      refreshValue()
    }


    this._loaded.attach(loaded)
    this._unloading.attach(unloading)

    if(setter != undefined) {
      watch(reference, () => {
        if(reference.value && this._resource) {
          setter(this._resource, reference.value)
        }
      })
    }

    return reference
  }

  /**
   * Create a ResourceHandle to a nested resource
   * @param getter The nested resource's getter method
   * @returns A ResourceHandle on the nested resource.
   */
  nested<TNested extends Resource>(getter: NestedGetter<TResource, TNested>): ResourceHandle<TNested> {
    const getNested = async () => {
      const resource = this._resource
      if(resource === undefined) {
        return undefined
      }

      const nested = getter(resource)
      return await nested
    }

    const handle = new ResourceHandle(getNested)

    const refreshNested = () => handle._load()
    this._onChanged.attach(refreshNested)
    this._loaded.attach(refreshNested)
    this._unloading.attach(refreshNested)
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
      const resource = this._resource
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
      await this._load()
    })
  }

  private async _load() {
    const oldResource = this._resource
    this._loading.value = true
    const newResource = await this._resourceFactory()
    this._loading.value = false

    if(oldResource == newResource) {
      return
    }

    if(oldResource != undefined) {
      console.assert(newResource === undefined)
      oldResource.onChanged.detach(this._onResourceChanged)
      this._unloading.raise()
    }
    
    this._resource = newResource

    if(newResource != undefined) {
      console.assert(oldResource === undefined)
      newResource.onChanged.attach(this._onResourceChanged)
      this._loaded.raise()
    }

    this._available.value = !!this._resource
  }

  private _onResourceChanged = (resource: Resource) => this._onChanged.raise(resource)

  private readonly _resourceFactory: () => Promise<TResource | undefined>
  private readonly _available: Ref<boolean> = ref(false)
  private readonly _loading: Ref<boolean> = ref(true)
  private readonly _onChanged = new Signal<ChangedHandler>()
  private readonly _loaded = new Signal()
  private readonly _unloading = new Signal()
  private _resource: TResource | undefined = undefined
}
