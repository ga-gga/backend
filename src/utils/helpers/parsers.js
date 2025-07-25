const { isValidNumber, isValidDateString, is12DigitTimestamp } = require('./validators');

const safeParseInt = (value, defaultValue = 0) => {
  if (!isValidNumber(value)) {
    return defaultValue;
  }
  return parseInt(value);
};

const safeParseFloat = (value, defaultValue = 0) => {
  if (!isValidNumber(value)) {
    return defaultValue;
  }
  return parseFloat(value);
};

const transformDateString = (dateString) => {
  if (!isValidDateString(dateString)) {
    return null;
  }

  try {
    return new Date(dateString.replace(' ', 'T'));
  } catch (error) {
    console.error(error);
    return null;
  }
};

const transformTimestamp = (timestamp) => {
  if (!is12DigitTimestamp(timestamp)) {
    return null;
  }

  try {
    const year = timestamp.substr(0, 4);
    const month = timestamp.substr(4, 2);
    const day = timestamp.substr(6, 2);
    const hour = timestamp.substr(8, 2);
    const minute = timestamp.substr(10, 2);
    return new Date(`${year}-${month}-${day}T${hour}:${minute}:00`);
  } catch (error) {
    console.error(error);
    return null;
  }
};

module.exports = {
  safeParseInt,
  safeParseFloat,
  transformDateString,
  transformTimestamp,
};
