/* eslint no-console:0 */
var LoggerBase = require('../lib/base/LoggerBase');

/**
 * Creates browser logger.
 * @param {Object} $config
 * @param {Window} $window
 * @param {Object} $uhr
 * @constructor
 */
class Logger extends LoggerBase {
  constructor ($config) {
    super();

    this._config = $config;
    this._config.logger = this._config.logger || {};

    this.addEnrichment((log) => log.from = 'Browser');

    this.addTransport(Logger._consoleTransport);

    this._setLevels(this._config.logger.levels);

    this.debug = this.debug.bind(this);
    this.trace = this.trace.bind(this);
    this.info = this.info.bind(this);
    this.warn = this.warn.bind(this);
    this.error = this.error.bind(this);
    this.fatal = this.fatal.bind(this);
    this.onerror = this.onerror.bind(this);
  }

  /**
   * Catberry UHR reference
   * @type {UHR}
   * @private
   */
  _uhr = null;

  /**
   * Browser window reference
   *
   * @type {Window}
   * @private
   */
  _window = null;

  /**
   * Catberry logger config reference
   * @type {Object}
   * @private
   */
  _config = null;

  /**
   * Browser logger transports.
   *
   * @type {Array}
   * @private
   */
  _transports = [];

  /**
   * Add log messages transport.
   *
   * @param {function} transport
   */
  addTransport (transport) {
    if (typeof transport !== 'function') {
      this.error(new TypeError('transport must be a function'));
      return;
    }

    this._transports.push(transport);
  }

  /**
   * Add log messages transport.
   *
   * @param {function} transport
   */
  removeTransport (transport) {
    var index = this._transports.indexOf(transport);

    if (index === -1) {
      this.info('Transport not found. Remove nothing');
      return;
    }

    this._transports.splice(index, 1);
  }

  dropTransports () {
    this._transports = [];
  }

  /**
   * Window error event handler.
   *
   * @param {ErrorEvent} error
   * @param {String} message
   * @param {Number} lineno - line number
   * @param {Number} colno - column number
   * @param {String} filename - script
   */
  onerror ({ message, filename, lineno, colno, error }) {
    this._log('error', message, {
      stack: error.stack,
      filename: filename,
      line: `${lineno}:${colno}`
    });
  }

  /**
   * Logs trace message.
   * @param {string|Object|Error} message Error object or message.
   * @param {Object|undefined} meta
   */
  trace (message, meta = {}) {
    if (!this._levels.trace) {
      return;
    }

    this._log('trace', message, meta);
  }

  /**
   * Logs trace message.
   * @param {string|Object|Error} message Error object or message.
   * @param {Object|undefined} meta
   */
  debug (message, meta = {}) {
    if (!this._levels.debug) {
      return;
    }

    this._log('debug', message, meta);
  }

  /**
   * Logs info message.
   * @param {string|Object|Error} message Error object or message.
   * @param {Object|undefined} meta
   */
  info (message, meta = {}) {
    if (!this._levels.info) {
      return;
    }

    this._log('info', message, meta);
  }

  /**
   * Logs warn message.
   * @param {string|Object|Error} message Error object or message.
   * @param {Object|undefined} meta
   */
  warn (message, meta = {}) {
    if (!this._levels.warn) {
      return;
    }

    this._log('warn', message, meta);
  }

  /**
   * Logs error message.
   * @param {string|Object|Error} message Error object or message.
   * @param {Object|undefined} meta
   */
  error (message, meta = {}) {
    if (!this._levels.error) {
      return;
    }

    this._log('error', message, meta);
  }

  /**
   * Logs error message.
   * @param {string|Object|Error} message Error object or message.
   * @param {Object|undefined} meta
   */
  fatal (message, meta = {}) {
    if (!this._levels.fatal) {
      return;
    }

    this._log('fatal', message, meta);
  }

  /**
   * Transport to browser console.
   * @param {string} level
   * @param {Object} log
   */
  static _consoleTransport (level, log) {
    var map = {
      trace: 'log',
      debug: 'log',
      info: 'info',
      warn: 'warn',
      error: 'error',
      fatal: 'error'
    };

    if (console[map[level]]) {
      console[map[level]](`[${level.toUpperCase()}]`, log.message);
    }
  }

  _log (level, error, data) {
    var { message, fields } = this._errorFormatter(error);
    var meta = Object.assign({}, fields, data);

    var log = { message, ...meta };

    this._enrichLog(log, level);

    this._transports.forEach((transport) => transport(level, log));
  }
}

module.exports = Logger;
