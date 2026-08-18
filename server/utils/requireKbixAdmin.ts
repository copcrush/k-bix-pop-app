import type { H3Event } from 'h3'
import { KBIX_ACCESS_TOKEN_KEY } from '~~/lib/axios/k-bix-pop-api'

interface KbixMe {
  id: string
  role: string
}

export async function requireKbixAdmin(event: H3Event) {
  const header = getHeader(event, 'authorization')
  const bearer = header?.match(/^Bearer\s+(.+)$/i)?.[1]?.trim()
  const token = bearer || getCookie(event, KBIX_ACCESS_TOKEN_KEY)

  if (!token) {
    throw createError({ statusCode: 401, statusMessage: 'Sign in required' })
  }

  const config = useRuntimeConfig(event)
  const apiBase = String(config.public.apiBase || '').replace(/\/$/, '')

  let me: KbixMe
  try {
    me = await $fetch<KbixMe>(`${apiBase}/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    })
  }
  catch {
    throw createError({ statusCode: 401, statusMessage: 'Sign in required' })
  }

  if (me.role !== 'ADMIN') {
    throw createError({ statusCode: 403, statusMessage: 'Admin only' })
  }

  return me
}
