import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { useAuth, RegisterData } from '../context/AuthContext';

export const RegisterScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCVV, setCardCVV] = useState('');
  const { register } = useAuth();

  const handleRegister = async () => {
    if (!email || !password || !name || !surname || !phone || !address || !cardNumber || !cardExpiry || !cardCVV) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }
    
    const registerData: RegisterData = {
      email, password, name, surname, phone, address, cardNumber, cardExpiry, cardCVV
    };
    
    const success = await register(registerData);
    if (!success) {
      Alert.alert('Error', 'Registration failed. Email may already exist.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Register</Text>
      <TextInput style={styles.input} placeholder="Name" value={name} onChangeText={setName} />
      <TextInput style={styles.input} placeholder="Surname" value={surname} onChangeText={setSurname} />
      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
      <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
      <TextInput style={styles.input} placeholder="Phone Number" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
      <TextInput style={styles.input} placeholder="Address" value={address} onChangeText={setAddress} multiline />
      <TextInput style={styles.input} placeholder="Card Number (e.g., 4111111111111111)" value={cardNumber} onChangeText={setCardNumber} keyboardType="numeric" />
      <TextInput style={styles.input} placeholder="Card Expiry (MM/YY)" value={cardExpiry} onChangeText={setCardExpiry} />
      <TextInput style={styles.input} placeholder="CVV" value={cardCVV} onChangeText={setCardCVV} keyboardType="numeric" secureTextEntry />
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.linkText}>Already have an account? Login</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 30 },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 15, marginBottom: 15, borderRadius: 8 },
  button: { backgroundColor: '#007bff', padding: 15, borderRadius: 8, marginBottom: 15 },
  buttonText: { color: 'white', textAlign: 'center', fontWeight: 'bold' },
  linkText: { textAlign: 'center', color: '#007bff' }
});