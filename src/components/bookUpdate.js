// src/components/BooksList.js
import React, { useEffect, useState } from 'react';
import { db } from '../firebase/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from "../firebase/firebase"; // Import Firebase auth for logout
import { signOut } from "firebase/auth"; // Import signOut function

const BooksList = () => {
    const [books, setBooks] = useState([]);
    const [searchTerm, setSearchTerm] = useState(''); // State for search term
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBooks = async () => {
            const booksCollection = collection(db, 'books');
            const booksSnapshot = await getDocs(booksCollection);
            const booksList = booksSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setBooks(booksList);
        };

        fetchBooks();
    }, []);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate("/login");
        } catch (error) {
            console.error("Error during logout:", error);
        }
    };

    // Filter books based on the search term
    const filteredBooks = books.filter(book =>
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div style={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}>
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                <div className="container-fluid">
                    <Link className="navbar-brand" to="/">My App</Link>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav ms-auto">
                            <li className="nav-item">
                                <Link className="nav-link" to="/home">Home</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/books">Update</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/delete">Delete</Link>
                            </li>
                            <li className="nav-item">
                                <button className="nav-link btn" onClick={handleLogout}>Logout</button>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

            <div className="container my-4">
                <h1 className="text-center">All Books</h1>

                {/* Search Input */}
                <div className="mb-4">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search by title or author..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="row">
                    {filteredBooks.length === 0 ? (
                        <div className="col-12 text-center">
                            <h5>No books available. Please add some books!</h5>
                        </div>
                    ) : (
                        filteredBooks.map((book) => (
                            <div className="col-md-4 mb-4" key={book.id}>
                                <div className="card h-100 shadow-sm">
                                    <img src={book.photoURL} className="card-img-top fixed-img" alt={book.title}/>
                                    <div className="card-body">
                                        <h5 className="card-title">{book.title}</h5>
                                        <p className="card-text"><strong>Author:</strong> {book.author}</p>
                                        <p className="card-text"><strong>Genre:</strong> {book.genre}</p>
                                        <Link to={`/update/${book.id}`} className="btn btn-primary">Update</Link>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default BooksList;
