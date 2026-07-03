# Postman API Testing Guide

This guide will walk you through testing every feature of your Blog API from scratch using Postman (or ThunderClient).

Ensure your local server is running (`npm run dev`) before starting. The base URL for all requests will be:
`http://localhost:3000/api/v1`

---

## 1. Authentication (No Token Required)

### 1a. Register a New User

Create a new user account.

- **Method**: `POST`
- **URL**: `http://localhost:3000/api/v1/auth/register`
- **Headers**: `Content-Type: application/json`
- **Body** (raw JSON):

```json
{
  "username": "johndoe",
  "email": "johndoe@example.com",
  "password": "Password123!"
}
```

### 1b. Login

Log in to get your JWT (JSON Web Token), which you will need to create, update, and delete posts.

- **Method**: `POST`
- **URL**: `http://localhost:3000/api/v1/auth/login`
- **Headers**: `Content-Type: application/json`
- **Body** (raw JSON):

```json
{
  "email": "johndoe@example.com",
  "password": "Password123!"
}
```

> [!IMPORTANT]
> When you log in, the server will respond with a `token`. **Copy this token!** You will need to attach it to the headers for the upcoming requests.

---

## 2. Blog Posts (Protected Routes)

For all the routes below (except "Get All Posts" and "Get Single Post"), you must attach your token in Postman.

- Go to the **Authorization** tab in Postman.
- Select **Bearer Token** from the type dropdown.
- Paste the token you copied from the login response.

_(Alternatively, add a Header manually: `Authorization` : `Bearer YOUR_TOKEN_HERE`)_

### 2a. Create a Post

- **Method**: `POST`
- **URL**: `http://localhost:3000/api/v1/posts`
- **Body** (raw JSON):

```json
{
  "title": "My First Blog Post",
  "content": "This is the content of my very first blog post. It's working great!",
  "tags": ["tech", "coding", "internship"]
}
```

_Note the `_id` of the post that gets returned in the response. You'll need it for the next steps._

### 2b. Get All Posts (Public)

You don't need a token for this. It also supports pagination and search!

- **Method**: `GET`
- **URL**: `http://localhost:3000/api/v1/posts`
- **Optional Query Parameters**:
  - `http://localhost:3000/api/v1/posts?page=1&limit=5` (Pagination)
  - `http://localhost:3000/api/v1/posts?search=First` (Search by title/content)

### 2c. Get a Single Post (Public)

- **Method**: `GET`
- **URL**: `http://localhost:3000/api/v1/posts/REPLACE_WITH_POST_ID`

### 2d. Update a Post (Requires Token)

You can only update posts that _you_ created.

- **Method**: `PATCH`
- **URL**: `http://localhost:3000/api/v1/posts/REPLACE_WITH_POST_ID`
- **Body** (raw JSON):

```json
{
  "title": "My First Blog Post (Updated!)",
  "content": "I have added some new content to this post."
}
```

### 2e. Delete a Post (Requires Token)

You can only delete posts that _you_ created.

- **Method**: `DELETE`
- **URL**: `http://localhost:3000/api/v1/posts/REPLACE_WITH_POST_ID`
- **Body**: None required.
- **Expected Response**: `204 No Content` (The post will be deleted).

---
