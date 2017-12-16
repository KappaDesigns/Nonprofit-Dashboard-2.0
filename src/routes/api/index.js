const router = require('express').Router();

router.use('/site', require('./site-route'));

module.exports = router;