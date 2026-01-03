import { Timestamp } from "firebase/firestore";
import { ImageSourcePropType } from 'react-native';

export interface User {
  id: string;
  email: string;
  name: string;
  surname: string;
  phone: string;
  address: string;
  cardNumber: string;
  cardExpiry: string;
  cardCVV: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageKey: string;
  image: ImageSourcePropType;
  available?: boolean;
}

export interface CartItem {
  id: string;
  menuItem: MenuItem;
  quantity: number;
  customizations?: {
    sides?: string[];
    drink?: string;
    extras?: string[];
    removedIngredients?: string[];
    addedIngredients?: string[];
  };
  totalPrice: number;
}

export interface Order {
  id: string;
  userId: string;
  userName: string;
  userSurname: string;
  userPhone: string;
  userAddress: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'delivered';
  createdAt: Timestamp;
}