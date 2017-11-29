const express = require('express');
const router = express.Router();
const Logger = require('../../util/Logger');
const logger = Logger('site_test', ['debug', 'error']);
const fs = require('fs');
const util = require('../../util');

router.get('/:path', function handleReq(req, res, next) {
	logger.info('Received Requeset');
	const path = util.globalizePath(req.params.path);
	fs.stat(path, function handleAccess(err, stats) {
		if (err) {
			logger.info('Error finding file...');
			if (err.code === 'ENOENT') {
				logger.info('File not found');
				res.status(404).send('File does not exist');
				return next(err);
			} else {
				logger.info('Failure accessing file...');
				res.status(500).send(
					'Something went horribly wrong'
				);
				return next(err);
			}
		} else if(stats.isFile()) {
			logger.info('Reading file...');
			fs.readFile(path, 'utf-8', function handleRead(err, data) {
				if (err) {
					logger.info('Failure reading file...');
					res.status(500).send(
						'Something went horribly wrong'
					);
					return next(err);
				}
				res.status(200).send(data);
				return next();
			});
		} else {
			logger.info('Not a file...');
			res.status(404).send('Requested resource is not a file');
			return next();
		}
	});
});

router.put('/:path', function handleReq(req, res, next) {
	logger.info('Received Requeset');
	const path = util.globalizePath(req.params.path);
	fs.stat(path, function handleAccess(err, stats) {
		if (err) {
			res.status(404).send('File not found');
			return next();
		} else if (stats.isFile()) {
			res.status(200).send('File exists');
			return next();
		} else {
			res.status(404).send('Requested resource is not a file');
			return next();
		}
	});
});

module.exports = router;