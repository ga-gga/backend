const isEmpty = (value) => {
  return value === null || value === undefined || value === '';
};

const isValidNumber = (value) => {
  return !isEmpty(value) && !isNaN(Number(value));
};

const isValidDateString = (dateString) => {
  if (isEmpty(dateString)) return false;
  const date = new Date(dateString);
  return !isNaN(date.getTime());
};

const is12DigitTimestamp = (timestamp) => {
  return typeof timestamp === 'string' && timestamp.length === 12 && /^\d{12}$/.test(timestamp);
};

module.exports = {
  isEmpty,
  isValidNumber,
  isValidDateString,
  is12DigitTimestamp,
};
