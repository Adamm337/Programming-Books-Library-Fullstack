const express = require('express');
const router = express.Router();
const Book = require('../models/Book');

const requireAuth = (req, res, next) => {
  if (!req.session.userId)
    return res.status(401).json({ message: 'Please login first' });
  next();
};

router.get('/', async (req, res) => {
  try {
    const { search, sort } = req.query;
    let query = {};

    if (search) {
      query = {
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { author: { $regex: search, $options: 'i' } },
        ],
      };
    }

    let books = Book.find(query).populate('createdBy', 'name');

    if (sort === 'title-asc') books = books.sort({ title: 1 });
    else if (sort === 'title-desc') books = books.sort({ title: -1 });

    const result = await books;
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.post('/', requireAuth, async (req, res) => {
  try {
    const { title, author, year, price } = req.body;

    if (!title || !author || !year || !price)
      return res.status(400).json({ message: 'All fields are required' });

    const book = await Book.create({
      title,
      author,
      year,
      price,
      createdBy: req.session.userId,
    });

    res.status(201).json(book);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.put('/:id', requireAuth, async (req, res) => {
  try {
    const { title, author, year, price } = req.body;

    const book = await Book.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.session.userId },
      { title, author, year, price },
      { new: true, runValidators: true }
    );

    if (!book)
      return res.status(403).json({ message: 'Not authorized or book not found' });

    res.json(book);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.delete('/:id', requireAuth, async (req, res) => {
  try {

    const book = await Book.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.session.userId,
    });

    if (!book)
      return res.status(403).json({ message: 'Not authorized or book not found' });

    res.json({ message: 'Book deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
