import React, {
  createContext,
  useContext,
  useState,
  useEffect
} from 'react';

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';

import { auth, db } from '../firebase/firebaseConfig';
import { doc, setDoc, getDoc } from 'firebase/firestore';

/* ================= TYPES ================= */

export type RegisterData = {
  email: string;
  password: string;
  name: string;
  surname: string;
  phone: string;
  address: string;
};

type Role = 'admin' | 'user';

type AuthContextType = {
  user: any;
  role: Role;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => Promise<void>;
};

/* ================= CONTEXT ================= */

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

/* ================= PROVIDER ================= */

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<Role>('user');

  /* ---------- Load role from Firestore ---------- */
  const loadUserRole = async (uid: string) => {
    try {
      const ref = doc(db, 'users', uid);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        setRole((snap.data().role as Role) ?? 'user');
      } else {
        setRole('user');
      }
    } catch (error) {
      console.log('Failed to load role', error);
      setRole('user');
    }
  };

  /* ---------- AUTH STATE LISTENER (CRITICAL) ---------- */
useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async currentUser => {
    console.log('AUTH STATE CHANGED:', currentUser);

    if (currentUser) {
      setUser(currentUser);
      await loadUserRole(currentUser.uid);
    } else {
      console.log('USER IS NULL → LOGGED OUT');
      setUser(null);
      setRole('user');
    }
  });

  return unsubscribe;
}, []);


  /* ---------- LOGIN ---------- */
  const login = async (email: string, password: string) => {
    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      setUser(res.user);
      await loadUserRole(res.user.uid);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  /* ---------- REGISTER ---------- */
  const register = async (data: RegisterData) => {
    try {
      const res = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      await setDoc(doc(db, 'users', res.user.uid), {
        name: data.name,
        surname: data.surname,
        phone: data.phone,
        address: data.address,
        role: 'user', // 🔐 DEFAULT ROLE
        createdAt: new Date()
      });

      setUser(res.user);
      setRole('user');
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  /* ---------- LOGOUT ---------- */
const logout = async () => {
  console.log('SIGNING OUT...');
  await signOut(auth);
  console.log('SIGNED OUT FROM FIREBASE');
};


  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isAdmin: role === 'admin',
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/* ================= HOOK ================= */

export const useAuth = () => useContext(AuthContext);
