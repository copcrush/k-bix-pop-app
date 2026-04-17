
export interface ApiErrorDto {
  statusCode: number
  message: string | string[]
  error?: string
}

/** ข้อความอย่างเดียว เช่น refresh ล้มเหลว */
export interface MessageResponseDto {
  message: string
}
