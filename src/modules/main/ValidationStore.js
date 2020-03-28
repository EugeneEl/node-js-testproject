/**
 *
 */
class ValidationStore {
  constructor() {
    this._schemas = {};
  }

  /**
   * @param {object} newSchema - {  }
   */
  set(newSchema) {
    this._schemas = { ...this.schemas, ...newSchema };
  }

  get schemas() {
    return this._schemas;
  }
}

module.exports = new ValidationStore();
