const express = require('express');
const router = express.Router();

router.get('/', function handleReq(req, res, next) {
	res.send('Site Router');
	return next();
});

module.exports = router;