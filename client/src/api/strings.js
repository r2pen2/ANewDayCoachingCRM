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

/**
 * Formats a UTC date string so that it's easier to read
 * @param {Date} date string representing a UTC date
 * @returns {String} date formatted as a string in the format "Month Day, Year"
 */
export function getVerboseDateString(date) {
  // Make sure we have a valid date object
  const d = new Date(date);
  
  // Break it down into its' parts
  const day = d.getUTCDate();
  const month = d.getMonth();
  const year = d.getFullYear();

  // Format and return string
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  return `${months[month]} ${day}, ${year}`;
}


/**
 * Formats a UTC date string's time
 * @param {Date} date string representing a UTC date
 * @returns {String} date's time as a string in the format "hh:mm AM/PM"
 */
export function getEventTime(date) {
  
  // Make sure we have a valid date object
  const d = new Date(date);

  // Get the hours and minutes
  const hours = d.getHours();
  const minutes = d.getMinutes();

  // Determine if it's AM or PM
  const ampm = hours >= 12 ? 'PM' : 'AM';

  // Convert hours to 12-hour format
  const formattedHours = hours % 12 || 12;

  // Format and return string
  return `${formattedHours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
  
  
}