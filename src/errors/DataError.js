class DataError extends Error {
  constructor(message) {
    super(message);
    this.name = 'DataError';
    this.statusCode = 422;
  }
}

module.exports = DataError;
