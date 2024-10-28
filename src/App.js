// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/login";
import Register from "./components/register";
import Home from "./components/home";
import Update from './components/update';
import Delete from './components/delete';
import AddBook from './components/addBook';
import BookDetail from './components/BookDetail';
import BooksList from './components/bookUpdate';
import StudentBook from './components/studentHome';
import Profile from "./components/profile";
import SruBookDetail from "./components/stuBookDetail";
import NewHome from "./components/homenew";

function App() {
  return (
      <Router>
        <div className="container mt-4">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/home" element={<Home />} />
            <Route path="/update/:id" element={<Update/>} />
            <Route path="/delete" element={<Delete />} />
            <Route path="/books" element={<BooksList />} />
            <Route path="/add" element={<AddBook />} />
            <Route path="/book-detail/:id" element={<BookDetail />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/student-home" element={<StudentBook />} />
            <Route path="/stubook-detail/:id" element={<SruBookDetail/>} />
            <Route path="/new-home" element={<NewHome />} />
          </Routes>
        </div>
      </Router>
  );
}

export default App;
