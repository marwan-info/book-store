const router = require('express').Router();
const { authenticate, authorize } = require('../middleware/auth');
const { checkout, getOrders } = require('../controllers/orderController');

router.use(authenticate, authorize('client'));

router.post('/checkout', checkout);
router.get('/', getOrders);

module.exports = router;