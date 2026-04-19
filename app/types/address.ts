export interface Address {
  id: string
  userId: string
  label: string | null
  recipientName: string
  line1: string
  line2: string | null
  city: string
  stateRegion: string | null
  postalCode: string
  country: string
  isDefault: boolean
  createdAt: string
  updatedAt: string
}

export type CreateAddressPayload = {
  label?: string
  recipientName: string
  line1: string
  line2?: string
  city: string
  stateRegion?: string
  postalCode: string
  country: string
  isDefault?: boolean
}

export type UpdateAddressPayload = Partial<CreateAddressPayload> & {
  isDefault?: boolean
}
