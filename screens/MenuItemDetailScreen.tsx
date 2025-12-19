import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { MenuItem } from '../types';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const CUSTOMIZATION_OPTIONS = {
  sides: ['Chips', 'Pap', 'Salad', 'Rice'],
  drinks: ['Coke', 'Sprite', 'Water', 'Juice'],
  extras: ['Extra Chips (+R15)', 'Sauce (+R5)', 'Extra Salad (+R10)', 'Cheese (+R8)'],
  ingredients: ['Lettuce', 'Tomato', 'Onion', 'Pickles', 'Cheese']
};

export const MenuItemDetailScreen: React.FC<{ route: any; navigation: any }> = ({ route, navigation }) => {
  const { item }: { item: MenuItem } = route.params;
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [quantity, setQuantity] = useState(1);
  const [selectedSides, setSelectedSides] = useState<string[]>([]);
  const [selectedDrink, setSelectedDrink] = useState<string>('');
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const [removedIngredients, setRemovedIngredients] = useState<string[]>([]);

  const calculateTotalPrice = () => {
    let total = item.price * quantity;
    selectedExtras.forEach(extra => {
      if (extra.includes('+R')) {
        const price = parseFloat(extra.match(/\+R(\d+)/)?.[1] || '0');
        total += price;
      }
    });
    return total;
  };

  const handleAddToCart = () => {
    try {
      const customizedItem = {
        ...item,
        customizations: {
          sides: selectedSides,
          drink: selectedDrink,
          extras: selectedExtras,
          removedIngredients
        },
        quantity,
        totalPrice: calculateTotalPrice()
      };
      addToCart(customizedItem, user);
      navigation.goBack();
    } catch (error) {
      Alert.alert('Registration Required', 'Please register to add items to cart');
    }
  };

  const toggleSelection = (item: string, list: string[], setList: (list: string[]) => void, maxSelection?: number) => {
    if (list.includes(item)) {
      setList(list.filter(i => i !== item));
    } else if (!maxSelection || list.length < maxSelection) {
      setList([...list, item]);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Image source={item.image} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.category}>{item.category}</Text>
        <Text style={styles.description}>{item.description}</Text>
        <Text style={styles.price}>R{item.price}</Text>

        {/* Quantity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quantity</Text>
          <View style={styles.quantityContainer}>
            <TouchableOpacity style={styles.quantityButton} onPress={() => setQuantity(Math.max(1, quantity - 1))}>
              <Text style={styles.quantityButtonText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.quantityText}>{quantity}</Text>
            <TouchableOpacity style={styles.quantityButton} onPress={() => setQuantity(quantity + 1)}>
              <Text style={styles.quantityButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Sides */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Choose Sides (Max 2)</Text>
          {CUSTOMIZATION_OPTIONS.sides.map(side => (
            <TouchableOpacity
              key={side}
              style={[styles.optionButton, selectedSides.includes(side) && styles.selectedOption]}
              onPress={() => toggleSelection(side, selectedSides, setSelectedSides, 2)}
            >
              <Text style={[styles.optionText, selectedSides.includes(side) && styles.selectedOptionText]}>{side}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Drinks */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Choose Drink</Text>
          {CUSTOMIZATION_OPTIONS.drinks.map(drink => (
            <TouchableOpacity
              key={drink}
              style={[styles.optionButton, selectedDrink === drink && styles.selectedOption]}
              onPress={() => setSelectedDrink(selectedDrink === drink ? '' : drink)}
            >
              <Text style={[styles.optionText, selectedDrink === drink && styles.selectedOptionText]}>{drink}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Extras */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Extras</Text>
          {CUSTOMIZATION_OPTIONS.extras.map(extra => (
            <TouchableOpacity
              key={extra}
              style={[styles.optionButton, selectedExtras.includes(extra) && styles.selectedOption]}
              onPress={() => toggleSelection(extra, selectedExtras, setSelectedExtras)}
            >
              <Text style={[styles.optionText, selectedExtras.includes(extra) && styles.selectedOptionText]}>{extra}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Remove Ingredients */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Remove Ingredients</Text>
          {CUSTOMIZATION_OPTIONS.ingredients.map(ingredient => (
            <TouchableOpacity
              key={ingredient}
              style={[styles.optionButton, removedIngredients.includes(ingredient) && styles.selectedOption]}
              onPress={() => toggleSelection(ingredient, removedIngredients, setRemovedIngredients)}
            >
              <Text style={[styles.optionText, removedIngredients.includes(ingredient) && styles.selectedOptionText]}>Remove {ingredient}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.totalPrice}>Total: R{calculateTotalPrice().toFixed(2)}</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleAddToCart}>
          <Text style={styles.addButtonText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  image: { width: '100%', height: 400, resizeMode: 'cover' },
  content: { padding: 20 },
  name: { fontSize: 24, fontWeight: 'bold', marginBottom: 5 },
  category: { fontSize: 16, color: '#666', marginBottom: 10 },
  description: { fontSize: 16, lineHeight: 24, marginBottom: 20 },
  price: { fontSize: 20, fontWeight: 'bold', color: '#007bff', marginBottom: 20 },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  quantityContainer: { flexDirection: 'row', alignItems: 'center' },
  quantityButton: { backgroundColor: '#007bff', width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  quantityButtonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  quantityText: { fontSize: 18, fontWeight: 'bold', marginHorizontal: 20 },
  optionButton: { backgroundColor: '#f0f0f0', padding: 12, borderRadius: 8, marginBottom: 8 },
  selectedOption: { backgroundColor: '#007bff' },
  optionText: { fontSize: 16, color: '#333' },
  selectedOptionText: { color: 'white', fontWeight: 'bold' },
  totalPrice: { fontSize: 22, fontWeight: 'bold', color: '#28a745', textAlign: 'center', marginVertical: 20 },
  addButton: { backgroundColor: '#007bff', padding: 15, borderRadius: 8 },
  addButtonText: { color: 'white', textAlign: 'center', fontSize: 16, fontWeight: 'bold' }
});