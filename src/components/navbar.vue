<template lang="pug">
div(class="navbar" v-bind:class="{'small': !$mq('sm'), 'primary': !secondary, 'secondary': secondary}")
  div(class="brand")
    slot(name="brand")
  div(class="menu" ref="menu")
    a(href="#" @click="toggle()")
      c-icon(icon="bars")
    div(class="links" @mouseup="close()" v-bind:class="{ 'opened': isOpen }")
      slot
  div(class="end")
    slot(name="end")
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { ref } from 'vue'
import { toRefs } from 'vue'

export default defineComponent({
  props: {
    secondary: {
      type: Boolean,
      required: false,
    },
  },
  setup(props) {
    const { secondary } = toRefs(props)
    const isOpen = ref(false)
    const html = document.documentElement
    const menu = ref<Node | null>(null)

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
      if (!menu.value!.contains(e.target as Node)) {
        close()
      }
    }

    return {
      close,
      isOpen,
      menu,
      secondary,
      toggle,
    }
  },
})
</script>

<style lang="scss">
.navbar {
  display: flex;
  align-items: stretch;
  z-index: 10;

  > div {
    align-items: center;
    display: flex;
  }

  > .brand {
    flex-grow: 0;
    margin-left: var(--spacing);
    margin-right: var(--spacing);
  }

  &.small {
    > .brand {
      flex-grow: 1;
      order: 1;
    }

    > .menu {
      flex-direction: column;
      flex-grow: 0;

      > a {
        display: inline;
      }

      > .links {
        background: var(--context);
        flex-direction: column;
        left: 0;
        display: none;
        padding: calc(0.5 * var(--spacing));
        position: absolute;
        top: 3rem;

        &.opened {
          display: flex;
        }
      }
    }

    > .end {
      order: 2;
    }
  }

  > .menu {
    display: flex;
    flex-grow: 1;

    > a {
      display: none;
    }

    > .links {
      display: flex;
    }

    & a {
      align-items: center;
      padding: var(--spacing);
      text-transform: uppercase;
      &:hover {
        background-color: var(--context-light);
        text-decoration: none;
      }

      &.router-link-active {
        background-color: var(--context-dark);
        text-transform: uppercase;
      }
    }
  }

  .end {
    flex-grow: 0;
    margin-left: var(--spacing);
    margin-right: var(--spacing);
  }
}
</style>
