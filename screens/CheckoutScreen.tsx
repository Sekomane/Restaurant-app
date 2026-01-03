import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  TextInput,
  ScrollView
} from 'react-native';

import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase/firebaseConfig';
import { collection, addDoc, Timestamp } from 'firebase/firestore';

export const CheckoutScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const [address, setAddress] = useState('');

  const handlePlaceOrder = async () => {
    if (!user) {
      Alert.alert('Login required');
      return;
    }

    if (!address) {
      Alert.alert('Please enter delivery address');
      return;
    }

    if (cartItems.length === 0) {
      Alert.alert('Cart is empty');
      return;
    }

    try {
      await addDoc(collection(db, 'orders'), {
        userId: user.uid,
        items: cartItems.map(item => ({
          menuItemId: item.menuItem.id,
          name: item.menuItem.name,
          price: item.menuItem.price,
          quantity: item.quantity,
          totalPrice: item.totalPrice
        })),
        total: getCartTotal(),
        status: 'pending',
        address,
        createdAt: Timestamp.now()
      });

      clearCart();

      Alert.alert('Success', 'Order placed successfully', [
        {
          text: 'OK',
          onPress: () => navigation.navigate('Orders')
        }
      ]);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to place order');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Checkout</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Delivery Address</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter delivery address"
          value={address}
          onChangeText={setAddress}
          multiline
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Order Summary</Text>

        {cartItems.map(item => (
          <View key={item.id} style={styles.item}>
            <Text style={styles.itemName}>{item.menuItem.name}</Text>
            <Text>
              R{item.menuItem.price} × {item.quantity} = R{item.totalPrice}
            </Text>
          </View>
        ))}
      </View>

      <Text style={styles.total}>Total: R{getCartTotal()}</Text>

      <TouchableOpacity style={styles.button} onPress={handlePlaceOrder}>
        <Text style={styles.buttonText}>Place Order</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  section: { backgroundColor: '#fff', padding: 15, borderRadius: 8, marginBottom: 15 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 12, borderRadius: 8 },
  item: { marginBottom: 8 },
  itemName: { fontWeight: 'bold' },
  total: { fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginVertical: 20 },
  button: { backgroundColor: '#28a745', padding: 15, borderRadius: 8 },
  buttonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' }
});
