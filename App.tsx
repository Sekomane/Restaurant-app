import React from 'react';
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
import { AdminOrderHistory } from './admin/AdminOrderHistory';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const AuthStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
  </Stack.Navigator>
);

const MenuStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="Menu" component={MenuScreen} options={{ title: 'Menu' }} />
    <Stack.Screen name="MenuItemDetail" component={MenuItemDetailScreen} options={{ title: 'Item Details' }} />
  </Stack.Navigator>
);

const CartStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="Cart" component={CartScreen} options={{ title: 'Cart' }} />
    <Stack.Screen name="Checkout" component={CheckoutScreen} options={{ title: 'Checkout' }} />
  </Stack.Navigator>
);

const AdminStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="AdminDashboard" component={AdminDashboard} options={{ title: 'Admin Dashboard' }} />
    <Stack.Screen name="ManageMenu" component={ManageMenu} options={{ title: 'Manage Menu' }} />
    <Stack.Screen name="RestaurantInfo" component={RestaurantInfo} options={{ title: 'Restaurant Info' }} />
    <Stack.Screen name="Analytics" component={Analytics} options={{ title: 'Analytics' }} />
    <Stack.Screen name="OrderHistory" component={AdminOrderHistory} options={{ title: 'Order History' }} />
  </Stack.Navigator>
);

const MainTabs = () => (
  <Tab.Navigator
    screenOptions={{
      tabBarShowLabel: true,
      tabBarIcon: () => null,
      tabBarActiveTintColor: '#007AFF',
      tabBarInactiveTintColor: 'gray',
      tabBarStyle: {
        backgroundColor: 'white',
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
        paddingBottom: 5,
        paddingTop: 5
      },
      tabBarLabelStyle: {
        fontSize: 12,
        fontWeight: '500'
      }
    }}
  >
    <Tab.Screen name="MenuTab" component={MenuStack} options={{ title: 'Menu', headerShown: false }} />
    <Tab.Screen name="CartTab" component={CartStack} options={{ title: 'Cart', headerShown: false }} />
    <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profile' }} />
    <Tab.Screen name="Orders" component={OrderHistoryScreen} options={{ title: 'Orders' }} />
    <Tab.Screen name="Admin" component={AdminStack} options={{ title: 'Admin', headerShown: false }} />
  </Tab.Navigator>
);

const AppNavigator = () => {
  const { user } = useAuth();
  return user ? <MainTabs /> : <AuthStack />;
};

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </CartProvider>
    </AuthProvider>
  );
}