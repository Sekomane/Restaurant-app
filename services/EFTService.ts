import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { MenuItem } from '../types';

export class EFTService {
  static async fetchMenuItems(): Promise<Omit<MenuItem, 'image'>[]> {
    const snapshot = await getDocs(collection(db, 'menuItems'));

    return snapshot.docs.map(doc => {
      const data = doc.data();

      return {
        id: doc.id,
        name: data.name,
        description: data.description,
        price: data.price,
        category: data.category,
        imageKey: data.image
      };
    });
  }
}
