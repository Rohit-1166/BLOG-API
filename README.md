# Modern Blog API

A robust, production-ready RESTful API for a blogging platform, built with **Node.js, Express, TypeScript, and MongoDB**. This project focuses on clean architecture, security, and developer productivity, serving as a showcase of backend engineering best practices.

### 🌐 Live Demo & Documentation
- **Live API Base URL**: [https://blog-api-ptqb.onrender.com/api/v1](https://blog-api-ptqb.onrender.com)
- **Interactive Swagger Docs**: [https://blog-api-ptqb.onrender.com/api-docs](https://blog-api-ptqb.onrender.com/api-docs)

## Features

- **Authentication & Authorization**: Secure user registration and login using JSON Web Tokens (JWT) and bcrypt for password hashing.
- **Blog Post Management**: Full CRUD (Create, Read, Update, Delete) operations for blog posts.
- **Ownership Verification**: Users can only edit or delete their own posts.
- **Search & Pagination**: Efficient data retrieval using limit, page, and text search parameters for scaling with large datasets.
- **Input Validation**: Strict schema-based validation for all incoming requests using Zod.
- **Interactive Documentation**: Beautiful, interactive API documentation using Swagger UI.
- **Automated Testing**: Integration tests covering authentication and post endpoints using Jest and Supertest.
- **Developer Productivity**: Configured with ESLint, Prettier, lint-staged, Husky, and Commitlint to ensure code quality and conventional commits.

## Tech Stack

- **Framework**: Node.js, Express.js
- **Language**: TypeScript
- **Database**: MongoDB (via Mongoose)
- **Security**: Helmet, bcrypt, jsonwebtoken, Zod
- **Testing**: Jest, Supertest, mongodb-memory-server
- **Documentation**: Swagger UI, YAML
- **Tooling**: ts-node-dev, Husky, ESLint, Prettier

## Setup & Installation

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (Local instance or Atlas connection)

### 1. Clone the repository

```bash
git clone https://github.com/Rohit-1166/BLOG-API.git
cd BLOG-API
```

### 2. Install dependencies

```bash
npm install
```

### 3. Environment Variables

Create a `.env` file in the root directory and add the following variables:

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/blog-api  # Or your MongoDB Atlas URI
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=90d
```

### 4. Start the server

To start the server in development mode (with auto-reload):

```bash
npm run dev
```

The server will start on `http://localhost:3000`.

## API Documentation

This API is fully documented using OpenAPI (Swagger). Once the server is running, you can access the interactive documentation by navigating to:

👉 **[http://localhost:3000/api-docs](http://localhost:3000/api-docs)**

From there, you can view the schemas, required payloads, and even test the endpoints directly from your browser.

## Testing

The project includes an automated test suite. It uses an in-memory MongoDB instance (`mongodb-memory-server`) so you don't need a real database running to execute the tests.

To run the test suite:

```bash
npm run test
```

## Project Structure

```text
src/
├── config/        # Database and app configuration
├── controllers/   # Route handlers (Auth, Post)
├── middlewares/   # Custom middlewares (Auth guard, Error handler, Zod validation)
├── models/        # Mongoose database schemas
├── routes/        # Express route definitions
├── utils/         # Helper functions and classes
├── validators/    # Zod schemas for request validation
├── app.ts         # Express app initialization
├── index.ts       # Server entry point
└── swagger.yaml   # OpenAPI documentation schema
```

## Security Considerations

- Passwords are never stored in plain text; they are heavily hashed using `bcrypt`.
- `helmet` is used to set secure HTTP headers.
- Route-level middleware ensures only authenticated users can create, update, or delete content.
- Zod prevents NoSQL injection and malformed data from reaching the database layer.

---
*Designed and engineered for high performance and scalability.*
