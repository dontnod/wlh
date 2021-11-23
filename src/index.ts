import { App } from 'vue'

import './assets/styles/_index.scss'
import './lib/font-awesome'
import WApiErrors from './components/w-api-errors.vue'
import WApiForm from './components/w-api-form.vue'
import WApiInput from './components/w-api-input.vue'
import WButton from './components/w-button.vue'
import WComponent from './components/w-component.vue'
import WDropdown from './components/w/dropdown.vue'
import WGroupbox from './components/w-groupbox.vue'
import WIcon from './components/w-icon.vue'
import WListbox from './components/w-listbox.vue'
import WInput from './components/w-input.vue'
import WLoadingOverlay from './components/w-loading-overlay.vue'
import WNavbar from './components/w-navbar.vue'
import WRouterLink from './components/w-router-link.vue'
import WScreenCenter from './components/w-screen-center.vue'
import WSpinner from './components/w-spinner.vue'
import WTextField from './components/w-text-field.vue'
import WChips from './components/w-chips.vue'
import WAutocomplete from './components/w-autocomplete.vue'
import WModal from './components/w-modal.vue'
import { MediaQueryOptions } from './lib/media-query'

export interface WkcOptions {
  mqOptions?: MediaQueryOptions
}

export default function install<T>(app: App<T>, options?: WkcOptions) {
  app
    .component(WApiErrors)
    .component(WApiForm)
    .component(WApiInput)
    .component(WButton)
    .component(WComponent)
    .component(WDropdown)
    .component(WGroupbox)
    .component(WIcon)
    .component(WInput)
    .component(WListbox)
    .component(WLoadingOverlay)
    .component(WNavbar)
    .component(WRouterLink)
    .component(WScreenCenter)
    .component(WSpinner)
    .component(WTextField)
    .component(WChips)
    .component(WAutocomplete)
    .component(WModal)
}

export { useService } from './lib/service-manager'
