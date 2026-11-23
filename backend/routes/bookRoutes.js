const router = require('express').Router();
const { authenticate, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');
const resizeCover = require('../middleware/resizeCover');


const {
  getBooks, getBook, createBook, updateBook, deleteBook,
} = require('../controllers/bookController');

const handleUpload = (req, res, next) =>
  upload.single('cover')(req, res, (err) => {
    if (err) return res.status(400).json({ message: err.message });
    next();
  });

router.get('/', getBooks);
router.get('/:id', getBook);
router.delete('/:id', authenticate, authorize('admin'), deleteBook);
router.post('/', authenticate, authorize('admin'), handleUpload, resizeCover, createBook);
router.put('/:id', authenticate, authorize('admin'), handleUpload, resizeCover, updateBook);

module.exports = router;