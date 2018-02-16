const express = require('express');
const Logger = require('../../util/Logger');
const util = require('../../util');
const Site = require('../../lib/site');
const SiteResource = require('../../lib/site-resource');
const Validator = require('../../lib/request-validation');
const QueryConfig = Validator.queries;

const handleError = util.handleError;
const handleSuccess = util.handleSuccess;

const router = express.Router();
const logger = Logger('site_test', ['debug', 'error']);

/**
 * @description This Route file handles the updating, and viewing of
 * files being contained on the admin site.
 */

/**
 * @description gets a queryed resources within the site folder
 */
router.get('/', function handleReq(req, res, next) {
	const queryCheck = QueryConfig.SiteRoute.get;
	let e;
	if ((e = Validator.validateQuery(req, res, next, queryCheck))) {
		return e;
	}
	SiteResource.getFileData(req.query.path, 
		async function handleFile(err, fileData) {
			if (err) {
				logger.error(err);
				return handleError(err, 404, res, next);
			}
			return handleSuccess(fileData, 200, res, next);
		}
	);
});

/**
 * @description Updates the file at a given path within the local site
 */
router.put('/:path', function handleReq(req, res, next) {
	const paramCheck = Validator.queries.SiteRoute.put.params;
	const bodyCheck = Validator.queries.SiteRoute.put.body;
	let e;
	if ((e = Validator.validateParams(req, res, next, paramCheck))) {
		return e;
	}
	if ((e = Validator.validateBody(req, res, next, bodyCheck))) {
		return e;
	}

	SiteResource.getFileData(req.params.path, async function handleFile(err, fileData) {
		if (err) {
			logger.error(err);
			return handleError(err, 404, res, next);
		}
		try {
			await Site.editPage(
				req.body.html, 
				util.globalizePath(req.params.path), 
				req.body.message,
			);
			return handleSuccess({
				message: 'Successfully edited page.',
				editNote: req.body.message,
				newFileData: req.body.html,
				oldFileData: fileData,
			}, 200, res, next);
		} catch (err) {
			logger.error(err);
			return handleError(err, 500, res, next);
		}
	});
});

/**
 * @description updates the site with the current development environment
 */
router.post('/sync', async function handleReq(req, res, next) {
	try {
		const sha = await Site.sync({
			firstName: 'test',
			email: 'test@test.com',
		});
		return handleSuccess({
			sha: sha,
		}, 200, res, next);
	} catch (err) {
		logger.error(err);
		return handleError(err, 500, res, next);
	}
});

/**
 * @description updates the github repository with front end user changes
 */
router.post('/publish', async function handleReq(req, res, next) {
	try {
		const sha = await Site.publish();
		return handleSuccess({
			sha: sha,
		}, 200, res, next);
	} catch (err) {
		logger.error(err);
		return handleError(err, 500, res, next);
	}
});

/**
 * @description handles the reversion of changes to a certain point 
 */
router.post('/revert/:hash', async function handleReq(req, res, next) {
	const paramCheck = Validator.queries.SiteRoute.post;
	let e;
	if ((e = Validator.validateParams(req, res, next, paramCheck))) {
		return e;
	}
	try {
		const sha = await Site.revert(req.params.hash);
		return handleSuccess({
			sha: sha,
		}, 200, res, next);
	} catch (err) {
		logger.error(err);
		return handleError(err, 500, res, next);
	}
});

module.exports = router;