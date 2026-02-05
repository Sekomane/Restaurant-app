# 🍔 Food Ordering App (Admin & User)

A React Native (Expo) mobile application with Firebase backend that allows users to order food and admins to manage menu items and orders.

---

## 🚀 Tech Stack

- **React Native (Expo)**
- **TypeScript**
- **Firebase Authentication**
- **Firebase Firestore**
- **React Navigation**

---

## 📱 Features

### 👤 User
- Register & login
- Browse menu items
- Add items to cart
- Place orders
- View order history

### 🛠 Admin
- Admin-only dashboard
- Add, edit, delete menu items
- View all customer orders
- Change order status (pending → preparing → delivered)
- View sales & order statistics

---

## 📂 Project Structure

src/
├─ admin/ # Admin screens (Dashboard, Orders, Manage Menu)
├─ screens/ # User screens
├─ context/ # Auth & Cart context
├─ navigation/ # App & Admin navigators
├─ firebase/ # Firebase config
├─ types/ # TypeScript types
└─ assets/ # Images & icons


---

## 🔐 Authentication & Roles

- Firebase Authentication is used for login & registration
- Admin access is controlled using **Firebase custom claims**
- Only admins can access admin screens and update order status

---

## ▶️ How to Run the Project

### 1️⃣ Install dependencies
```bash
npm install
2️⃣ Start the app
npx expo start
3️⃣ Run on device
Scan QR code with Expo Go

Or run on Android emulator / iOS simulator

🔥 Firebase Setup
Create a Firebase project

Enable:

Authentication (Email/Password)

Firestore Database

Add your Firebase config in:

src/firebase/firebaseConfig.ts
🔒 Firestore Rules (Example)
match /orders/{orderId} {
  allow read: if request.auth != null;
  allow update: if request.auth.token.admin == true;
}
📌 Notes
Order status updates are handled in AdminOrdersScreen

Menu management is handled in ManageMenu

Dashboard statistics are loaded from Firestore (real data)

👨‍💻 Author
Rorisang Sekomane
Final-year Computer Science Student

✅ Status
✔ Functional
✔ Firebase integrated
✔ Admin controls implemented
✔ Ready for submission / deployment

