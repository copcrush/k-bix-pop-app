import type { CatalogProduct } from '~/types/catalogProduct'

export interface CartLine {
  productId: string
  name: string
  imageUrl: string | null
  /** Shelf price in THB (matches `products.price` in Supabase). */
  priceThb: number
  quantity: number
}

const CART_KEY = 'kbix-cart'

function readCart(): CartLine[] {
  if (!import.meta.client) return []
  try {
    const raw = localStorage.getItem(CART_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as CartLine[]
    return Array.isArray(parsed) ? parsed : []
  }
  catch {
    return []
  }
}

function writeCart(lines: CartLine[]) {
  if (!import.meta.client) return
  localStorage.setItem(CART_KEY, JSON.stringify(lines))
}

export function useCart() {
  const lines = useState<CartLine[]>('kbix-cart-lines', () => [])

  if (import.meta.client && lines.value.length === 0) {
    lines.value = readCart()
  }

  const itemCount = computed(() =>
    lines.value.reduce((sum, line) => sum + line.quantity, 0),
  )

  const subtotalThb = computed(() =>
    lines.value.reduce((sum, line) => sum + line.priceThb * line.quantity, 0),
  )

  function persist(next: CartLine[]) {
    lines.value = next
    writeCart(next)
  }

  function addProduct(product: CatalogProduct, quantity = 1) {
    const qty = Math.max(1, Math.floor(quantity))
    const priceThb = Number(product.price)
    const existing = lines.value.find(l => l.productId === product.id)
    if (existing) {
      persist(
        lines.value.map(l =>
          l.productId === product.id
            ? { ...l, quantity: l.quantity + qty }
            : l,
        ),
      )
      return
    }
    persist([
      ...lines.value,
      {
        productId: product.id,
        name: product.name,
        imageUrl: product.image_url,
        priceThb,
        quantity: qty,
      },
    ])
  }

  function setQuantity(productId: string, quantity: number) {
    const qty = Math.floor(quantity)
    if (qty <= 0) {
      removeLine(productId)
      return
    }
    persist(
      lines.value.map(l =>
        l.productId === productId ? { ...l, quantity: qty } : l,
      ),
    )
  }

  function removeLine(productId: string) {
    persist(lines.value.filter(l => l.productId !== productId))
  }

  function clear() {
    persist([])
  }

  return {
    lines,
    itemCount,
    subtotalThb,
    addProduct,
    setQuantity,
    removeLine,
    clear,
  }
}
