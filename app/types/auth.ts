export type UserRole = 'USER' | 'ADMIN'

export interface AuthUser {
  id: string
  email: string
  firstName: string | null
  lastName: string | null
  /** Present after API upgrade; may be absent in cached localStorage. */
  phone?: string | null
  role: UserRole
  createdAt: string
  updatedAt: string
}

export interface LoginResponse {
  message: string
  user: AuthUser
  accessToken: string
}

export interface RegisterResponse {
  message: string
  user: AuthUser
}

export interface RefreshResponse {
  accessToken: string
}
