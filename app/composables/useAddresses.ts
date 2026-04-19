import type { Address, CreateAddressPayload, UpdateAddressPayload } from '~/types/address'
import {
  getKbixPopApiClient,
  getKbixApiErrorMessage,
} from '~~/lib/axios/k-bix-pop-api'

export function useAddresses() {
  async function list(): Promise<Address[]> {
    const { data } = await getKbixPopApiClient().get<Address[]>('/users/me/addresses')
    return data
  }

  async function create(payload: CreateAddressPayload) {
    try {
      const { data } = await getKbixPopApiClient().post<Address>(
        '/users/me/addresses',
        payload,
      )
      return { ok: true as const, address: data }
    }
    catch (e: unknown) {
      return {
        ok: false as const,
        message: getKbixApiErrorMessage(e, 'Could not add address'),
      }
    }
  }

  async function update(id: string, payload: UpdateAddressPayload) {
    try {
      const { data } = await getKbixPopApiClient().patch<Address>(
        `/users/me/addresses/${id}`,
        payload,
      )
      return { ok: true as const, address: data }
    }
    catch (e: unknown) {
      return {
        ok: false as const,
        message: getKbixApiErrorMessage(e, 'Could not update address'),
      }
    }
  }

  async function remove(id: string) {
    try {
      await getKbixPopApiClient().delete(`/users/me/addresses/${id}`)
      return { ok: true as const }
    }
    catch (e: unknown) {
      return {
        ok: false as const,
        message: getKbixApiErrorMessage(e, 'Could not delete address'),
      }
    }
  }

  return { list, create, update, remove }
}
