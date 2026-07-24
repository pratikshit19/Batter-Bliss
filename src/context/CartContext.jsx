import { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext()

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('batterbliss_cart')
      return saved ? JSON.parse(saved) : {}
    } catch {
      return {}
    }
  })

  const [isCartOpen, setIsCartOpen] = useState(false)

  useEffect(() => {
    try {
      localStorage.setItem('batterbliss_cart', JSON.stringify(cart))
    } catch (e) {
      console.error('Failed to save cart to localStorage', e)
    }
  }, [cart])

  /* Cart actions */
  const addToCart = (productKey, itemDetails) => {
    setCart(prev => {
      const existingQty = prev[productKey]?.qty || 0
      return {
        ...prev,
        [productKey]: {
          ...itemDetails,
          qty: existingQty + 1
        }
      }
    })
    setIsCartOpen(true)
  }

  const updateQty = (productKey, newQty) => {
    setCart(prev => {
      if (newQty <= 0) {
        const { [productKey]: _, ...rest } = prev
        return rest
      }
      return {
        ...prev,
        [productKey]: {
          ...prev[productKey],
          qty: newQty
        }
      }
    })
  }

  const removeFromCart = (productKey) => {
    setCart(prev => {
      const { [productKey]: _, ...rest } = prev
      return rest
    })
  }

  const clearCart = () => {
    setCart({})
  }

  /* Derived data */
  const cartEntries = Object.entries(cart).filter(([, item]) => item && item.qty > 0)
  const cartItems = cartEntries.map(([key, item]) => ({ key, ...item }))
  const totalItems = cartItems.reduce((acc, item) => acc + item.qty, 0)
  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.qty), 0)

  return (
    <CartContext.Provider value={{
      cart,
      cartItems,
      totalItems,
      subtotal,
      isCartOpen,
      setIsCartOpen,
      addToCart,
      updateQty,
      removeFromCart,
      clearCart
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
