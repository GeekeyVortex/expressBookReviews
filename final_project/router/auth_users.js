const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [
  { username: "John", password: "1234" },
  { username: "Jane", password: "abcd" },
];

const authenticateUser = (username, password) => {
  return users.find((user) => user.username === username && user.password === password);
};

regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;
  const user = authenticateUser(username, password);
  if (user) {
    const token = jwt.sign({ username }, "secretKey", { expiresIn: "1h" });
    req.session.authorization = { token };
    res.status(200).json({ message: "Login successful", token });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
});

regd_users.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }
  if (users.find((user) => user.username === username)) {
    return res.status(409).json({ message: "Username already exists" });
  }
  users.push({ username, password });
  res.status(200).json({ message: "Registration successful" });
});

regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const { review } = req.body;
  const username = req.session.authorization.username;

  if (books[isbn]) {
    books[isbn].reviews.push({ user: username, review });
    res.status(200).json({ message: "Review added successfully" });
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

module.exports.authenticated = regd_users;
