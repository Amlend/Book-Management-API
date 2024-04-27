## Book Management API

This document provides an overview of the Book Management API, written in Node.js using Express.js and Sequelize for interacting with a MySQL database. The API offers functionalities for managing book data, including adding, fetching, deleting, and updating book information.

**Understanding the Code:**

The main functionality resides in the app.js file, which likely includes:

- Database connection setup using Sequelize for MySQL.
- Definition of API endpoints (URLs) for various functionalities.
- Controller functions that handle incoming requests to specific endpoints and interact with the database using Sequelize.

**API Endpoint**

| Endpoint          | Method | Description                                                             |
| ----------------- | ------ | ----------------------------------------------------------------------- |
| /sign-up          | POST   | Adds the user to the database and redirects to login screen.            |
| /login/validation | POST   | Server checks if a user with the provided email exists in the database. |
| /books            | GET    | Fetch all books from the database.                                      |
| /books/:id        | GET    | Fetch a specific book by its ID.                                        |
| /books            | POST   | Add a new book to the database. (Request body should contain book data) |
| /books/:id        | DELETE | Delete a book by its ID.                                                |

**Data Format**

- Book data might be represented as JSON objects with properties like title, author, publication year, etc.

**How JWT is used:**

- The JWT generated upon successful login acts as a secure way to identify the user in subsequent API requests.
- The client application likely stores the JWT (in local storage) and includes it in the authorization header of future requests to access book management functionalities like adding, retrieving, or deleting books.
- The server can verify the JWT using the same secret key to ensure the user is authenticated before granting access to protected resources.

**Running the application**

**Prerequisites:**

- Node.js and npm installed on your system.

**Steps:**

- Clone or download the application codebase.

- Navigate to the project directory in your terminal.

- Install dependencies:

```
npm install
```

```
npm start
```

This will typically start the server on a port like localhost:3000 (check the code for the specific port).

For MySQL database setup add your database details in the .env file.

**API Usage**

Once the server is running, you can use tools like Postman or make API requests directly from your code to interact with the contact management endpoints. Refer to the codebase for specific API endpoint definitions and request/response structures.
