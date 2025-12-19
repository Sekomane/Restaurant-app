import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, Alert, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MenuItem } from '../types';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { images } from '../assest/images';
import { EFTService, EFTMenuItem } from '../services/EFTService';



const CATEGORIES = ['Menu\nAll', 'Burgers', 'Mains', 'Starters', 'Desserts', 'Beverages', 'Alcohols'];

export const MenuScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('Menu\nAll');
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMenuItems();
  }, []);

  const loadMenuItems = async () => {
    try {
      const eftItems = await EFTService.fetchMenuItems();
      const convertedItems: MenuItem[] = eftItems.map(item => ({
        ...item,
        image: (images as any)[item.image] || images.burger
      }));
      setMenuItems(convertedItems);
    } catch (error) {
      Alert.alert('Error', 'Failed to load menu items');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (item: MenuItem) => {
    try {
      addToCart(item, user);
    } catch (error) {
      Alert.alert('Registration Required', 'Please register to add items to cart');
    }
  };

  const filteredItems = selectedCategory === 'Menu\nAll' 
    ? menuItems 
    : menuItems.filter(item => item.category === selectedCategory);

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text>Loading menu...</Text>
      </View>
    );
  }

  const renderMenuItem = ({ item }: { item: MenuItem }) => (
    <View style={styles.itemContainer}>
      <View style={styles.imageContainer}>
        <Image source={item.image} style={styles.image} />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.7)']}
          style={styles.imageOverlay}
        />
      </View>
      <View style={styles.itemContent}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemDescription}>{item.description}</Text>
        <View style={styles.priceRow}>
          <Text style={styles.itemPrice}>R{item.price}</Text>
          <View style={styles.categoryTag}>
            <Text style={styles.categoryTagText}>{item.category}</Text>
          </View>
        </View>
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.viewButton} onPress={() => navigation.navigate('MenuItemDetail', { item })}>
            <Text style={styles.viewButtonText}>View</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.addButton} onPress={() => handleAddToCart(item)}>
            <Text style={styles.addButtonText}>Add to Cart</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <LinearGradient colors={['#f8f9fa', '#e9ecef']} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.filterTitle}>Filter by{"\n"}Category:</Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryContainer}>
        {CATEGORIES.map(category => (
          <TouchableOpacity
            key={category}
            style={[styles.categoryButton, selectedCategory === category && styles.selectedCategory]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text style={[styles.categoryText, selectedCategory === category && styles.selectedCategoryText]}>
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <FlatList
        data={filteredItems}
        renderItem={renderMenuItem}
        keyExtractor={item => item.id}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 15, paddingTop: 30 },
  header: { marginBottom: 10, paddingVertical: 15, backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: 15, marginHorizontal: 5 },
  filterTitle: { fontSize: 22, fontWeight: '800', color: '#2c3e50', textAlign: 'center', letterSpacing: 0.5 },
  categoryContainer: { marginBottom: 25, maxHeight: 80, paddingVertical: 8 },
  categoryButton: { backgroundColor: 'transparent', paddingHorizontal: 15, paddingVertical: 10, marginRight: 15 },
  selectedCategory: { backgroundColor: 'transparent', borderBottomWidth: 2, borderBottomColor: '#007bff' },
  categoryText: { fontSize: 15, color: '#495057', fontWeight: '700', textAlign: 'center' },
  selectedCategoryText: { color: 'white', fontWeight: '800' },
  listContainer: { paddingBottom: 20 },
  itemContainer: { flex: 1, margin: 8, backgroundColor: 'white', borderRadius: 20, elevation: 6, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 8, overflow: 'hidden' },
  imageContainer: { position: 'relative', height: 180 },
  image: { width: '100%', height: '100%', resizeMode: 'cover' },
  imageOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 60 },
  itemContent: { padding: 15 },
  itemName: { fontSize: 18, fontWeight: '800', color: '#2c3e50', marginBottom: 5 },
  itemDescription: { fontSize: 13, color: '#6c757d', marginBottom: 10, lineHeight: 18 },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  itemPrice: { fontSize: 20, fontWeight: '900', color: '#28a745' },
  categoryTag: { backgroundColor: '#e9ecef', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  categoryTagText: { fontSize: 10, color: '#495057', fontWeight: '600' },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 8 },
  viewButton: { flex: 1, backgroundColor: '#6c757d', paddingVertical: 12, borderRadius: 12, elevation: 2 },
  viewButtonText: { color: 'white', textAlign: 'center', fontSize: 13, fontWeight: '700' },
  addButton: { flex: 1, backgroundColor: '#007bff', paddingVertical: 12, borderRadius: 12, elevation: 2 },
  addButtonText: { color: 'white', textAlign: 'center', fontSize: 13, fontWeight: '700' }
});