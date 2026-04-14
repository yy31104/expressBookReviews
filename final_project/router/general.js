const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const BASE_URL = `http://127.0.0.1:${process.env.PORT || 5000}`;


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) {
      users.push({ username, password });
      return res.status(200).json({ message: "User successfully registered. Now you can login" });
    }
    return res.status(404).json({ message: "User already exists!" });
  }

  return res.status(404).json({ message: "Unable to register user." });
});

// Internal sync routes for tasks 10-13 Axios wrappers
public_users.get('/sync/books', function (req, res) {
  return res.send(JSON.stringify(books, null, 4));
});

public_users.get('/sync/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  return res.send(book);
});

public_users.get('/sync/author/:author', function (req, res) {
  const author = req.params.author.toLowerCase();
  const booksByAuthor = {};

  Object.keys(books).forEach((isbn) => {
    if (books[isbn].author.toLowerCase() === author) {
      booksByAuthor[isbn] = books[isbn];
    }
  });

  return res.send(booksByAuthor);
});

public_users.get('/sync/title/:title', function (req, res) {
  const title = req.params.title.toLowerCase();
  const booksByTitle = {};

  Object.keys(books).forEach((isbn) => {
    if (books[isbn].title.toLowerCase() === title) {
      booksByTitle[isbn] = books[isbn];
    }
  });

  return res.send(booksByTitle);
});

// Task 10: Get all books using async/await + Axios
public_users.get('/', async function (req, res) {
  try {
    const response = await axios.get(`${BASE_URL}/sync/books`);
    return res.send(response.data);
  } catch (_) {
    return res.status(500).json({ message: "Unable to fetch books asynchronously" });
  }
});

// Task 11: Get book details by ISBN using Promise callbacks + Axios
public_users.get('/isbn/:isbn', function (req, res) {
  axios.get(`${BASE_URL}/sync/isbn/${encodeURIComponent(req.params.isbn)}`)
    .then((response) => res.send(response.data))
    .catch((error) => {
      if (error.response && error.response.status === 404) {
        return res.status(404).json({ message: "Book not found" });
      }
      return res.status(500).json({ message: "Unable to fetch book by ISBN asynchronously" });
    });
});

// Task 12: Get books by author using async/await + Axios
public_users.get('/author/:author', async function (req, res) {
  try {
    const response = await axios.get(`${BASE_URL}/sync/author/${encodeURIComponent(req.params.author)}`);
    return res.send(response.data);
  } catch (_) {
    return res.status(500).json({ message: "Unable to fetch books by author asynchronously" });
  }
});

// Task 13: Get books by title using Promise callbacks + Axios
public_users.get('/title/:title', function (req, res) {
  axios.get(`${BASE_URL}/sync/title/${encodeURIComponent(req.params.title)}`)
    .then((response) => res.send(response.data))
    .catch(() => res.status(500).json({ message: "Unable to fetch books by title asynchronously" }));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  if (Object.keys(book.reviews).length === 0) {
    return res.json({ message: "No reviews found for this book." });
  }

  return res.send(book.reviews);
});

module.exports.general = public_users;
