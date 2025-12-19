import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, TextInput, ScrollView } from 'react-native';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { PaymentService } from '../services/PaymentService';

export const CheckoutScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { cartItems, getCartTotal, clearCart, placeOrder } = useCart();
  const { user } = useAuth();
  const [deliveryAddress, setDeliveryAddress] = useState(user?.address || '');
  const [selectedCard, setSelectedCard] = useState(user?.cardNumber || '');
  const [cardExpiry, setCardExpiry] = useState(user?.cardExpiry || '');
  const [cardCVV, setCardCVV] = useState(user?.cardCVV || '');
  const [paymentProvider, setPaymentProvider] = useState<'stripe' | 'paypal' | 'mock'>('mock');
  const [isProcessing, setIsProcessing] = useState(false);

  const processPayment = async () => {
    return PaymentService.processPayment({
      amount: getCartTotal(),
      cardNumber: selectedCard,
      cardExpiry,
      cardCVV,
      provider: paymentProvider
    });
  };

  const handlePlaceOrder = async () => {
    if (!user) {
      Alert.alert('Error', 'Please login to place order');
      return;
    }

    if (!deliveryAddress || !selectedCard || !cardExpiry || !cardCVV) {
      Alert.alert('Error', 'Please fill in all delivery and payment details');
      return;
    }

    setIsProcessing(true);

    try {
      // Process payment
      const paymentResult = await processPayment();
      
      if (paymentResult.success) {
        // Create order with updated details
        const orderData = {
          ...user,
          address: deliveryAddress,
          cardNumber: selectedCard,
          cardExpiry,
          cardCVV
        };
        
        const orderId = await placeOrder(orderData);
        
        Alert.alert('Order Placed Successfully!', 
          `Order #${orderId}\nTotal: R${getCartTotal().toFixed(2)}\nPayment: ${paymentResult.provider}\nTransaction: ${paymentResult.transactionId}\nDelivery to: ${deliveryAddress}`, [
          { text: 'OK', onPress: () => {
            clearCart();
            navigation.navigate('Menu');
          }}
        ]);
      } else {
        Alert.alert('Payment Failed', 'Please check your card details and try again.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to place order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Checkout</Text>
      
      {/* Delivery Address Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Delivery Address</Text>
        <TextInput
          style={styles.input}
          value={deliveryAddress}
          onChangeText={setDeliveryAddress}
          placeholder="Enter delivery address"
          multiline
        />
      </View>

      {/* Payment Details Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Payment Details</Text>
        
        <Text style={styles.label}>Payment Method</Text>
        <View style={styles.paymentMethods}>
          {(['mock', 'stripe', 'paypal'] as const).map(provider => (
            <TouchableOpacity
              key={provider}
              style={[styles.paymentMethod, paymentProvider === provider && styles.selectedPayment]}
              onPress={() => setPaymentProvider(provider)}
            >
              <Text style={[styles.paymentText, paymentProvider === provider && styles.selectedPaymentText]}>
                {provider.charAt(0).toUpperCase() + provider.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        
        <TextInput
          style={styles.input}
          value={selectedCard}
          onChangeText={setSelectedCard}
          placeholder="Card Number (VCC: 4111111111111111)"
          keyboardType="numeric"
        />
        <View style={styles.cardRow}>
          <TextInput
            style={[styles.input, styles.cardInput]}
            value={cardExpiry}
            onChangeText={setCardExpiry}
            placeholder="MM/YY"
          />
          <TextInput
            style={[styles.input, styles.cardInput]}
            value={cardCVV}
            onChangeText={setCardCVV}
            placeholder="CVV"
            keyboardType="numeric"
            secureTextEntry
          />
        </View>
        
        <Text style={styles.testCardInfo}>Test Cards: 4111111111111111 (Visa), 5555555555554444 (MC)</Text>
      </View>

      {/* Order Summary Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Order Summary</Text>
        {cartItems.map(item => (
          <View key={item.id} style={styles.orderItem}>
            <Text style={styles.itemName}>{item.menuItem.name}</Text>
            <Text style={styles.itemDetails}>
              R{(item.totalPrice / item.quantity).toFixed(2)} x {item.quantity} = R{item.totalPrice.toFixed(2)}
            </Text>
            {item.customizations && (
              <Text style={styles.customizations}>
                {item.customizations.sides?.join(', ')}
                {item.customizations.drink && ` • ${item.customizations.drink}`}
                {item.customizations.extras?.join(', ')}
              </Text>
            )}
          </View>
        ))}
      </View>
      
      <View style={styles.totalContainer}>
        <Text style={styles.total}>Total: R{getCartTotal().toFixed(2)}</Text>
      </View>
      
      <TouchableOpacity 
        style={[styles.placeOrderButton, isProcessing && styles.disabledButton]} 
        onPress={handlePlaceOrder}
        disabled={isProcessing}
      >
        <Text style={styles.placeOrderButtonText}>
          {isProcessing ? 'Processing...' : 'Place Order'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  section: { backgroundColor: 'white', padding: 15, borderRadius: 8, marginBottom: 15, elevation: 2 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, color: '#333' },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 12, borderRadius: 8, fontSize: 16, marginBottom: 10 },
  cardRow: { flexDirection: 'row', justifyContent: 'space-between' },
  cardInput: { flex: 0.48, marginBottom: 0 },
  orderItem: { paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#eee' },
  itemName: { fontSize: 16, fontWeight: 'bold' },
  itemDetails: { fontSize: 14, color: '#666', marginTop: 2 },
  customizations: { fontSize: 12, color: '#888', marginTop: 2 },
  totalContainer: { backgroundColor: 'white', padding: 20, borderRadius: 8, marginBottom: 20, elevation: 2 },
  total: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', color: '#28a745' },
  label: { fontSize: 14, fontWeight: 'bold', marginBottom: 5, color: '#555' },
  paymentMethods: { flexDirection: 'row', marginBottom: 15 },
  paymentMethod: { flex: 1, padding: 10, backgroundColor: '#f0f0f0', marginHorizontal: 2, borderRadius: 5, alignItems: 'center' },
  selectedPayment: { backgroundColor: '#007bff' },
  paymentText: { fontSize: 12, color: '#666' },
  selectedPaymentText: { color: 'white', fontWeight: 'bold' },
  testCardInfo: { fontSize: 10, color: '#888', fontStyle: 'italic', marginTop: 5 },
  placeOrderButton: { backgroundColor: '#28a745', padding: 15, borderRadius: 8, marginBottom: 20 },
  disabledButton: { backgroundColor: '#ccc' },
  placeOrderButtonText: { color: 'white', textAlign: 'center', fontSize: 16, fontWeight: 'bold' }
});