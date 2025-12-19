import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../context/AuthContext';
import { Order } from '../types';

export const OrderHistoryScreen: React.FC = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    if (!user) return;
    
    try {
      const storedOrders = await AsyncStorage.getItem('orders');
      if (storedOrders) {
        const allOrders = JSON.parse(storedOrders);
        const userOrders = allOrders.filter((order: Order) => order.userId === user.id);
        setOrders(userOrders);
      }
    } catch (error) {
      console.error('Error loading orders:', error);
    }
  };

  const renderOrder = ({ item }: { item: Order }) => (
    <View style={styles.orderContainer}>
      <Text style={styles.orderId}>Order #{item.id}</Text>
      <Text style={styles.orderDate}>{new Date(item.createdAt).toLocaleDateString()}</Text>
      <Text style={styles.orderTotal}>Total: R{item.total.toFixed(2)}</Text>
      <Text style={styles.orderStatus}>Status: {item.status}</Text>
      <Text style={styles.orderItems}>{item.items.length} items</Text>
    </View>
  );

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Please login to view order history</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Order History</Text>
      {orders.length === 0 ? (
        <Text style={styles.emptyText}>No orders found</Text>
      ) : (
        <FlatList
          data={orders}
          renderItem={renderOrder}
          keyExtractor={item => item.id}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  orderContainer: { backgroundColor: 'white', padding: 15, marginBottom: 10, borderRadius: 8, elevation: 2 },
  orderId: { fontSize: 16, fontWeight: 'bold' },
  orderDate: { fontSize: 14, color: '#666', marginTop: 5 },
  orderTotal: { fontSize: 16, fontWeight: 'bold', color: '#007bff', marginTop: 5 },
  orderStatus: { fontSize: 14, color: '#28a745', marginTop: 5 },
  orderItems: { fontSize: 12, color: '#666', marginTop: 5 },
  emptyText: { textAlign: 'center', fontSize: 16, color: '#666', marginTop: 50 },
  errorText: { textAlign: 'center', fontSize: 16, color: '#dc3545', marginTop: 50 }
});