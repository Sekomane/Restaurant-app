import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert
} from 'react-native';

import { db } from '../firebase/firebaseConfig';
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  updateDoc
} from 'firebase/firestore';

type OrderItem = {
  name: string;
  quantity: number;
  totalPrice: number;
};

type Order = {
  id: string;
  userId: string;
  total: number;
  status: 'pending' | 'preparing' | 'delivered';
  createdAt: any;
  items: OrderItem[];
};

export const AdminOrdersScreen: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const q = query(
      collection(db, 'orders'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, snapshot => {
      const fetchedOrders: Order[] = snapshot.docs.map(docSnap => ({
        id: docSnap.id,
        ...(docSnap.data() as Omit<Order, 'id'>)
      }));

      setOrders(fetchedOrders);
    });

    return unsubscribe;
  }, []);

  /* ================= UPDATE STATUS ================= */

  const updateStatus = async (orderId: string, status: Order['status']) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), { status });
    } catch {
      Alert.alert('Error', 'Failed to update order status');
    }
  };

  /* ================= UI ================= */

  const renderOrder = ({ item }: { item: Order }) => (
    <View style={styles.card}>
      <Text style={styles.orderId}>Order #{item.id}</Text>
      <Text>Total: R{item.total}</Text>
      <Text>Status: {item.status.toUpperCase()}</Text>

      <View style={styles.items}>
        {item.items.map((i, index) => (
          <Text key={index} style={styles.itemText}>
            • {i.name} × {i.quantity} = R{i.totalPrice}
          </Text>
        ))}
      </View>

      <View style={styles.actions}>
        {item.status !== 'preparing' && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => updateStatus(item.id, 'preparing')}
          >
            <Text style={styles.actionText}>Preparing</Text>
          </TouchableOpacity>
        )}

        {item.status !== 'delivered' && (
          <TouchableOpacity
            style={[styles.actionButton, styles.delivered]}
            onPress={() => updateStatus(item.id, 'delivered')}
          >
            <Text style={styles.actionText}>Delivered</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin Orders</Text>

      {orders.length === 0 ? (
        <Text style={styles.empty}>No orders yet</Text>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={item => item.id}
          renderItem={renderOrder}
        />
      )}
    </View>
  );
};

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: '#f5f5f5' },
  title: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 15 },

  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 12
  },

  orderId: { fontWeight: 'bold', marginBottom: 5 },

  items: { marginVertical: 10 },
  itemText: { fontSize: 13, color: '#555' },

  actions: { flexDirection: 'row', justifyContent: 'space-between' },

  actionButton: {
    backgroundColor: '#007bff',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 6
  },

  delivered: {
    backgroundColor: '#28a745'
  },

  actionText: {
    color: '#fff',
    fontWeight: 'bold'
  },

  empty: {
    textAlign: 'center',
    marginTop: 50,
    color: '#666'
  }
});
