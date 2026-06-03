import type { AdminRole } from '~/types/admin'

export function useAdminRole(): ComputedRef<AdminRole> {
  const { user, isAdmin } = useAuth()

  return computed((): AdminRole => {
    if (!isAdmin.value) return 'viewer'
    void user.value
    return 'owner'
  })
}
