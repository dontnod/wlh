/**
 * Helpers to declare reactive variables and use model data in vue components.
 */
import { ObjectResource } from './object-resource'
import { Resource } from './resource'
import { ref, Ref, onMounted } from 'vue'

/**
 * Create a ref that will be set to the resource retrieved by the given promise when the component is mounted.
 * @param resource The resource promise returned either by api.get, or a child field of another resource
 * @returns A ref to the loaded resource, usable in vue templates
 */
export function resourceRef<TResource extends Resource>(resource: Promise<TResource>) : Ref<TResource> {
  const reference = ref<TResource | undefined >(undefined) as Ref<TResource>

  onMounted(async () => {
    reference.value = await resource
  })

  return reference
}

/**
 * Create a ref on a ObjectResource's field.
 * The field value will be loaded and set when the component is mounted, and will be updated
 * anytime the given ObjectResource is modified.
 * @param object The field's owner
 * @param getter Getter to retrieve the value of the field
 * @returns A ref to the field value
 */
export function fieldRef<TObject extends ObjectResource, TField>(object: Promise<TObject>, getter: (obj: TObject) => Promise<TField>) : Ref<TField> {
  const reference = ref<TField | undefined >(undefined) as Ref<TField>

  onMounted(async () => {
    const resource = await object
    reference.value = await getter(resource)
    resource.onChanged.attach(() => {
      getter(resource).then(value => reference.value = value)
    })
  })

  return reference
}

/**
 * Create a ref on a boolean usable to feedback the loading state of an Api resource.
 * @param resource The resource that will be loaded when the component is mounted
 * @returns 
 */
export function loadingRef<TResource extends Resource>(resource: Promise<TResource>) : Ref<boolean> {
  let reference = ref(true)
  onMounted(async () => {
    await resource
    reference.value = false
  })
  return reference
}

/**
 * Frames the given method with a boolean ref indicating the operation is currently running.
 * @param method The method to frame with a loading status boolean
 * @returns loading : A boolean ref indicating the method is currently running
 *          method: The method to call to update the boolean ref, call the given method.
 */
export function loadingGuardRef(method: () => Promise<any>) : { loading: Ref<boolean>, method: () => Promise<any> } {
  const loading = ref(false)
  const loadMethod = async () => {
    loading.value = true
    const result = await method()
    loading.value = false
    return result
  }
  return { loading, method: loadMethod }
}
