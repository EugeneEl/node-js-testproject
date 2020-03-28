/**
 *
 */
class RouteStore {
  constructor() {
    this._routes = {};
  }

  /**
   * @param {object} newRoute - {  }
   */
  set(newRoute) {
    this._routes = { ...this._routes, ...newRoute };
  }

  /**
   * 
   */
  get routes() {
    return this._routes;
  }
}

module.exports = new RouteStore();
