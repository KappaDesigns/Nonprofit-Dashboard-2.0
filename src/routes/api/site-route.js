const express = require('express');
const router = express.Router();
const Logger = require('../../util/Logger');
const logger = Logger('site_test', ['debug', 'error']);
const fs = require('fs');
const util = require('../../util');
const Site = require('../../lib/site');

router.get('/:path', function handleReq(req, res, next) {
	logger.info('Received GET Requeset @ path');
	const path = util.globalizePath(req.params.path);
	fs.stat(path, async function handleAccess(err, stats) {
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
			try {
				const data = await Site.getPage(path);
				res.status(200).send(data);
			} catch(err) {
				logger.info('Failure reading file...');
				res.status(500).send(
					'Something went horribly wrong'
				);
				return next(err);
			}
		} else {
			logger.info('Not a file...');
			res.status(400).send('Requested resource is not a file');
			return next();
		}
	});
});

router.put('/:path', function handleReq(req, res, next) {
	logger.info('Received PUT Request @ path');
	const path = util.globalizePath(req.params.path);
	if (!req.body) {
		res.status(400).send('No body attached to request');
		return next();
	}
	if (!req.body.html || !req.body.message) {
		res.status(400).send('Empty body attached');
		return next();
	}
	fs.stat(path, async function handleAccess(err, stats) {
		if (err) {
			if (err.code == 'ENOENT') {
				res.status(404).send('File not found');
				return next();
			} else {
				res.status(500).send('Something went horribly wrong');
				return next(err);
			}
		} else if (stats.isFile()) {
			try {
				await Site.editPage(
					req.body.html, 
					util.globalizePath(req.params.path), 
					req.body.message,
				);
				res.status(200).send('Modified Page');
				return next();
			} catch (err) {
				res.status(500).send('Something went horribly wrong');
				return next(err);
			}
		} else {
			res.status(400).send('Requested resource is not a file');
			return next();
		}
	});
});

router.post('/sync', async function handleReq(req, res, next) {
	logger.info('Received POST Request @ sync');
	try {
		const sha = await Site.sync({
			firstName: 'test',
			email: 'test@test.com',
		});
		res.status(200).send(sha);
		return next();
	} catch (err) {
		res.status(500).send('Something went horribly wrong');
		return next(err);
	}
});

router.post('/publish', async function handleReq(req, res, next) {
	logger.info('Received POST request @ publish');
	try {
		const sha = await Site.publish();
		res.status(200).send(sha);
		return next();
	} catch (err) {
		res.status(500).send('Something went horribly wrong');
		return next(err);
	}
});



module.exports = router;