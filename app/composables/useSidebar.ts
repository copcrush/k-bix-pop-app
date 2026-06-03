const STORAGE_KEY = 'kbixpop_sidebar_collapsed'

export function useSidebar() {
  const isCollapsed = ref(false)
  const isMobileOpen = ref(false)

  function readCollapsed() {
    if (!import.meta.client) return
    try {
      isCollapsed.value = localStorage.getItem(STORAGE_KEY) === 'true'
    }
    catch {
      isCollapsed.value = false
    }
  }

  function persistCollapsed() {
    if (!import.meta.client) return
    try {
      localStorage.setItem(STORAGE_KEY, String(isCollapsed.value))
    }
    catch {
      /* ignore */
    }
  }

  function toggleCollapsed() {
    isCollapsed.value = !isCollapsed.value
    persistCollapsed()
  }

  function openMobile() {
    isMobileOpen.value = true
  }

  function closeMobile() {
    isMobileOpen.value = false
  }

  onMounted(readCollapsed)

  return {
    isCollapsed,
    toggleCollapsed,
    isMobileOpen,
    openMobile,
    closeMobile,
  }
}
