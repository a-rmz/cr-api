const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  res.sendStatus(200);
});

router.get('/_health', (req, res) => {
  res.send('All is good. 👍🏼');
})

module.exports = router;
