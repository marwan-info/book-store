const router = require('express').Router();
const { authenticate, authorize } = require('../middleware/auth');
const {
  getCart, addToCart, updateCartItem, removeCartItem,
} = require('../controllers/cartController');

router.use(authenticate, authorize('client'));

router.get('/', getCart);
router.post('/', addToCart);
router.put('/:id', updateCartItem);
router.delete('/:id', removeCartItem);

module.exports = router;