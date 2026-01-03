import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AdminOrderHistory: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const storedOrders = await AsyncStorage.getItem('orders');
      if (storedOrders) {
        const orderList = JSON.parse(storedOrders);
        setOrders(orderList.reverse()); // Show newest first
      }
    } catch (error) {
      console.error('Error loading orders:', error);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const updatedOrders = orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      );
      setOrders(updatedOrders);
      await AsyncStorage.setItem('orders', JSON.stringify(updatedOrders));
      Alert.alert('Success', `Order status updated to ${newStatus}`);
    } catch (error) {
      Alert.alert('Error', 'Failed to update order status');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return '#ffc107';
      case 'confirmed': return '#007bff';
      case 'delivered': return '#28a745';
      default: return '#6c757d';
    }
  };

  const filteredOrders = orders.filter(order => 
    filter === 'all' || order.status === filter
  );

  const renderOrder = ({ item }: { item: any }) => (
    <View style={styles.orderContainer}>
      <View style={styles.orderHeader}>
        <Text style={styles.orderId}>Order #{item.id}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
        </View>
      </View>
      
      <Text style={styles.customerInfo}>
        {item.userName} {item.userSurname} • {item.userPhone}
      </Text>
      <Text style={styles.address}>{item.userAddress}</Text>
      <Text style={styles.orderDate}>
        {new Date(item.createdAt).toLocaleDateString()} {new Date(item.createdAt).toLocaleTimeString()}
      </Text>
      
      <View style={styles.itemsList}>
        {item.items.map((orderItem: any, index: number) => (
          <Text key={index} style={styles.orderItem}>
            {orderItem.quantity}x {orderItem.menuItem.name} - R{orderItem.totalPrice.toFixed(2)}
          </Text>
        ))}
      </View>
      
      <Text style={styles.total}>Total: R{item.total.toFixed(2)}</Text>
      
      {item.status === 'pending' && (
        <View style={styles.actions}>
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: '#007bff' }]}
            onPress={() => updateOrderStatus(item.id, 'confirmed')}
          >
            <Text style={styles.actionButtonText}>Confirm</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: '#dc3545' }]}
            onPress={() => updateOrderStatus(item.id, 'cancelled')}
          >
            <Text style={styles.actionButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      )}
      
      {item.status === 'confirmed' && (
        <TouchableOpacity 
          style={[styles.actionButton, { backgroundColor: '#28a745' }]}
          onPress={() => updateOrderStatus(item.id, 'delivered')}
        >
          <Text style={styles.actionButtonText}>Mark as Delivered</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Order Management</Text>
      
      <View style={styles.filterContainer}>
        {['all', 'pending', 'confirmed', 'delivered'].map(status => (
          <TouchableOpacity
            key={status}
            style={[styles.filterButton, filter === status && styles.activeFilter]}
            onPress={() => setFilter(status)}
          >
            <Text style={[styles.filterText, filter === status && styles.activeFilterText]}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredOrders}
        renderItem={renderOrder}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  filterContainer: { flexDirection: 'row', marginBottom: 20 },
  filterButton: { flex: 1, padding: 10, backgroundColor: 'white', marginHorizontal: 2, borderRadius: 5, alignItems: 'center' },
  activeFilter: { backgroundColor: '#007bff' },
  filterText: { fontSize: 12, color: '#666' },
  activeFilterText: { color: 'white', fontWeight: 'bold' },
  orderContainer: { backgroundColor: 'white', padding: 15, marginBottom: 10, borderRadius: 8, elevation: 2 },
  orderHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  orderId: { fontSize: 16, fontWeight: 'bold' },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  statusText: { color: 'white', fontSize: 10, fontWeight: 'bold' },
  customerInfo: { fontSize: 14, fontWeight: 'bold', marginBottom: 2 },
  address: { fontSize: 12, color: '#666', marginBottom: 2 },
  orderDate: { fontSize: 12, color: '#888', marginBottom: 10 },
  itemsList: { marginBottom: 10 },
  orderItem: { fontSize: 12, color: '#555', marginBottom: 2 },
  total: { fontSize: 16, fontWeight: 'bold', color: '#28a745', marginBottom: 10 },
  actions: { flexDirection: 'row', justifyContent: 'space-between' },
  actionButton: { flex: 0.48, padding: 10, borderRadius: 5, alignItems: 'center' },
  actionButtonText: { color: 'white', fontSize: 12, fontWeight: 'bold' }
});