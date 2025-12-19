import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { useAuth } from '../context/AuthContext';

export const ProfileScreen: React.FC = () => {
  const { user, updateProfile, logout } = useAuth();
  
  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Access Denied</Text>
        <Text style={styles.errorText}>Please register or login to access your profile.</Text>
      </View>
    );
  }
  const [name, setName] = useState(user?.name || '');
  const [surname, setSurname] = useState(user?.surname || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState(user?.address || '');
  const [cardNumber, setCardNumber] = useState(user?.cardNumber || '');
  const [cardExpiry, setCardExpiry] = useState(user?.cardExpiry || '');
  const [cardCVV, setCardCVV] = useState(user?.cardCVV || '');

  const handleUpdateProfile = () => {
    if (!name || !surname || !email || !phone || !address || !cardNumber || !cardExpiry || !cardCVV) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }
    
    updateProfile({ name, surname, email, phone, address, cardNumber, cardExpiry, cardCVV });
    Alert.alert('Success', 'Profile updated successfully');
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', onPress: logout }
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      
      <Text style={styles.label}>Name</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Enter your name" />
      
      <Text style={styles.label}>Surname</Text>
      <TextInput style={styles.input} value={surname} onChangeText={setSurname} placeholder="Enter your surname" />
      
      <Text style={styles.label}>Email</Text>
      <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="Enter your email" keyboardType="email-address" autoCapitalize="none" />
      
      <Text style={styles.label}>Phone</Text>
      <TextInput style={styles.input} value={phone} onChangeText={setPhone} placeholder="Enter your phone number" keyboardType="phone-pad" />
      
      <Text style={styles.label}>Address</Text>
      <TextInput style={styles.input} value={address} onChangeText={setAddress} placeholder="Enter your address" multiline />
      
      <Text style={styles.label}>Card Number</Text>
      <TextInput style={styles.input} value={cardNumber} onChangeText={setCardNumber} placeholder="Card Number" keyboardType="numeric" />
      
      <Text style={styles.label}>Card Expiry</Text>
      <TextInput style={styles.input} value={cardExpiry} onChangeText={setCardExpiry} placeholder="MM/YY" />
      
      <Text style={styles.label}>CVV</Text>
      <TextInput style={styles.input} value={cardCVV} onChangeText={setCardCVV} placeholder="CVV" keyboardType="numeric" secureTextEntry />
      
      <TouchableOpacity style={styles.updateButton} onPress={handleUpdateProfile}>
        <Text style={styles.updateButtonText}>Update Profile</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: 'white' },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 30 },
  label: { fontSize: 16, fontWeight: 'bold', marginTop: 15, marginBottom: 5 },

  input: { borderWidth: 1, borderColor: '#ddd', padding: 15, borderRadius: 8, fontSize: 16 },
  updateButton: { backgroundColor: '#007bff', padding: 15, borderRadius: 8, marginTop: 30 },
  updateButtonText: { color: 'white', textAlign: 'center', fontSize: 16, fontWeight: 'bold' },
  logoutButton: { backgroundColor: '#dc3545', padding: 15, borderRadius: 8, marginTop: 15 },
  logoutButtonText: { color: 'white', textAlign: 'center', fontSize: 16, fontWeight: 'bold' },
  errorText: { fontSize: 16, color: '#666', textAlign: 'center', marginTop: 20 }
});