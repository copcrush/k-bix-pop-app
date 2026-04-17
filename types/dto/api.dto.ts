
export interface ApiErrorDto {
  statusCode: number
  message: string | string[]
  error?: string
}

export interface MessageResponseDto {
  message: string
}
