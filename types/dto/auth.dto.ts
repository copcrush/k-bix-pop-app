import type { UserPublicDto } from './user.dto'

export interface LoginRequestDto {
  email: string
  password: string
}

export interface RegisterRequestDto {
  email: string
  password: string
  firstName?: string
  lastName?: string
}

export interface LoginResponseDto {
  message: string
  user: UserPublicDto
  accessToken: string
}

export interface RegisterResponseDto {
  message: string
  user: UserPublicDto
}

export interface RefreshTokenResponseDto {
  accessToken: string
}

export interface LogoutResponseDto {
  message: string
}
