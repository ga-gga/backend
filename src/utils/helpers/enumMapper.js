const { isEmpty } = require('./validators');

const createEnumMapper = (enumObject, fieldName = '', defaultValue = 'UNKNOWN') => {
  return (value) => {
    if (isEmpty(value)) {
      return defaultValue;
    }

    const mappedValue = enumObject[value];
    if (mappedValue === undefined) {
      console.warn(`fieldName: ${fieldName} - Unmapped value: "${value}"`);
      return defaultValue;
    }

    return mappedValue;
  };
};

module.exports = { createEnumMapper };
