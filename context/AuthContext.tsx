import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../types';

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  surname: string;
  phone: string;
  address: string;
  cardNumber: string;
  cardExpiry: string;
  cardCVV: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: RegisterData) => Promise<boolean>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error('Error loading user:', error);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    if (!email || !password) {
      return false;
    }
    
    try {
      // Check if user exists in storage
      const registeredUsers = await AsyncStorage.getItem('registeredUsers');
      if (registeredUsers) {
        const users = JSON.parse(registeredUsers);
        const foundUser = users.find((u: any) => u.email === email && u.password === password);
        if (foundUser) {
          const { password: _, ...userData } = foundUser;
          setUser(userData);
          await AsyncStorage.setItem('user', JSON.stringify(userData));
          return true;
        }
      }
      
      // Demo login for testing
      if (email === 'demo@test.com' && password === 'demo123') {
        const userData: User = {
          id: '1',
          email,
          name: 'Demo',
          surname: 'User',
          phone: '0123456789',
          address: 'Demo Address',
          cardNumber: '4111111111111111',
          cardExpiry: '12/25',
          cardCVV: '123'
        };
        setUser(userData);
        await AsyncStorage.setItem('user', JSON.stringify(userData));
        return true;
      }
    } catch (error) {
      console.error('Login error:', error);
    }
    
    return false;
  };

  const register = async (registerData: RegisterData): Promise<boolean> => {
    const { email, password, name, surname, phone, address, cardNumber, cardExpiry, cardCVV } = registerData;
    if (email && password && name && surname && phone && address && cardNumber && cardExpiry && cardCVV) {
      try {
        // Store user with password for login validation
        const userWithPassword = { ...registerData, id: Date.now().toString() };
        
        // Get existing users
        const existingUsers = await AsyncStorage.getItem('registeredUsers');
        const users = existingUsers ? JSON.parse(existingUsers) : [];
        
        // Check if user already exists
        if (users.find((u: any) => u.email === email)) {
          return false; // User already exists
        }
        
        // Add new user
        users.push(userWithPassword);
        await AsyncStorage.setItem('registeredUsers', JSON.stringify(users));
        
        // Set current user (without password)
        const userData: User = {
          id: userWithPassword.id,
          email,
          name,
          surname,
          phone,
          address,
          cardNumber,
          cardExpiry,
          cardCVV
        };
        setUser(userData);
        await AsyncStorage.setItem('user', JSON.stringify(userData));
        return true;
      } catch (error) {
        console.error('Registration error:', error);
        return false;
      }
    }
    return false;
  };

  const logout = async () => {
    setUser(null);
    await AsyncStorage.removeItem('user');
  };

  const updateProfile = async (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
      
      // Update in registered users list
      try {
        const registeredUsers = await AsyncStorage.getItem('registeredUsers');
        if (registeredUsers) {
          const users = JSON.parse(registeredUsers);
          const userIndex = users.findIndex((u: any) => u.id === user.id);
          if (userIndex !== -1) {
            users[userIndex] = { ...users[userIndex], ...userData };
            await AsyncStorage.setItem('registeredUsers', JSON.stringify(users));
          }
        }
      } catch (error) {
        console.error('Error updating registered users:', error);
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};