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
  image: any;
  category: string;
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
  createdAt: Date;
}