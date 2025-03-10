# LibraSync

## Overview
LibraSync is a Library Management System designed to streamline the process of borrowing, returning, and managing books in a library. The system includes QR code scanning to verify user roll numbers and ensures efficient tracking of books.

## Features
- **Book Borrowing:** Users can borrow books based on availability.
- **Book Returning:** Allows users to return borrowed books and update records.
- **Loan Extension:** Users can request extensions for their borrowed books.
- **QR Code Scanning:** Verifies user roll numbers for authentication.
- **Admin Panel:** Manages book inventory and user records.
- **Real-time Database Updates:** Synchronizes book availability and transactions instantly.
- **Search & Filter:** Users can search for books by title, author, or genre.
- **User Dashboard:** Displays borrowed books, due dates, and fines (if any).
- **Role-based Access Control:** Different features for students, librarians, and admins.


## Technologies Used
- **Frontend:** React.js, Tailwind CSS
- **Database & Authentication:** Firebase
- **QR Code Scanner:** Implemented using third-party libraries
-  **Hosting:** Git
- **Version control:** Git

## Installation
1. Clone the repository:
   ```sh
   git clone https://github.com/ikjasrasool/library.git
   ```
2. Navigate to the project directory:
   ```sh
   cd library
   ```
3. Install dependencies:
   ```sh
   npm install
   ```
4. Start the project:
   ```sh
   npm start
   ```

## Usage
- Users can sign up and log in to borrow books.
- Admins can manage books and user activities.
- QR code scanning is used to verify student roll numbers.

## Future Enhancements
- Implement a recommendation system for books.
- Add support for e-books and audiobooks.
- Integrate a notification system for due dates.

