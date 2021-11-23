<template lang="pug">
div(class="dropdown" ref="dropdown")
  header
    a(href="#" @click="toggle()")
      slot(name="header")
        w-icon(icon="chevron-down")
  div( v-if="isOpen"  @click="close()")
    slot
</template>

<script lang="ts">
// TODO : Putting @click handlers on links inside the dropdown interferes with the
// mouseup handler and prevents the @click handler to be executed. We should investigate
// why, as we for now plug handlers on mousedown event inside the dropdown, which is not intuitive.
import { defineComponent } from 'vue'
import { ref } from 'vue'

export default defineComponent({
  setup() {
    const isOpen = ref(false)
    const html = document.documentElement
    const dropdown = ref<Node | null>(null)

    function open() {
      html.addEventListener('click', onBodyClick)
      isOpen.value = true
    }

    function close() {
      html.removeEventListener('click', onBodyClick)
      isOpen.value = false
    }

    function toggle() {
      if (!isOpen.value) {
        open()
      } else {
        close()
      }
    }

    function onBodyClick(e: Event) {
      if (!!dropdown.value && !dropdown.value!.contains(e.target as Node)) {
        close()
      }
    }

    return {
      close,
      dropdown,
      isOpen,
      toggle,
    }
  },
})
</script>

<style lang="scss">
.dropdown {
  z-index: 2;
  position: relative;

  & > header {
    vertical-align: middle;
  }

  & > div {
    & > * {
      display: block;
      margin-bottom: calc(0.5 * var(--spacing));
      margin-top: calc(0.5 * var(--spacing));
    }

    & > *:first-child {
      margin-top: 0;
    }

    & > *:last-child {
      margin-bottom: 0;
    }

    flex-direction: column;
    background: var(--context);
    border-bottom-left-radius: var(--border-radius);
    border-bottom-right-radius: var(--border-radius);
    border-top: 1px solid var(--on-context);
    padding: var(--spacing);
    position: absolute;
    right: 0;

  }
}
</style>
