const router = require('express').Router();
const {
  createSeed,
  getSeeds,
  getCartItems,
  filterSeeds,
} = require('../controllers/seedController');
const { body } = require('express-validator');
const auth = require('../middleware/auth');

router.post('/', body('name').notEmpty(), auth, createSeed);

router.get('/', getSeeds);

router.post('/filter', filterSeeds);

router.post('/cart', getCartItems);

module.exports = router;
