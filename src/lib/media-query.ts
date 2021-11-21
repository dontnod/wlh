import { Ref } from "@vue/reactivity"
import { ref } from "@vue/reactivity"

export interface MediaQueryOptions {
  breakpoints: Record<string, number>
}

export function mediaQuery(options?: MediaQueryOptions) : (query: string) => boolean {
  if(!options) {
    options = {
      breakpoints: {
        'sm': 576,
        'md': 768,
        'lg': 992,
        'xl': 1200,
        'xxl': 1400,
      }
    }
  }

  const queryResults: Record<string, Ref<boolean>> = {}
  const breakpoints = options?.breakpoints

  window.addEventListener('resize', () => {
    if(!breakpoints) {
      return
    }

    for(let [breakpoint, result] of Object.entries(queryResults)) {
      result.value = window.innerWidth >= breakpoints[breakpoint]
    }
  })

  return (breakpoint: string) => {
    if(!breakpoints || !(breakpoint in breakpoints)) {
      return false
    }
    
    if(!(breakpoint in queryResults)) {
      queryResults[breakpoint] = ref(window.innerWidth >= breakpoints[breakpoint])
    }

    return queryResults[breakpoint].value
  }
}
