

# 📚 LibraSync – Library Management System

A **comprehensive and modern library management solution** that leverages QR code scanning, Firebase integration, and a clean React-based UI to deliver a seamless experience for students, librarians, and administrators.

---

## 🔍 Overview

**LibraSync** is designed to simplify and digitize traditional library operations. It includes features for borrowing, returning, and managing books efficiently, with support for QR code-based authentication and real-time data synchronization.

---

## ✨ Features

- 📖 **Book Borrowing:** Borrow books based on real-time availability.
- 🔁 **Book Returning:** Update library records instantly upon return.
- ⏳ **Loan Extension:** Request extensions for currently borrowed books.
- 📷 **QR Code Scanning:** Scan student roll numbers for fast and secure verification.
- 🛠️ **Admin Panel:** Manage book inventory, track borrow/return activity, and oversee user records.
- 🔄 **Real-time Database Updates:** Firebase keeps your data synchronized at all times.
- 🔍 **Search & Filter:** Find books quickly by title, author, or genre.
- 📊 **User Dashboard:** Track due dates, borrowed books, and fines.
- 🔐 **Role-Based Access Control:** Separate access for students, librarians, and admins.
- 🌟 **Book Reviews & Ratings:** Share feedback and rate books.
- 💸 **Fine Calculation:** Automatically compute overdue fines.
- 📱 **Responsive Design:** Mobile and desktop-friendly interface.

---

## 🛠️ Technologies Used

| Purpose                    | Technologies                              |
|---------------------------|-------------------------------------------|
| Frontend                  | `React.js`, `Bootstrap`                   |
| Backend & Database        | `Firebase Authentication`, `Cloud Firestore` |
| QR Code Integration       | `html5-qrcode`                            |
| Hosting                   | `GitHub Pages`                            |
| Version Control           | `Git`                                     |

---

## 🚀 Installation & Setup

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/ikjasrasool/library.git
```

### 2️⃣ Navigate to the Project Directory
```bash
cd library
```

### 3️⃣ Install Dependencies
```bash
npm install
```

### 4️⃣ Add Firebase Configuration
Create a `.env` file in the `login-app` directory:
```env
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
REACT_APP_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### 5️⃣ Start the Development Server
```bash
npm start
```

Visit: [http://localhost:3000](http://localhost:3000)

---

## 👥 User Roles

- 👨‍🎓 **Students:** Sign up, borrow/return books, extend loans, review books.
- 📚 **Librarians/Admins:** Manage books, approve extensions, track borrowed records, calculate fines.

---

## 🔮 Future Enhancements

- 📖 Book recommendation system based on borrowing history.
- 📘 Support for e-books and audiobooks.
- 🔔 Notification system for due dates & overdue alerts.
- 📈 Advanced analytics in the admin dashboard.

---

## 🤝 Contributing

We welcome contributions from the community!  
To contribute:

1. Fork the repository.
2. Create a feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Make your changes and commit:
   ```bash
   git commit -m "Add your feature"
   ```
4. Push to the branch:
   ```bash
   git push origin feature/your-feature-name
   ```
5. Open a **Pull Request** 🚀

---

## 📬 Contact

For any inquiries, suggestions, or support:  
👤 **Ikjas Rasool** – [GitHub Profile](https://github.com/ikjasrasool)

---

