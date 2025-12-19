import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

export const Analytics: React.FC = () => {
  const [analytics, setAnalytics] = useState({
    dailySales: [120, 150, 180, 200, 170, 190, 220],
    categoryStats: [
      { category: 'Mains', count: 45, percentage: 40 },
      { category: 'Beverages', count: 30, percentage: 27 },
      { category: 'Desserts', count: 20, percentage: 18 },
      { category: 'Starters', count: 17, percentage: 15 }
    ],
    topItems: [
      { name: 'Burger', orders: 25 },
      { name: 'Pizza', orders: 20 },
      { name: 'Pasta', orders: 18 },
      { name: 'Sushi', orders: 15 }
    ],
    revenueData: {
      today: 1250,
      thisWeek: 8750,
      thisMonth: 35000
    }
  });

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const orders = await AsyncStorage.getItem('orders');
      if (orders) {
        const orderList = JSON.parse(orders);
        // Process real order data here
        calculateAnalytics(orderList);
      }
    } catch (error) {
      console.error('Error loading analytics:', error);
    }
  };

  const calculateAnalytics = (orders: any[]) => {
    // Calculate real analytics from orders
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const categoryCount: { [key: string]: number } = {};
    
    orders.forEach(order => {
      order.items.forEach((item: any) => {
        const category = item.menuItem.category;
        categoryCount[category] = (categoryCount[category] || 0) + item.quantity;
      });
    });

    // Update analytics with real data
    setAnalytics(prev => ({
      ...prev,
      revenueData: {
        ...prev.revenueData,
        thisMonth: totalRevenue
      }
    }));
  };

  const BarChart = ({ data, title }: { data: number[]; title: string }) => (
    <View style={styles.chartContainer}>
      <Text style={styles.chartTitle}>{title}</Text>
      <View style={styles.barChart}>
        {data.map((value, index) => (
          <View key={index} style={styles.barContainer}>
            <View style={[styles.bar, { height: (value / Math.max(...data)) * 100 }]} />
            <Text style={styles.barLabel}>{['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index]}</Text>
          </View>
        ))}
      </View>
    </View>
  );

  const PieChart = ({ data }: { data: any[] }) => (
    <View style={styles.chartContainer}>
      <Text style={styles.chartTitle}>Orders by Category</Text>
      <View style={styles.pieChart}>
        {data.map((item, index) => (
          <View key={index} style={styles.pieItem}>
            <View style={[styles.pieColor, { backgroundColor: ['#007bff', '#28a745', '#ffc107', '#dc3545'][index] }]} />
            <Text style={styles.pieLabel}>{item.category}: {item.percentage}%</Text>
          </View>
        ))}
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Analytics & Reports</Text>

      {/* Revenue Cards */}
      <View style={styles.revenueContainer}>
        <View style={styles.revenueCard}>
          <Text style={styles.revenueLabel}>Today</Text>
          <Text style={styles.revenueValue}>R{analytics.revenueData.today}</Text>
        </View>
        <View style={styles.revenueCard}>
          <Text style={styles.revenueLabel}>This Week</Text>
          <Text style={styles.revenueValue}>R{analytics.revenueData.thisWeek}</Text>
        </View>
        <View style={styles.revenueCard}>
          <Text style={styles.revenueLabel}>This Month</Text>
          <Text style={styles.revenueValue}>R{analytics.revenueData.thisMonth}</Text>
        </View>
      </View>

      {/* Daily Sales Chart */}
      <BarChart data={analytics.dailySales} title="Daily Sales (Last 7 Days)" />

      {/* Category Distribution */}
      <PieChart data={analytics.categoryStats} />

      {/* Top Items */}
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Top Selling Items</Text>
        {analytics.topItems.map((item, index) => (
          <View key={index} style={styles.topItem}>
            <Text style={styles.topItemName}>{item.name}</Text>
            <View style={styles.topItemBar}>
              <View style={[styles.topItemProgress, { width: `${(item.orders / 25) * 100}%` }]} />
            </View>
            <Text style={styles.topItemCount}>{item.orders}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  revenueContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  revenueCard: { backgroundColor: 'white', padding: 15, borderRadius: 8, flex: 0.3, alignItems: 'center', elevation: 2 },
  revenueLabel: { fontSize: 12, color: '#666', marginBottom: 5 },
  revenueValue: { fontSize: 18, fontWeight: 'bold', color: '#28a745' },
  chartContainer: { backgroundColor: 'white', padding: 15, borderRadius: 8, marginBottom: 15, elevation: 2 },
  chartTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
  barChart: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', height: 120 },
  barContainer: { alignItems: 'center', flex: 1 },
  bar: { backgroundColor: '#007bff', width: 20, marginBottom: 5 },
  barLabel: { fontSize: 10, color: '#666' },
  pieChart: { alignItems: 'flex-start' },
  pieItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  pieColor: { width: 16, height: 16, borderRadius: 8, marginRight: 10 },
  pieLabel: { fontSize: 14 },
  topItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  topItemName: { fontSize: 14, fontWeight: 'bold', width: 80 },
  topItemBar: { flex: 1, height: 8, backgroundColor: '#e9ecef', borderRadius: 4, marginHorizontal: 10 },
  topItemProgress: { height: '100%', backgroundColor: '#007bff', borderRadius: 4 },
  topItemCount: { fontSize: 12, fontWeight: 'bold', width: 30, textAlign: 'right' }
});