<template lang="pug">
div(class="dropdown" ref="dropdown")
  header
    a(href="#" @click="toggle()")
      slot(name="header")
  div(v-show="isOpen")
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
    const dropdown = ref<Node | null>(null)

    function open() {
      isOpen.value = true
    }

    function close() {
      isOpen.value = false
    }

    function toggle() {
      if (!isOpen.value) {
        open()
      } else {
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
  width: max-content;

  > .header {
    position: relative;
    vertical-align: middle;
  }

  > div {
    background: var(--surface);
    border-bottom-left-radius: var(--border-radius);
    border-bottom-right-radius: var(--border-radius);
    border-top: 1px solid var(--on-context);
    padding: var(--spacing);
    position: absolute;
    top: inherit;
    right: inherit;
    height: 50%;
    width: max-content;
    overflow: auto;
  }
}
</style>
