const exceptionForUndefined = (name) => {
  throw new Error(`Middleware ${name} should not be undefined!`);
};

/**
 * 
 */
class MiddlewareStorage {
  constructor() {
    this._middlewares = {};
  }

  /**
   * @param {object} newMiddleware - { validation: (req, res, next) => {} }
   */
  set(newMiddleware = {}) {
    for (const key in newMiddleware) {
      if (newMiddleware.hasOwnProperty(key)) {
        if (!newMiddleware[key]) exceptionForUndefined(key);
      }
    }
    this._middlewares = { ...this.middlewares, ...newMiddleware };
  }

  get middlewares () {
    return this._middlewares;
  }
}

module.exports = new MiddlewareStorage();
