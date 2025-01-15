const express = require("express");
let books = require("./booksdb.js");
const public_users = express.Router();

public_users.get("/", function (req, res) {
  res.send(JSON.stringify(books, null, 2));
});

public_users.get("/isbn/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    res.send(books[isbn]);
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

public_users.get("/author/:author", function (req, res) {
  const author = req.params.author.toLowerCase();
  const results = Object.values(books).filter(
    (book) => book.author.toLowerCase() === author
  );
  if (results.length > 0) {
    res.send(results);
  } else {
    res.status(404).json({ message: "Author not found" });
  }
});

public_users.get("/title/:title", function (req, res) {
  const title = req.params.title.toLowerCase();
  const results = Object.values(books).filter(
    (book) => book.title.toLowerCase() === title
  );
  if (results.length > 0) {
    res.send(results);
  } else {
    res.status(404).json({ message: "Title not found" });
  }
});

public_users.get("/review/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    res.send(books[isbn].reviews);
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;
