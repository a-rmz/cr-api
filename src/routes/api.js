const router = require('express').Router();
const api = require('../controllers/api');

/* GET home page. */
router.get('/', api.get);
router.post('/', api.post);

module.exports = router;
