import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';

export const AdminGuard: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const { isAdmin } = useAuth();

  if (!isAdmin) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Access Denied</Text>
        <Text style={styles.text}>
          You do not have permission to view this page.
        </Text>
      </View>
    );
  }

  return <>{children}</>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#dc3545'
  },
  text: {
    fontSize: 14,
    color: '#666'
  }
});
