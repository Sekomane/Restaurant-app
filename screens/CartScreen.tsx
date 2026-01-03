import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { CartItem } from '../types';

export const CartScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { cartItems, removeFromCart, updateQuantity, clearCart, getCartTotal } = useCart();
  const { user } = useAuth();

  const handleClearCart = () => {
    Alert.alert('Clear Cart', 'Are you sure you want to clear the cart?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear', onPress: clearCart }
    ]);
  };

  const handleCheckout = () => {
    if (!user) {
      Alert.alert('Login Required', 'Please login or register to checkout', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Login', onPress: () => navigation.navigate('Login') }
      ]);
      return;
    }
    navigation.navigate('Checkout');
  };

  const editExtras = (item: CartItem) => {
    navigation.navigate('MenuItemDetail', { item: item.menuItem, editMode: true, cartItemId: item.id });
  };

  const renderCartItem = ({ item }: { item: CartItem }) => (
    <View style={styles.itemContainer}>
      <Image source={item.menuItem.image} style={styles.image} />
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.menuItem.name}</Text>
        <Text style={styles.itemPrice}>R{item.totalPrice.toFixed(2)}</Text>
        {item.customizations && (
          <Text style={styles.customizations}>
            {item.customizations.sides?.join(', ')}
            {item.customizations.drink && ` • ${item.customizations.drink}`}
            {item.customizations.extras?.join(', ')}
          </Text>
        )}
        <View style={styles.quantityContainer}>
          <TouchableOpacity style={styles.quantityButton} onPress={() => updateQuantity(item.id, item.quantity - 1)}>
            <Text style={styles.quantityButtonText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.quantityText}>{item.quantity}</Text>
          <TouchableOpacity style={styles.quantityButton} onPress={() => updateQuantity(item.id, item.quantity + 1)}>
            <Text style={styles.quantityButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.editButton} onPress={() => editExtras(item)}>
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.removeButton} onPress={() => removeFromCart(item.id)}>
          <Text style={styles.removeButtonText}>Remove</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (cartItems.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Your cart is empty</Text>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Menu')}>
          <Text style={styles.buttonText}>Browse Menu</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={cartItems}
        renderItem={renderCartItem}
        keyExtractor={item => item.id}
      />
      <View style={styles.footer}>
        <Text style={styles.total}>Total: R{getCartTotal().toFixed(2)}</Text>
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.clearButton} onPress={handleClearCart}>
            <Text style={styles.clearButtonText}>Clear Cart</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
            <Text style={styles.checkoutButtonText}>Checkout</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  emptyText: { fontSize: 18, marginBottom: 20, color: '#666' },
  itemContainer: { flexDirection: 'row', backgroundColor: 'white', margin: 10, padding: 10, borderRadius: 8, elevation: 2 },
  image: { width: 100, height: 100, borderRadius: 8, resizeMode: 'cover' },
  itemInfo: { flex: 1, marginLeft: 10, justifyContent: 'center' },
  itemName: { fontSize: 16, fontWeight: 'bold' },
  itemPrice: { fontSize: 14, color: '#007bff', marginTop: 2 },
  customizations: { fontSize: 12, color: '#666', marginTop: 2 },
  quantityContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 5 },
  quantityButton: { backgroundColor: '#007bff', width: 30, height: 30, borderRadius: 15, justifyContent: 'center', alignItems: 'center' },
  quantityButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  quantityText: { fontSize: 16, fontWeight: 'bold', marginHorizontal: 15 },
  actionButtons: { justifyContent: 'center' },
  editButton: { backgroundColor: '#28a745', padding: 8, borderRadius: 5, marginBottom: 5 },
  editButtonText: { color: 'white', fontSize: 12, textAlign: 'center' },
  removeButton: { backgroundColor: '#dc3545', padding: 8, borderRadius: 5 },
  removeButtonText: { color: 'white', fontSize: 12, textAlign: 'center' },
  footer: { backgroundColor: 'white', padding: 20, elevation: 5 },
  total: { fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 15 },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between' },
  button: { backgroundColor: '#007bff', padding: 15, borderRadius: 8 },
  buttonText: { color: 'white', textAlign: 'center', fontWeight: 'bold' },
  clearButton: { backgroundColor: '#dc3545', padding: 15, borderRadius: 8, flex: 0.45 },
  clearButtonText: { color: 'white', textAlign: 'center', fontWeight: 'bold' },
  checkoutButton: { backgroundColor: '#28a745', padding: 15, borderRadius: 8, flex: 0.45 },
  checkoutButtonText: { color: 'white', textAlign: 'center', fontWeight: 'bold' }
});