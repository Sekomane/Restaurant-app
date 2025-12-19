import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

export const AdminDashboard: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    totalMenuItems: 18
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const orders = await AsyncStorage.getItem('orders');
      if (orders) {
        const orderList = JSON.parse(orders);
        const totalOrders = orderList.length;
        const totalRevenue = orderList.reduce((sum: number, order: any) => sum + order.total, 0);
        const pendingOrders = orderList.filter((order: any) => order.status === 'pending').length;
        
        setStats({
          totalOrders,
          totalRevenue,
          pendingOrders,
          totalMenuItems: 18
        });
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const StatCard = ({ title, value, color }: { title: string; value: string; color: string }) => (
    <View style={[styles.statCard, { borderLeftColor: color }]}>
      <Text style={styles.statTitle}>{title}</Text>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Admin Dashboard</Text>
      
      <View style={styles.statsContainer}>
        <StatCard title="Total Orders" value={stats.totalOrders.toString()} color="#007bff" />
        <StatCard title="Total Revenue" value={`R${stats.totalRevenue.toFixed(2)}`} color="#28a745" />
        <StatCard title="Pending Orders" value={stats.pendingOrders.toString()} color="#ffc107" />
        <StatCard title="Menu Items" value={stats.totalMenuItems.toString()} color="#dc3545" />
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('ManageMenu')}>
          <Text style={styles.actionButtonText}>Manage Menu Items</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('RestaurantInfo')}>
          <Text style={styles.actionButtonText}>Restaurant Information</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('OrderHistory')}>
          <Text style={styles.actionButtonText}>View Order History</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('Analytics')}>
          <Text style={styles.actionButtonText}>Analytics & Charts</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  statsContainer: { marginBottom: 30 },
  statCard: { backgroundColor: 'white', padding: 20, borderRadius: 8, marginBottom: 15, borderLeftWidth: 4, elevation: 2 },
  statTitle: { fontSize: 16, color: '#666', marginBottom: 5 },
  statValue: { fontSize: 24, fontWeight: 'bold' },
  actionsContainer: { marginBottom: 20 },
  actionButton: { backgroundColor: '#007bff', padding: 15, borderRadius: 8, marginBottom: 10 },
  actionButtonText: { color: 'white', textAlign: 'center', fontSize: 16, fontWeight: 'bold' }
});