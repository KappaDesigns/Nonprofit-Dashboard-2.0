const util = require('../util'); 
const Logger = require('../util/Logger');
const logger = Logger('request_validator', ['error', 'debug']);

/**
 * @description a module that will validate all request
 * parameteres and give error feedback when parameters do not match up
 * @module lib/RequestValidator
 */

/**
 * @description takes in a request object and an array of
 * parameter configuration and ensures that all query parameters
 * of the req exist and match the configured parameters
 * @param {Object} req the http request object generated by express
 * @param {Object} res the http response object generated by express
 * @param {Function} next the next layer of the middleware from express
 * @param {Object} configs array of parameter configs
 */
function validateQuery(req, res, next, configs) {
	logger.debug(`Query: ${JSON.stringify(req.query)}`);
	return validate(req.query, res, next, configs, 'query');
}

/**
 * @description takes in a request object and an array of
 * parameter configuration and ensures that all parameters
 * of the req exist and match the configured parameters
 * @param {Object} req the http request object generated by express
 * @param {Object} res the http response object generated by express
 * @param {Function} next the next layer of the middleware from express
 * @param {Object} configs array of parameter configs
 */
function validateParams(req, res, next, configs) {
	logger.debug(`Params: ${JSON.stringify(req.params)}`);
	return validate(req.params, res, next, configs, 'params');
}

/**
 * @description takes in a request object and an array of
 * parameter configuration and ensures that all parameters
 * of the req exist and match the configured parameters
 * @param {Object} req the http request object generated by express
 * @param {Object} res the http response object generated by express
 * @param {Function} next the next layer of the middleware from express
 * @param {Object} configs array of parameter configs
 * @returns {Object} returns an error object when the parameters 
 * do not match, other wise it returns null
 */
function validateBody(req, res, next, configs) {
	logger.debug(`body: ${JSON.stringify(req.body)}`);
	return validate(req.body, res, next, configs, 'body');
}

/**
 * @description Helper method to all validate methods. Does all of the logical checks
 * and generates the error objects to be returned
 * @param {Object} req the http request object generated by express
 * @param {Object} res the http response object generated by express
 * @param {Function} next the next layer of the middleware from express
 * @param {Object} configs array of parameter configs 
 * @param {String} reqObjType the key at which the req object is being validated
 * @returns {Object} returns an error object when the parameters 
 * do not match, other wise it returns null 
 */
function validate(req, res, next, configs, reqObjType) {
	if (!req) {
		const error = new Error(`No ${reqObjType} attached to the request object`);
		logger.error(error);
		return util.handleError(error, 400, res);
	}

	//ensures that hasOwnProperty exists on the object
	req = Object.assign({}, req);
	reqObjType = util.capitalizeString(reqObjType);

	for (let i = 0; i < configs.length; i++) {
		let config = configs[i];
		let prop = config['property'];

		logger.debug(`Param Config: ${JSON.stringify(config)}`);
		logger.debug(`prop: ${prop}`);

		if (!req.hasOwnProperty(prop)) {
			const err = new Error(`${reqObjType} does not contain a ${prop} property.`);
			return util.handleError(err, 400, res, next);
		}

		let value = req[prop];
		logger.debug(`value: ${value}`);

		if (config.hasOwnProperty('type')) {
			let type = getType(value);
			logger.debug(`type: ${type.toLowerCase()} | config type: ${config.type.toLowerCase()}`);

			if (type.toLowerCase() !== config.type.toLowerCase()) {
				const err = new Error(`The ${reqObjType} value of ${prop} does not match the type of ${config.type}`);
				return util.handleError(err, 400, res, next);
			}
		}
	}
	return null;
}

/**
 * @description Takes in a string value and gets the
 * primative type of the string value
 * @param {String} value 
 * @returns {String} returns the string representation of
 * the primative value
 */
function getType(value) {
	//handle numbers
	let type = Number(value);
	if (!isNaN(type)) {
		return 'number';
	}

	//handle null and undefined
	if (value === 'null') {
		return value;
	}
	if (type === 'undefined') {
		return type;
	}

	//handle booleans
	if (value === 'true') {
		return 'boolean';
	} else if (value == 'false') {
		return 'boolean';
	}

	//handles objects
	try {
		let j = JSON.parse(value);
		if (Array.isArray(j)) {
			return 'array';
		} if (typeof j === 'object') {
			return 'object';
		}
	} catch(err) {
		//handle string
		return 'string';
	}
}

module.exports = {
	queries: require('../configs/queries.json'),
	validateQuery: validateQuery,
	validateBody: validateBody,
	validateParams: validateParams,
};