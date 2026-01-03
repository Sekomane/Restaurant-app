import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const RestaurantInfo: React.FC = () => {
  const [restaurantData, setRestaurantData] = useState({
    name: 'Delicious Bites Restaurant',
    address: '123 Food Street, Cape Town',
    phone: '+27 21 123 4567',
    email: 'info@deliciousbites.co.za',
    description: 'A premium restaurant serving the finest cuisine with fresh ingredients and exceptional service.',
    openingHours: 'Mon-Sun: 9:00 AM - 10:00 PM',
    deliveryFee: '25.00',
    minimumOrder: '50.00'
  });

  useEffect(() => {
    loadRestaurantInfo();
  }, []);

  const loadRestaurantInfo = async () => {
    try {
      const savedInfo = await AsyncStorage.getItem('restaurantInfo');
      if (savedInfo) {
        setRestaurantData(JSON.parse(savedInfo));
      }
    } catch (error) {
      console.error('Error loading restaurant info:', error);
    }
  };

  const saveRestaurantInfo = async () => {
    try {
      await AsyncStorage.setItem('restaurantInfo', JSON.stringify(restaurantData));
      Alert.alert('Success', 'Restaurant information updated successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to save restaurant information');
    }
  };

  const updateField = (field: string, value: string) => {
    setRestaurantData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Restaurant Information</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Basic Information</Text>
        
        <Text style={styles.label}>Restaurant Name</Text>
        <TextInput
          style={styles.input}
          value={restaurantData.name}
          onChangeText={(text) => updateField('name', text)}
          placeholder="Restaurant Name"
        />

        <Text style={styles.label}>Address</Text>
        <TextInput
          style={styles.input}
          value={restaurantData.address}
          onChangeText={(text) => updateField('address', text)}
          placeholder="Restaurant Address"
          multiline
        />

        <Text style={styles.label}>Phone Number</Text>
        <TextInput
          style={styles.input}
          value={restaurantData.phone}
          onChangeText={(text) => updateField('phone', text)}
          placeholder="Phone Number"
          keyboardType="phone-pad"
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={restaurantData.email}
          onChangeText={(text) => updateField('email', text)}
          placeholder="Email Address"
          keyboardType="email-address"
        />

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={restaurantData.description}
          onChangeText={(text) => updateField('description', text)}
          placeholder="Restaurant Description"
          multiline
          numberOfLines={4}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Operating Details</Text>
        
        <Text style={styles.label}>Opening Hours</Text>
        <TextInput
          style={styles.input}
          value={restaurantData.openingHours}
          onChangeText={(text) => updateField('openingHours', text)}
          placeholder="Opening Hours"
        />

        <Text style={styles.label}>Delivery Fee (R)</Text>
        <TextInput
          style={styles.input}
          value={restaurantData.deliveryFee}
          onChangeText={(text) => updateField('deliveryFee', text)}
          placeholder="Delivery Fee"
          keyboardType="numeric"
        />

        <Text style={styles.label}>Minimum Order Amount (R)</Text>
        <TextInput
          style={styles.input}
          value={restaurantData.minimumOrder}
          onChangeText={(text) => updateField('minimumOrder', text)}
          placeholder="Minimum Order Amount"
          keyboardType="numeric"
        />
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={saveRestaurantInfo}>
        <Text style={styles.saveButtonText}>Save Changes</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  section: { backgroundColor: 'white', padding: 15, borderRadius: 8, marginBottom: 15, elevation: 2 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, color: '#333' },
  label: { fontSize: 16, fontWeight: 'bold', marginTop: 10, marginBottom: 5, color: '#555' },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 12, borderRadius: 8, fontSize: 16, marginBottom: 10 },
  textArea: { height: 100, textAlignVertical: 'top' },
  saveButton: { backgroundColor: '#28a745', padding: 15, borderRadius: 8, marginBottom: 20 },
  saveButtonText: { color: 'white', textAlign: 'center', fontSize: 16, fontWeight: 'bold' }
});