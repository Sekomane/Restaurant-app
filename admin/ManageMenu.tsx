import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, Alert, TextInput, Modal } from 'react-native';
import { images } from '../assest/images';

const MENU_ITEMS = [
  { id: '1', name: 'Burger', description: 'Juicy beef burger', price: 85.00, image: images.burger, category: 'Burgers' },
  { id: '2', name: 'Beef Wrap', description: 'Beef wrap with vegetables', price: 75.00, image: images.pizza, category: 'Mains' },
  { id: '3', name: 'Salad & Chicken', description: 'Fresh garden salad with chicken', price: 65.00, image: images.salad, category: 'Starters' },
  { id: '4', name: 'Pasta', description: 'Creamy alfredo pasta', price: 70.00, image: images.pasta, category: 'Mains' },
  { id: '5', name: 'Sushi', description: 'Fresh sushi rolls', price: 95.00, image: images.tacos, category: 'Mains' }
];

export const ManageMenu: React.FC = () => {
  const [menuItems, setMenuItems] = useState(MENU_ITEMS);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState({ name: '', description: '', price: '', category: '' });

  const openEditModal = (item: any) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price.toString(),
      category: item.category
    });
    setModalVisible(true);
  };

  const openAddModal = () => {
    setEditingItem(null);
    setFormData({ name: '', description: '', price: '', category: '' });
    setModalVisible(true);
  };

  const saveItem = () => {
    if (!formData.name || !formData.description || !formData.price || !formData.category) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    const itemData = {
      id: editingItem ? editingItem.id : Date.now().toString(),
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      category: formData.category,
      image: editingItem ? editingItem.image : images.burger
    };

    if (editingItem) {
      setMenuItems(prev => prev.map(item => item.id === editingItem.id ? itemData : item));
    } else {
      setMenuItems(prev => [...prev, itemData]);
    }

    setModalVisible(false);
    Alert.alert('Success', editingItem ? 'Item updated successfully' : 'Item added successfully');
  };

  const deleteItem = (id: string) => {
    Alert.alert('Delete Item', 'Are you sure you want to delete this item?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', onPress: () => setMenuItems(prev => prev.filter(item => item.id !== id)) }
    ]);
  };

  const renderMenuItem = ({ item }: { item: any }) => (
    <View style={styles.itemContainer}>
      <Image source={item.image} style={styles.image} />
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemDescription}>{item.description}</Text>
        <Text style={styles.itemPrice}>R{item.price}</Text>
        <Text style={styles.itemCategory}>{item.category}</Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity style={styles.editButton} onPress={() => openEditModal(item)}>
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton} onPress={() => deleteItem(item.id)}>
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Manage Menu Items</Text>
        <TouchableOpacity style={styles.addButton} onPress={openAddModal}>
          <Text style={styles.addButtonText}>Add Item</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={menuItems}
        renderItem={renderMenuItem}
        keyExtractor={item => item.id}
      />

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{editingItem ? 'Edit Item' : 'Add New Item'}</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Item Name"
              value={formData.name}
              onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
            />
            
            <TextInput
              style={styles.input}
              placeholder="Description"
              value={formData.description}
              onChangeText={(text) => setFormData(prev => ({ ...prev, description: text }))}
              multiline
            />
            
            <TextInput
              style={styles.input}
              placeholder="Price"
              value={formData.price}
              onChangeText={(text) => setFormData(prev => ({ ...prev, price: text }))}
              keyboardType="numeric"
            />
            
            <TextInput
              style={styles.input}
              placeholder="Category"
              value={formData.category}
              onChangeText={(text) => setFormData(prev => ({ ...prev, category: text }))}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={saveItem}>
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 20, fontWeight: 'bold' },
  addButton: { backgroundColor: '#28a745', padding: 10, borderRadius: 5 },
  addButtonText: { color: 'white', fontWeight: 'bold' },
  itemContainer: { flexDirection: 'row', backgroundColor: 'white', padding: 15, marginBottom: 10, borderRadius: 8, elevation: 2 },
  image: { width: 60, height: 60, borderRadius: 8 },
  itemInfo: { flex: 1, marginLeft: 15 },
  itemName: { fontSize: 16, fontWeight: 'bold' },
  itemDescription: { fontSize: 12, color: '#666', marginTop: 2 },
  itemPrice: { fontSize: 14, fontWeight: 'bold', color: '#007bff', marginTop: 2 },
  itemCategory: { fontSize: 12, color: '#888', marginTop: 2 },
  actions: { justifyContent: 'center' },
  editButton: { backgroundColor: '#007bff', padding: 8, borderRadius: 5, marginBottom: 5 },
  deleteButton: { backgroundColor: '#dc3545', padding: 8, borderRadius: 5 },
  buttonText: { color: 'white', fontSize: 12, textAlign: 'center' },
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { backgroundColor: 'white', padding: 20, borderRadius: 10, width: '90%' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 10, borderRadius: 5, marginBottom: 10 },
  modalActions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 15 },
  cancelButton: { backgroundColor: '#6c757d', padding: 10, borderRadius: 5, flex: 0.45 },
  saveButton: { backgroundColor: '#28a745', padding: 10, borderRadius: 5, flex: 0.45 }
});