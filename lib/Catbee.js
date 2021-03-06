var CatbeeBase = require('./base/CatbeeBase');

class Catbee extends CatbeeBase {
  /**
   * Creates new instance of the server-side Catbee.
   * @constructor
   * @extends CatbeeBase
   */
  constructor () {
    super();
  }

  /**
   * Current request router.
   * @type {RequestRouter}
   * @private
   */
  _router = null;

  /**
   * Gets connect/express middleware.
   * @returns {Function} Middleware function.
   */
  getMiddleware () {
    this._router = this.locator.resolve('requestRouter');
    return this._router.route.bind(this._router);
  }

  /**
   * Builds browser bundle.
   * @returns {Promise} Promise for nothing.
   */
  build () {
    var builder = this.locator.resolve('browserBundleBuilder');
    return builder.build();
  }
}

module.exports = Catbee;
