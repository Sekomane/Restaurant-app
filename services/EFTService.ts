import AsyncStorage from '@react-native-async-storage/async-storage';

export interface EFTMenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  available: boolean;
}

export class EFTService {
  private static baseUrl = 'https://api.restaurant-eft.co.za';

  static async fetchMenuItems(): Promise<EFTMenuItem[]> {
    try {
      const cachedItems = await AsyncStorage.getItem('eft_menu_items');
      if (cachedItems) {
        return JSON.parse(cachedItems);
      }

      // Fallback to local data if API unavailable
      const localItems: EFTMenuItem[] = [
        { id: '1', name: 'Burger', description: 'Juicy beef burger', price: 85.00, image: 'burger', category: 'Burgers', available: true },
        { id: '2', name: 'Beef Wrap', description: 'Beef wrap with vegetables', price: 75.00, image: 'pizza', category: 'Mains', available: true },
        { id: '3', name: 'Salad & Chicken', description: 'Fresh garden salad with chicken', price: 65.00, image: 'salad', category: 'Starters', available: true },
        { id: '4', name: 'Pasta', description: 'Creamy alfredo pasta', price: 70.00, image: 'pasta', category: 'Mains', available: true },
        { id: '5', name: 'Sushi', description: 'Fresh sushi rolls', price: 95.00, image: 'tacos', category: 'Mains', available: true },
        { id: '6', name: 'Waffle', description: 'Sweet waffle with toppings', price: 45.00, image: 'wings', category: 'Desserts', available: true },
        { id: '7', name: 'Oreo Roller', description: 'Oreo ice cream roll', price: 35.00, image: 'sandwich', category: 'Desserts', available: true },
        { id: '8', name: 'Honey Tarts', description: 'Sweet honey tarts', price: 25.00, image: 'soup', category: 'Desserts', available: true },
        { id: '9', name: 'Chocolate Milkshake', description: 'Chocolate milkshake', price: 40.00, image: 'steak', category: 'Beverages', available: true },
        { id: '10', name: 'Raspberry Cocktail', description: 'Fresh raspberry cocktail', price: 50.00, image: 'dessert', category: 'Alcohols', available: true },
        { id: '11', name: 'Syrup Drink', description: 'Refreshing syrup drink', price: 30.00, image: 'drink', category: 'Beverages', available: true },
        { id: '12', name: 'Virgin Mojito', description: 'Non-alcoholic mojito', price: 35.00, image: 'rice', category: 'Beverages', available: true },
        { id: '13', name: 'Strawberry Milkshake', description: 'Fresh strawberry milkshake', price: 40.00, image: 'chicken', category: 'Beverages', available: true },
        { id: '14', name: 'Coke', description: 'Cold Coca Cola', price: 20.00, image: 'seafood', category: 'Beverages', available: true },
        { id: '15', name: 'Special Sauce', description: 'Chef special sauce combo', price: 45.00, image: 'extra1', category: 'Mains', available: true },
        { id: '16', name: 'Fruit Salad', description: 'Premium mixed fruit salad', price: 85.00, image: 'extra2', category: 'Starters', available: true },
        { id: '17', name: 'Green Salad', description: 'Fresh green salad', price: 35.00, image: 'extra3', category: 'Starters', available: true },
        { id: '18', name: 'Fries', description: 'Crispy golden fries', price: 30.00, image: 'extra4', category: 'Starters', available: true }
      ];

      await AsyncStorage.setItem('eft_menu_items', JSON.stringify(localItems));
      return localItems;
    } catch (error) {
      console.error('EFT Menu fetch error:', error);
      throw error;
    }
  }

  static async processEFTPayment(amount: number, accountDetails: any): Promise<{ success: boolean; transactionId?: string; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/payment/eft`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: amount * 100, // Convert to cents
          accountNumber: accountDetails.accountNumber,
          bankCode: accountDetails.bankCode,
          reference: `ORDER_${Date.now()}`
        })
      });

      if (response.ok) {
        const result = await response.json();
        return { success: true, transactionId: result.transactionId };
      } else {
        return { success: false, error: 'EFT payment failed' };
      }
    } catch (error) {
      return { success: false, error: 'Network error' };
    }
  }
}