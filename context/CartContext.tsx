import React, { createContext, useContext, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CartItem, MenuItem, Order } from '../types';

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (menuItem: MenuItem, user: any) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  placeOrder: (user: any) => Promise<string>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = (menuItem: any, user: any) => {
    if (!user) {
      throw new Error('User must be registered to add items to cart');
    }
    setCartItems(prev => {
      const cartItem = {
        id: Date.now().toString(),
        menuItem: {
          id: menuItem.id,
          name: menuItem.name,
          description: menuItem.description,
          price: menuItem.price,
          image: menuItem.image,
          category: menuItem.category
        },
        quantity: menuItem.quantity || 1,
        customizations: menuItem.customizations,
        totalPrice: menuItem.totalPrice || menuItem.price
      };
      return [...prev, cartItem];
    });
  };

  const removeFromCart = (itemId: string) => {
    setCartItems(prev => prev.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCartItems(prev => prev.map(item => 
      item.id === itemId 
        ? { ...item, quantity, totalPrice: (item.totalPrice / item.quantity) * quantity }
        : item
    ));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + item.totalPrice, 0);
  };

  const placeOrder = async (orderData: any): Promise<string> => {
    if (!orderData || cartItems.length === 0) {
      throw new Error('Invalid order data');
    }

    const order: Order = {
      id: Date.now().toString(),
      userId: orderData.id,
      userName: orderData.name,
      userSurname: orderData.surname,
      userPhone: orderData.phone,
      userAddress: orderData.address,
      items: [...cartItems],
      total: getCartTotal(),
      status: 'pending',
      createdAt: new Date()
    };

    try {
      const existingOrders = await AsyncStorage.getItem('orders');
      const orders = existingOrders ? JSON.parse(existingOrders) : [];
      orders.push(order);
      await AsyncStorage.setItem('orders', JSON.stringify(orders));
      
      // Save order details for processing
      const orderDetails = {
        ...order,
        paymentDetails: {
          cardNumber: orderData.cardNumber,
          cardExpiry: orderData.cardExpiry,
          cardCVV: orderData.cardCVV
        },
        deliveryAddress: orderData.address
      };
      
      await AsyncStorage.setItem(`order_${order.id}`, JSON.stringify(orderDetails));
      
      return order.id;
    } catch (error) {
      console.error('Error saving order:', error);
      throw error;
    }
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, getCartTotal, placeOrder }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};