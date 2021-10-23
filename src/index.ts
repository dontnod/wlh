import Vue from 'vue'
import { App } from 'vue'

import './assets/styles/_index.scss'
import './lib/ui/font-awesome'
import './ckc.d.ts'
import CApiErrors from './components/api-errors.vue'
import CApiForm from './components/api-form.vue'
import CApiInput from './components/api-input.vue'
import CButton from './components/button.vue'
import CComponent from './components/component.vue'
import CDropdown from './components/dropdown.vue'
import CDropdownMultiple from './components/dropdown-multiple.vue'
import CGroupbox from './components/groupbox.vue'
import CIcon from './components/icon.vue'
import CListbox from './components/listbox.vue'
import CInput from './components/input.vue'
import CLoadingOverlay from './components/loading-overlay.vue'
import CNavbar from './components/navbar.vue'
import CRouterLink from './components/router-link.vue'
import CScreenCenter from './components/screen-center.vue'
import CSpinner from './components/spinner.vue'
import CTextField from './components/text-field.vue'
import { MediaQueryOptions } from './lib/ui/media-query'
import { mediaQuery } from './lib/ui/media-query'

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $mq: (query: string) => boolean
  }
}

export interface CkcOptions {
  mqOptions?: MediaQueryOptions
}

export default function install<T>(app: App<T>, options?: CkcOptions) {
  app
    .component('CApiErrors', CApiErrors)
    .component('CApiForm', CApiForm)
    .component('CApiInput', CApiInput)
    .component('CButton', CButton)
    .component('CComponent', CComponent)
    .component('CDropdown', CDropdown)
    .component('CDropdownMultiple', CDropdownMultiple)
    .component('CGroupbox', CGroupbox)
    .component('CIcon', CIcon)
    .component('CInput', CInput)
    .component('CListbox', CListbox)
    .component('CLoadingOverlay', CLoadingOverlay)
    .component('CNavbar', CNavbar)
    .component('CRouterLink', CRouterLink)
    .component('CScreenCenter', CScreenCenter)
    .component('CSpinner', CSpinner)
    .component('CTextField', CTextField)

  app.config.globalProperties.$mq = mediaQuery(options?.mqOptions)
}

export {
  Api,
  ObjectResource,
  Resource,
  fieldRef,
  getApi,
  childResource,
  getCurrentResource, 
  loadingGuardRef,
  loadingRef,
  resourceRef,
} from './lib/api'
export { getService } from './lib/common/service-manager'
