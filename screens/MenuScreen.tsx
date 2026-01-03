import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MenuItem } from '../types';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { images } from '../assets/images';
import { EFTService } from '../services/EFTService';
import { MenuService } from '../services/MenuService';

const CATEGORIES = ['ALL', 'Burgers', 'Mains', 'Starters', 'Desserts', 'Beverages', 'Alcohols'];

export const MenuScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { addToCart } = useCart();
  const { user } = useAuth();

  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMenuItems();
  }, []);

  const loadMenuItems = async () => {
    try {
      const items = await MenuService.fetchMenuItems();

      const mapped = items.map(item => ({
        ...item,
        image: images[item.imageKey] ?? images.burger
      }));

      setMenuItems(mapped);

    } catch {
      Alert.alert('Error', 'Failed to load items');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (item: MenuItem) => {
    try {
      addToCart(item, user);
    } catch {
      Alert.alert('Registration Required', 'Please register to add items to cart');
    }
  };

  const filteredItems =
    selectedCategory === 'ALL'
      ? menuItems
      : menuItems.filter(
        item =>
          item.category &&
          item.category.toLowerCase().includes(
            selectedCategory.toLowerCase()
          )
      );

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text>Loading...</Text>
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
          <TouchableOpacity
            style={styles.viewButton}
            onPress={() => navigation.navigate('MenuItemDetail', { item })}
          >
            <Text style={styles.viewButtonText}>View</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.addButton}
            onPress={() => handleAddToCart(item)}
          >
            <Text style={styles.addButtonText}>Add to Cart</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <LinearGradient colors={['#f8f9fa', '#e9ecef']} style={styles.container}>
      <FlatList
        data={filteredItems}
        renderItem={renderMenuItem}
        keyExtractor={item => item.id}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={false}
        contentContainerStyle={styles.listContainer}
        ListHeaderComponent={
          <>
            {/* TOP NAV (FROM FOOTER) */}
            <View style={styles.topNav}>
              <Text style={styles.navItem} onPress={() => navigation.navigate('Menu')}>
                Menu
              </Text>
              <Text style={styles.navItem} onPress={() => navigation.navigate('CartTab')}>
                Cart
              </Text>
              <Text style={styles.navItem} onPress={() => navigation.navigate('Orders')}>
                Orders
              </Text>
              <Text style={styles.navItem} onPress={() => navigation.navigate('Profile')}>
                Profile
              </Text>
              <Text style={styles.navItem} onPress={() => navigation.navigate('Admin')}>
                Admin
              </Text>
            </View>

            {/* CATEGORY BAR */}
            <View style={styles.categoryWrapper}>
              {CATEGORIES.map(category => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.categoryButton,
                    selectedCategory === category && styles.selectedCategory
                  ]}
                  onPress={() => setSelectedCategory(category)}
                >
                  <Text
                    style={[
                      styles.categoryText,
                      selectedCategory === category && styles.selectedCategoryText
                    ]}
                  >
                    {category === 'ALL' ? 'All' : category}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        }
      />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { justifyContent: 'center', alignItems: 'center' },

  topNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0'
  },
  navItem: {
    fontSize: 14,
    fontWeight: '700',
    color: '#007bff'
  },

  categoryWrapper: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 15
  },
  categoryButton: {
    marginRight: 15,
    paddingBottom: 6
  },
  selectedCategory: {
    borderBottomWidth: 2,
    borderBottomColor: '#007bff'
  },
  categoryText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#495057'
  },
  selectedCategoryText: {
    color: '#007bff'
  },

  listContainer: {
    paddingBottom: 120
  },

  itemContainer: {
    flex: 1,
    margin: 8,
    backgroundColor: 'white',
    borderRadius: 20,
    elevation: 6,
    overflow: 'hidden'
  },
  imageContainer: { height: 180 },
  image: { width: '100%', height: '100%', resizeMode: 'cover' },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60
  },
  itemContent: { padding: 15 },
  itemName: { fontSize: 18, fontWeight: '800', marginBottom: 5 },
  itemDescription: { fontSize: 13, marginBottom: 10 },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15
  },
  itemPrice: { fontSize: 20, fontWeight: '900', color: '#28a745' },
  categoryTag: {
    backgroundColor: '#e9ecef',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12
  },
  categoryTagText: { fontSize: 10 },
  buttonRow: { flexDirection: 'row', gap: 8 },
  viewButton: {
    flex: 1,
    backgroundColor: '#6c757d',
    paddingVertical: 12,
    borderRadius: 12
  },
  viewButtonText: { color: 'white', textAlign: 'center' },
  addButton: {
    flex: 1,
    backgroundColor: '#007bff',
    paddingVertical: 12,
    borderRadius: 12
  },
  addButtonText: { color: 'white', textAlign: 'center' }
});
