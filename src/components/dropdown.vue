<template lang="pug">
div(class="dropdown" ref="dropdown")
  header
    a(href="#" @click="toggle()")
      slot(name="header")
        c-icon(icon="chevron-down")
  div( v-if="isOpen"  @mouseup="close()")
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

<style scoped lang="scss">
.dropdown {
  position: relative;

  & > header {
    vertical-align: middle;
  }

  & > div {
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
