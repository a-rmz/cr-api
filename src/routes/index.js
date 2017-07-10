const express = require('express');
const api = require('./api');

const router = express.Router();

/* GET home page. */
router.get('/', (req, res) => {
  res.sendStatus(200);
});

router.get('/_health', (req, res) => {
  res.send('All is good. 👍🏼');
});

router.use('/api', api);

module.exports = router;
