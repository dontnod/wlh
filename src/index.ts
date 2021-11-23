import { App } from 'vue'

import './assets/styles/_index.scss'
import './lib/font-awesome'
import CApiErrors from './components/api-errors.vue'
import CApiForm from './components/api-form.vue'
import CApiInput from './components/api-input.vue'
import CButton from './components/button.vue'
import CComponent from './components/component.vue'
import CDropdown from './components/dropdown.vue'
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
import CChips from './components/chips.vue'
import CAutocomplete from './components/autocomplete.vue'
import CModal from './components/modal.vue'
import { MediaQueryOptions } from './lib/media-query'

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
    .component('CChips', CChips)
    .component('CAutocomplete', CAutocomplete)
    .component('CModal', CModal)
}

export { useService } from './lib/service-manager'
