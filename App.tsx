import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

import { LoginScreen } from './screens/LoginScreen';
import { RegisterScreen } from './screens/RegisterScreen';
import { MenuScreen } from './screens/MenuScreen';
import { MenuItemDetailScreen } from './screens/MenuItemDetailScreen';
import { CartScreen } from './screens/CartScreen';
import { CheckoutScreen } from './screens/CheckoutScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { OrderHistoryScreen } from './screens/OrderHistoryScreen';

import { AdminDashboard } from './admin/AdminDashboard';
import { ManageMenu } from './admin/ManageMenu';
import { RestaurantInfo } from './admin/RestaurantInfo';
import { Analytics } from './admin/Analytics';
import { AdminOrdersScreen } from './admin/adminOrdersScreen';



const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

/* ================= AUTH STACK ================= */
const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
  </Stack.Navigator>
);

/* ================= MENU STACK ================= */
const MenuStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Menu" component={MenuScreen} />
    <Stack.Screen name="MenuItemDetail" component={MenuItemDetailScreen} />
  </Stack.Navigator>
);

/* ================= CART STACK ================= */
const CartStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Cart" component={CartScreen} />
    <Stack.Screen name="Checkout" component={CheckoutScreen} />
  </Stack.Navigator>
);

/* ================= ADMIN STACK ================= */
const AdminStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
    <Stack.Screen name="ManageMenu" component={ManageMenu} />
    <Stack.Screen name="RestaurantInfo" component={RestaurantInfo} />
    <Stack.Screen name="Analytics" component={Analytics} />
    <Stack.Screen name="AdminOrders" component={AdminOrdersScreen} />
  </Stack.Navigator>
);

/* ================= MAIN TABS ================= */
const MainTabs = () => {
  const { isAdmin } = useAuth();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { display: 'none' } // footer hidden
      }}
    >
      <Tab.Screen name="MenuTab" component={MenuStack} />
      <Tab.Screen name="CartTab" component={CartStack} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen name="Orders" component={OrderHistoryScreen} />

      {/* 🔐 ADMIN ONLY */}
      {isAdmin && <Tab.Screen name="Admin" component={AdminStack} />}
    </Tab.Navigator>
  );
};


/* ================= ROOT ================= */
const AppNavigator = () => {
  const { user } = useAuth();
  return user ? <MainTabs /> : <AuthStack />;
};

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <NavigationContainer>
          <View style={styles.appContainer}>
            <View style={styles.content}>
              <AppNavigator />
            </View>

            <View style={styles.footer}>
              <Text style={styles.footerText}>All rights reserved</Text>
            </View>
          </View>
        </NavigationContainer>
      </CartProvider>
    </AuthProvider>
  );
}


const styles = StyleSheet.create({
  appContainer: {
    flex: 1
  },
  content: {
    flex: 1
  },
  footer: {
    paddingVertical: 8,
    alignItems: 'center',
    backgroundColor: '#fff'
  },
  footerText: {
    fontSize: 12,
    color: '#888'
  }
});
