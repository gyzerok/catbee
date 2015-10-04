var CatberryBase = require('../lib/base/CatberryBase');

class Catberry extends CatberryBase {
  /**
   * Creates new instance of the browser version of Catberry.
   * @constructor
   * @extends CatberryBase
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
   * Wraps current HTML document with Catberry event handlers.
   */
  wrapDocument () {
    this._router = this.locator.resolve('requestRouter');
  }

  /**
   * Starts Catberry application when DOM is ready.
   * @returns {Promise} Promise for nothing.
   */
  startWhenReady () {
    if (window.catberry) {
      return Promise.resolve();
    }

    return new Promise((fulfill) => {
      window.document.addEventListener('DOMContentLoaded', () => {
        this.wrapDocument();
        window.catberry = this;
        fulfill();
      });
    });
  }
}

module.exports = Catberry;
