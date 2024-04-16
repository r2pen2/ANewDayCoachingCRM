/**
 * Formats a UTC date string so that it's easier to read
 * @param {Date} date string representing a UTC date
 * @returns {String} date formatted as a string in the format "month/day/year"
 */
export function getSlashDateString(date) {
  // Make sure we have a valid date object
  const d = new Date(date);
  
  // Break it down into its' parts
  const day = d.getUTCDate();
  const month = d.getMonth();
  const year = d.getFullYear();

  // Format and return string
  return `${month + 1}/${day}/${year}`
}