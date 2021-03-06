/**
 * @copyright (c) 2015 Xu Jin
 * @licence MIT
 */

/**
 * koa2 middleware for Nunjucks
 * @module koa-nunjucks2
 */

'use strict';

const isFunction = require('lodash/isFunction');
const isString = require('lodash/isString');
const assign = require('lodash/assign');
const merge = require('lodash/merge');
const partial = require('lodash/partial');
const nunjucks = require('nunjucks');

const defaultConfig = {
    /**
     * Template name suffix
     */
    suffix: '.html',
    /**
     * Response Header：Content-Type
     */
    contentType: 'text/html; charset=UTF-8',
    renderToResponseBody: true
};

/**
 * Create koa middleware for Nunjucks
 * @param {String} [templatesPath] Where is the templates
 * @param {Object} [nunjucksOptions] the options of nunjucks
 * @param {{suffix: String, contentType: String, renderToResponseBody: Boolean}} [extConfig] Extended config of this middleware
 * @param {Function} [callback] The environment will pass to the callback function, it can be used to add filters and so on.
 * @returns {Function}
 */
module.exports = function (templatesPath, nunjucksOptions, extConfig, callback) {
    let environment = nunjucks.configure(templatesPath, nunjucksOptions);
    if(isFunction(callback)) {
        callback(environment);
    }

    extConfig = assign({}, defaultConfig, extConfig);

    return function (ctx, next) {
        /**
         * Render the template
         * @param name Template name
         * @param context Hash object
         * @return {Promise}
         */
        ctx.render = partial(function (environment, extConfig, name, context) {
            return new Promise(partial(function (koaContext, resolve, reject) {
                if(isString(name) && name.length > 0) {
                    environment.render(isString(extConfig.suffix) && extConfig.suffix.length > 0 ? name + extConfig.suffix : name, merge({}, koaContext.state, context), partial(function (extConfig, error, result) {
                        if(error) {
                            reject(error);
                        } else {
                            if(extConfig.renderToResponseBody === true) {
                                koaContext.type = extConfig.contentType;
                                koaContext.body = result;
                                resolve();
                            } else {
                                resolve(result);
                            }
                        }
                    }, extConfig));
                } else {
                    resolve();
                }
            }, this));
        }, environment, extConfig);

        return next();
    }
};