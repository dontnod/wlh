import { App } from 'vue'

import './assets/styles/_index.scss'
import './lib/font-awesome'
import WApiErrors from './components/w-api-errors.vue'
import WApiForm from './components/w-api-form.vue'
import WApiInput from './components/w-api-input.vue'
import WAutocomplete from './components/w-autocomplete.vue'
import WButton from './components/w-button.vue'
import WChips from './components/w-chips.vue'
import WComponent from './components/w-component.vue'
import WDropdown from './components/w-dropdown.vue'
import WGroupbox from './components/w-groupbox.vue'
import WIcon from './components/w-icon.vue'
import WInput from './components/w-input.vue'
import WListbox from './components/w-listbox.vue'
import WLoadingOverlay from './components/w-loading-overlay.vue'
import WModal from './components/w-modal.vue'
import WNavbar from './components/w-navbar.vue'
import WRouterLink from './components/w-router-link.vue'
import WScreenCenter from './components/w-screen-center.vue'
import WSpinner from './components/w-spinner.vue'
import WTextField from './components/w-text-field.vue'
import { MediaQueryOptions } from './lib/media-query'

export interface WkcOptions {
  mqOptions?: MediaQueryOptions
}

export default function install<T>(app: App<T>, options?: WkcOptions) {
  app
    .component('WApiErrors', WApiErrors)
    .component('WApiForm', WApiForm)
    .component('WApiInput', WApiInput)
    .component('WAutocomplete', WAutocomplete)
    .component('WButton', WButton)
    .component('WChips', WChips)
    .component('WComponent', WComponent)
    .component('WDropdown', WDropdown)
    .component('WGroupBox', WGroupbox)
    .component('WIcon', WIcon)
    .component('WInput', WInput)
    .component('WListbox', WListbox)
    .component('WLoadingOverlay', WLoadingOverlay)
    .component('WModal', WModal)
    .component('WNavbar', WNavbar)
    .component('WRouterLink', WRouterLink)
    .component('WScreenCenter', WScreenCenter)
    .component('WSpinner', WSpinner)
    .component('WTextField', WTextField)
}

export { useService } from './lib/service-manager'
