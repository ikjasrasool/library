import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { db } from '../../firebase/firebase';
import { doc, getDoc, collection, getDocs, addDoc, updateDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { Html5Qrcode } from "html5-qrcode"; // Import the barcode scanning library

const BookDetail = () => {
    const { id } = useParams();
    const [book, setBook] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [newReview, setNewReview] = useState({ rating: 0, comment: '' });
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [averageRating, setAverageRating] = useState(0);
    const [isScanning, setIsScanning] = useState(false); // To track if barcode scanning is active
    const scannerRef = useRef(null);
    const html5QrcodeScanner = useRef(null); // Reference for the scanner
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
                rollNumber: currentUser.displayName || 'unknown', // Assuming rollNumber is stored in displayName
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

    const handleBorrow = () => {
        setIsScanning(true); // Start scanning when user clicks borrow
    };

    const validateRollNumber = async (scannedRollNumber) => {
        if (scannedRollNumber.trim().toLowerCase() === user.rollNumber.toLowerCase()) {
            if (html5QrcodeScanner.current) {
                html5QrcodeScanner.current.stop().catch((err) => console.warn("Stop scan error:", err));
            }
            setIsScanning(false); // Stop scanning after a successful match

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
        } else {
            alert("Roll number does not match. Access denied.");
            setIsScanning(false); // Stop scanning if roll number doesn't match
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

    const handleModalClose = () => {
        // Stop scanning if the user closes the modal or cancels the scanning
        if (html5QrcodeScanner.current) {
            html5QrcodeScanner.current.stop().catch((err) => console.warn("Stop scan error:", err));
        }
        setIsScanning(false); // Ensure scanning is stopped
    };

    useEffect(() => {
        if (isScanning) {
            html5QrcodeScanner.current = new Html5Qrcode("barcode-scanner");

            html5QrcodeScanner.current.start(
                { facingMode: "environment" },
                { fps: 10, qrbox: { width: 250, height: 250 } },
                (decodedText) => validateRollNumber(decodedText), // Callback when barcode is scanned
                (errorMessage) => console.warn(`Scanning error: ${errorMessage}`)
            ).catch(error => {
                console.error("Scanner error:", error);
                setIsScanning(false); // Stop scanning if an error occurs
            });
        }
    }, [isScanning]);

    if (loading) {
        return <div className="text-center">Loading...</div>;
    }

    return (
        <div className="container my-4">
            <div className="row">
                <div className="col-md-6">
                    <img src={book.photoURL} className="img-fluid w-100 h-auto" alt={book.title}/>
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

            {/* Modal for barcode scanner */}
            <div className={`modal fade ${isScanning ? 'show' : ''}`} id="barcodeModal" style={{ display: isScanning ? 'block' : 'none' }} aria-hidden={!isScanning}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Scanning for Roll Number</h5>
                            <button type="button" className="close" data-bs-dismiss="modal" aria-label="Close" onClick={handleModalClose}>&times;</button>
                        </div>
                        <div className="modal-body">
                            <div id="barcode-scanner"></div>
                            <p className="text-center">Scan your barcode to borrow the book</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Review Section */}
            <div className="my-4">
                <h2>Reviews</h2>
                {reviews.length > 0 ? (
                    <div className="list-group">
                        {reviews.map((review) => (
                            <div key={review.id} className="list-group-item">
                                <h5>{review.userName}</h5>
                                <p>{renderStars(review.rating)}</p>
                                <p>{review.comment}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No reviews yet</p>
                )}

                {user && (
                    <form onSubmit={handleSubmitReview}>
                        <div className="mb-3">
                            <label htmlFor="rating" className="form-label">Rating</label>
                            <select
                                id="rating"
                                name="rating"
                                value={newReview.rating}
                                onChange={handleReviewChange}
                                className="form-select"
                                required
                            >
                                <option value="0">Select Rating</option>
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <option key={star} value={star}>{star} Stars</option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="comment" className="form-label">Review</label>
                            <textarea
                                id="comment"
                                name="comment"
                                value={newReview.comment}
                                onChange={handleReviewChange}
                                className="form-control"
                                rows="3"
                                required
                            ></textarea>
                        </div>
                        <button type="submit" className="btn btn-primary">Submit Review</button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default BookDetail;
