import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert
} from 'react-native';

import { db } from '../firebase/firebaseConfig';
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc
} from 'firebase/firestore';

import { MenuItem } from '../types';

export const ManageMenu: React.FC = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [imageKey, setImageKey] = useState('burger');

  useEffect(() => {
    loadMenuItems();
  }, []);

  /* ================= LOAD MENU ================= */

  const loadMenuItems = async () => {
    try {
      setLoading(true);

      const snapshot = await getDocs(collection(db, 'menuItems'));

      const items: MenuItem[] = snapshot.docs.map(docSnap => ({
        id: docSnap.id,
        ...(docSnap.data() as Omit<MenuItem, 'id'>)
      }));

      setMenuItems(items);
    } catch (error) {
      Alert.alert('Error', 'Failed to load menu items');
    } finally {
      setLoading(false);
    }
  };

  /* ================= ADD MENU ITEM ================= */

  const addMenuItem = async () => {
    if (!name || !description || !price || !category) {
      Alert.alert('Error', 'Please fill all fields');
      console.log('ADD MENU ITEM CLICKED');
      return;
    }

    try {
      await addDoc(collection(db, 'menuItems'), {
        name,
        description,
        price: Number(price),
        category: category.toLowerCase(),
        imageKey,
        available: true
      });

      Alert.alert('Success', 'Menu item added');

      // Reset form
      setName('');
      setDescription('');
      setPrice('');
      setCategory('');
      setImageKey('burger');

      loadMenuItems();
    } catch (error) {
      console.log('ADD MENU ERROR:', error);
      Alert.alert('Error', 'Failed to add menu item');
    }
  };

  /* ================= DELETE MENU ITEM ================= */

const deleteMenuItem = async (id: string) => {
  Alert.alert(
    'Delete Item',
    'Are you sure you want to delete this item?',
    [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            console.log('DELETING ITEM:', id);

            await deleteDoc(doc(db, 'menuItems', id));
            console.log('ITEM DELETED');
            loadMenuItems();
          } catch (error) {
            console.log('DELETE ERROR:', error);
            Alert.alert('Error', 'Failed to delete item');
          }
        }
      }
    ]
  );
};


  /* ================= UI ================= */

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Manage Menu</Text>

      {/* ADD ITEM FORM */}
      <View style={styles.form}>
        <TextInput style={styles.input} placeholder="Name" value={name} onChangeText={setName} />
        <TextInput style={styles.input} placeholder="Description" value={description} onChangeText={setDescription} />
        <TextInput style={styles.input} placeholder="Price" value={price} onChangeText={setPrice} keyboardType="numeric" />
        <TextInput style={styles.input} placeholder="Category (burgers, drinks...)" value={category} onChangeText={setCategory} />
        <TextInput style={styles.input} placeholder="Image key (burger, pizza...)" value={imageKey} onChangeText={setImageKey} />

        <TouchableOpacity style={styles.addButton} onPress={addMenuItem}>
          <Text style={styles.addButtonText}>Add Menu Item</Text>
        </TouchableOpacity>
      </View>

      {/* MENU LIST */}
      <FlatList
        data={menuItems}
        keyExtractor={item => item.id}
        refreshing={loading}
        onRefresh={loadMenuItems}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <View>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemInfo}>
                R{item.price} • {item.category}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => deleteMenuItem(item.id)}
            >
              <Text style={styles.deleteText}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: '#f5f5f5' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },

  form: { backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 20 },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 10, borderRadius: 8, marginBottom: 10 },

  addButton: { backgroundColor: '#28a745', padding: 12, borderRadius: 8 },
  addButtonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },

  item: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },

  itemName: { fontSize: 16, fontWeight: 'bold' },
  itemInfo: { fontSize: 13, color: '#666' },

  deleteButton: { backgroundColor: '#dc3545', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 6 },
  deleteText: { color: '#fff', fontWeight: 'bold' }
});