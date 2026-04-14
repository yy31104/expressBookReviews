# Book Review Application - Final Project

This folder contains my completed implementation of the IBM Skills Network
`expressBookReviews` final project.

## Stack

- Node.js
- Express
- express-session
- jsonwebtoken (JWT)

## Run locally

```bash
npm install
npm start
```

Server runs on:

- `http://localhost:5000`

## What is implemented

### General user routes (`router/general.js`)

- `POST /register`
- `GET /`
- `GET /isbn/:isbn`
- `GET /author/:author`
- `GET /title/:title`
- `GET /review/:isbn`

### Authenticated user routes (`router/auth_users.js`)

- `POST /customer/login`
- `PUT /customer/auth/review/:isbn?review=<text>`
- `DELETE /customer/auth/review/:isbn`

### Authentication middleware (`index.js`)

- Session-based JWT validation for:
  - `/customer/auth/*`

### Async/Promise improvements (Tasks 10-13)

- `GET /async/books` (async/await)
- `GET /async/isbn/:isbn` (Promise callbacks)
- `GET /async/author/:author` (async/await)
- `GET /async/title/:title` (Promise callbacks)

## AI submission text files created in this folder

- `getallbooks`
- `getbooksbyISBN`
- `getbooksbyauthor`
- `getbooksbytitle`
- `getbookreview`
- `register`
- `login`
- `reviewadded`
- `deletereview`
- `githubrepo`

## Repository

- Fork repo: `https://github.com/yy31104/expressBookReviews`
- `general.js` public URL:
  - `https://github.com/yy31104/expressBookReviews/blob/main/final_project/router/general.js`
