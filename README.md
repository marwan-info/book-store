# BookStore

A full-stack book library store built with **React**, **Node.js**, **Express** and **MySQL**. Visitors can browse and search books, clients can add books to a cart and buy them, and admins can add, update and delete books from a dashboard.

## Features

**Everyone**
- Browse and search books by title or author
- Paginated book list (12 books per page)
- Responsive layout for phones, tablets and desktop

**Clients**
- Register and log in
- Add books to a cart, change quantities, remove items
- Buy from the cart (stock is checked and reduced in a database transaction)
- View order history

**Admins**
- Add, update and delete books
- Upload a cover image (resized automatically) or paste an image URL
- Paginated book table with cover thumbnails

## Tech stack

| Layer | Technology |
| --- | --- |
| Frontend | React, React Router, Axios |
| Backend | Node.js, Express |
| Database | MySQL (`mysql2`) |
| Auth | JSON Web Tokens, `bcrypt` password hashing |
| Uploads | `multer`, `sharp` |

## Project structure

```
book-store/
├── frontend/              React app
│   └── src/
│       ├── api.js         Axios instance and image URL helper
│       ├── styles/        styles.css
│       ├── fonts/         Rasmela DEMO font (add your own copy)
│       ├── context/       AuthContext.js
│       ├── components/    Navbar, Pagination, ProtectedRoute
│       └── pages/         Login, Register, Books, Cart, Orders, AdminDashboard
└── backend/               Express API
    ├── server.js
    ├── schema.sql         Database and tables
    ├── seed.sql          30 more sample books
    ├── setupDb.js         Runs schema.sql for you
    ├── createAdmin.js     Creates the first admin account
    ├── config/            Database connection
    ├── middleware/        auth, upload, resizeCover
    ├── controllers/       auth, book, cart, order
    └── routes/            auth, book, cart, order
```

## Getting started

### Prerequisites

- [Node.js](https://nodejs.org/) 18 or newer
- [MySQL](https://dev.mysql.com/downloads/) 8 or newer, running locally

### 1. Clone the project

### 2. Set up the backend

```bash
cd backend
npm install
```

Create a file named `.env` inside `backend`:

```
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=book_store
JWT_SECRET=change_this_to_a_long_random_string
```

Create the database and tables, add the sample books, and create the admin account:

```bash
node setupDb.js
mysql -u root -p book_store < seed.sql
mysql -u root -p book_store < seed2.sql
node createAdmin.js
```

On Windows PowerShell the `<` symbol does not work. Use `mysql -u root -p -e "source seed.sql"` instead, or run the commands in Command Prompt or MySQL Workbench.

Start the API on http://localhost:5000:

```bash
npm run dev
```

### 3. Set up the frontend

In a second terminal:

```bash
cd frontend
npm install
npm start
```

Open http://localhost:3000. The home page redirects to `/books`.

### Font

The design uses the Rasmela DEMO font, which is not included in this repository. Put the file at `frontend/src/fonts/Rasmela DEMO.ttf`. Without it the app falls back to the system font.

## Default admin account

`node createAdmin.js` creates this account:

| Email | Password |
| --- | --- |
| admin@store.com | admin123 |

Change the email and password in `backend/createAdmin.js` before using the project anywhere real. Public registration only ever creates client accounts.

## API reference

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| POST | `/api/auth/register` | Public | Create a client account |
| POST | `/api/auth/login` | Public | Log in and receive a token |
| GET | `/api/books` | Public | List books. Query: `search`, `page`, `limit` |
| GET | `/api/books/:id` | Public | Get one book |
| POST | `/api/books` | Admin | Add a book (multipart form, optional `cover` file) |
| PUT | `/api/books/:id` | Admin | Update a book |
| DELETE | `/api/books/:id` | Admin | Delete a book |
| GET | `/api/cart` | Client | Get the cart |
| POST | `/api/cart` | Client | Add a book to the cart |
| PUT | `/api/cart/:id` | Client | Change an item's quantity |
| DELETE | `/api/cart/:id` | Client | Remove an item |
| POST | `/api/orders/checkout` | Client | Buy everything in the cart |
| GET | `/api/orders` | Client | List the client's orders |

Protected routes expect an `Authorization: Bearer <token>` header. The paginated books response looks like this:

```json
{ "books": [], "total": 40, "page": 1, "limit": 12, "totalPages": 4 }
```

## Database

| Table | Purpose |
| --- | --- |
| `users` | Accounts with a `role` of `client` or `admin` |
| `books` | Title, author, description, price, stock, `image_url` |
| `cart_items` | One row per user and book, with a quantity |
| `orders` | A completed purchase and its total |
| `order_items` | The books, quantities and prices in each order |

## How roles are enforced

The role is stored in the JWT. Backend middleware checks it on every protected route, so only admins can change books and only clients can use the cart and orders. Hiding buttons in React is only a convenience, not the security layer.

## Troubleshooting

- **A 500 error on the Books page:** add `console.error(err);` in the controllers' `catch` blocks and read the backend terminal. Common causes are a wrong `DB_PASSWORD`, a database that was not created (`node setupDb.js`), or MySQL not running.
- **A cover is saved as NULL:** the column must be named `image_url`, and `bookRoutes.js` must run the upload middleware on both the POST and PUT routes.
- **Covers do not show:** uploaded files are served by the backend at `/uploads`, so the API must be running on port 5000.


## Author

Marwan Nabil 😃😃
any problem you can contact me :  marwannabil007@gmail.com
