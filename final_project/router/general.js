const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


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

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  return res.send(book);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author.toLowerCase();
  const booksByAuthor = {};

  Object.keys(books).forEach((isbn) => {
    if (books[isbn].author.toLowerCase() === author) {
      booksByAuthor[isbn] = books[isbn];
    }
  });

  return res.send(booksByAuthor);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title.toLowerCase();
  const booksByTitle = {};

  Object.keys(books).forEach((isbn) => {
    if (books[isbn].title.toLowerCase() === title) {
      booksByTitle[isbn] = books[isbn];
    }
  });

  return res.send(booksByTitle);
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

// Task 10: Get all books using async/await + Promise helper
public_users.get('/async/books', async function (req, res) {
  try {
    const response = await axios.get("http://localhost:5000/");
    return res.send(response.data);
  } catch (error) {
    return res.status(500).json({ message: "Unable to fetch books asynchronously" });
  }
});

// Task 11: Get book by ISBN using Promise callbacks + Axios
public_users.get('/async/isbn/:isbn', function (req, res) {
  axios.get(`http://localhost:5000/isbn/${req.params.isbn}`)
    .then((response) => res.send(response.data))
    .catch(() => res.status(404).json({ message: "Book not found" }));
});

// Task 12: Get books by author using async/await + Axios
public_users.get('/async/author/:author', async function (req, res) {
  try {
    const response = await axios.get(`http://localhost:5000/author/${req.params.author}`);
    return res.send(response.data);
  } catch (_) {
    return res.status(500).json({ message: "Unable to fetch books by author asynchronously" });
  }
});

// Task 13: Get books by title using Promise callbacks + Axios
public_users.get('/async/title/:title', function (req, res) {
  axios.get(`http://localhost:5000/title/${encodeURIComponent(req.params.title)}`)
    .then((response) => res.send(response.data))
    .catch(() => res.status(500).json({ message: "Unable to fetch books by title asynchronously" }));
});

module.exports.general = public_users;
