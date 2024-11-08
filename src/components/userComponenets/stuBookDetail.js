import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { db } from '../../firebase/firebase';
import { doc, getDoc, collection, getDocs, addDoc, updateDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const BookDetail = () => {
    const { id } = useParams();
    const [book, setBook] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [newReview, setNewReview] = useState({ rating: 0, comment: '' });
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [averageRating, setAverageRating] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const auth = getAuth();
        const currentUser = auth.currentUser;

        if (!currentUser) {
            navigate('/login');
        } else {
            setUser({
                uid: currentUser.uid,
                name: currentUser.email || 'user',
            });
        }

        const fetchBook = async () => {
            try {
                const bookDoc = await getDoc(doc(db, 'books', id));
                if (bookDoc.exists()) {
                    const bookData = { id: bookDoc.id, ...bookDoc.data() };
                    setBook(bookData);
                    await updateBookStatus(bookData.noOfBooks); // Check and update book status
                } else {
                    console.error("No such document!");
                }

                const reviewsCollection = collection(db, 'books', id, 'reviews');
                const reviewsSnapshot = await getDocs(reviewsCollection);
                const reviewsList = reviewsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setReviews(reviewsList);

                if (reviewsList.length > 0) {
                    const totalRating = reviewsList.reduce((sum, review) => sum + review.rating, 0);
                    setAverageRating((totalRating / reviewsList.length).toFixed(1));
                } else {
                    setAverageRating(0);
                }
            } catch (error) {
                console.error("Error fetching book:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBook();
    }, [id, navigate]);

    const renderStars = (rating) => {
        const totalStars = 5;
        let stars = '';
        for (let i = 1; i <= totalStars; i++) {
            stars += i <= rating ? '⭐' : '☆';
        }
        return stars;
    };

    const handleReviewChange = (e) => {
        const { name, value } = e.target;
        setNewReview(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        if (newReview.comment.trim() === '' || !user) return;

        try {
            await addDoc(collection(db, 'books', id, 'reviews'), {
                rating: Number(newReview.rating),
                comment: newReview.comment,
                userId: user.uid,
                userName: user.name,
            });
            setReviews([...reviews, { ...newReview, id: Date.now(), userName: user.name }]);
            const updatedTotalRating = reviews.reduce((sum, review) => sum + review.rating, 0) + Number(newReview.rating);
            setAverageRating(((updatedTotalRating) / (reviews.length + 1)).toFixed(1));
            setNewReview({ rating: 0, comment: '' });
        } catch (error) {
            console.error("Error adding review:", error);
        }
    };

    const handleBorrow = async () => {
        if (!user || !book) return;

        if (book.noOfBooks > 0) {
            await updateDoc(doc(db, 'books', id), { noOfBooks: book.noOfBooks - 1 });
            const returnDate = new Date(new Date().setDate(new Date().getDate() + 7)).toISOString().split("T")[0];
            await addDoc(collection(db, 'borrowedBooks', user.uid, 'books'), {
                bookId: id,
                title: book.title,
                EntryDate: new Date().toISOString().split("T")[0],
                returnDate,
            });
            setBook(prevBook => ({ ...prevBook, noOfBooks: prevBook.noOfBooks - 1 }));
            await updateBookStatus(book.noOfBooks - 1);
            navigate("/student-home", { replace: true });
        } else {
            alert("This book is currently not available for borrowing.");
        }
    };

    const handleReturn = async () => {
        await updateDoc(doc(db, 'books', id), { noOfBooks: book.noOfBooks + 1 });
        await updateBookStatus(book.noOfBooks + 1);
        navigate("/student-home", { replace: true });
    };

    const updateBookStatus = async (availableCount) => {
        const status = availableCount > 0 ? 'Available' : 'Not Available';
        await updateDoc(doc(db, 'books', id), { status });
    };

    if (loading) {
        return <div className="text-center">Loading...</div>;
    }

    return (
        <div className="container my-4">
            <div className="row">
                <div className="col-md-6">
                    <img src={book.photoURL} className="img-fluid" alt={book.title} />
                </div>
                <div className="col-md-6">
                    <h1>{book.title}</h1>
                    <h5>Author: {book.author}</h5>
                    <p><strong>Genre:</strong> {book.genre}</p>
                    <p><strong>Description:</strong> {book.description}</p>
                    <p><strong>Status:</strong> {book.status}</p>
                    <p><strong>Number of Books Available:</strong> {book.noOfBooks}</p>
                    <p><strong>Location:</strong> {book.location}</p>
                    <p><strong>Average Rating:</strong> {renderStars(averageRating)} ({averageRating})</p>
                    <div className="d-flex justify-content-between align-items-center">
                        {book.noOfBooks > 0 ? (
                            <button onClick={handleBorrow} className="btn btn-primary">
                                Borrow
                            </button>
                        ) : (
                            <button className="btn btn-warning" disabled>
                                Not Available
                            </button>
                        )}
                        <Link to="/student-home" className="btn btn-secondary">Back to Home</Link>
                    </div>
                </div>
            </div>

            <div className="mt-4">
                <h4>Customer Reviews</h4>
                {reviews.length > 0 ? (
                    reviews.map(review => (
                        <div key={review.id} className="border p-2 my-2">
                            <p><strong>{review.userName}</strong> {renderStars(review.rating)}</p>
                            <p>{review.comment}</p>
                        </div>
                    ))
                ) : (
                    <p>No reviews yet. Be the first to review this book!</p>
                )}
            </div>

            <div className="mt-4">
                <h4>Leave a Review</h4>
                {user ? (
                    <form onSubmit={handleSubmitReview}>
                        <div className="mb-3">
                            <label htmlFor="rating" className="form-label">Rating (1-5):</label>
                            <input
                                type="number"
                                className="form-control"
                                id="rating"
                                name="rating"
                                value={newReview.rating}
                                onChange={handleReviewChange}
                                min="1"
                                max="5"
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="comment" className="form-label">Comment:</label>
                            <textarea
                                className="form-control"
                                id="comment"
                                name="comment"
                                rows="3"
                                value={newReview.comment}
                                onChange={handleReviewChange}
                            ></textarea>
                        </div>
                        <button type="submit" className="btn btn-primary">Submit Review</button>
                    </form>
                ) : (
                    <p>Please log in to leave a review.</p>
                )}
            </div>
        </div>
    );
};

export default BookDetail;