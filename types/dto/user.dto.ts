import type { Role } from '../models/role'

export interface UserPublicDto {
  id: string
  email: string
  firstName: string | null
  lastName: string | null
  phone?: string | null
  role: Role
  createdAt: string
  updatedAt: string
}
