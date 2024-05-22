import { HomeworkPriority } from "./db/dbHomework.ts";

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

/** Get the time HH:MM of a date */
export function getTimeString(date) {
  date = new Date(date)
  return `${date.getHours() % 12}:${date.getMinutes()}${date.getHours() >= 13 ? "PM" : "AM"}`
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


// Regular expressions to match patterns
export const priorityPattern = /!low|!med(ium)?|!high/i;
export const datePattern = /\b(start|due):(\d{1,2}\/\d{2}(\/(\d{4}|\d{2}))?)/gi;
export const subjectPattern = /#(\w+)/;

export function parseQuickEntry(string) {
  let priority = null;
  let startDate = null;
  let dueDate = null;
  let description = string.trim();
  let subject = null;

  // Extract and set priority
  const priorityMatch = description.match(priorityPattern);
  if (priorityMatch) {
    const priorityKey = priorityMatch[0].toLowerCase();
    if (priorityKey.includes("low")) {
      priority = HomeworkPriority.LOW;
    } else if (priorityKey.includes("med")) {
      priority = HomeworkPriority.MEDIUM;
    } else if (priorityKey.includes("high")) {
      priority = HomeworkPriority.HIGH;
    }
    // Remove the priority from the description
    description = description.replace(priorityPattern, '').trim();
  }

  // Function to handle date parsing and adjustment
  function parseAndAdjustDate(dateStr) {
    console.log(dateStr);
    let [month, day, year] = dateStr.split('/');
    let yearUndefined = false;
    if (year === undefined) { year = new Date().getFullYear(); yearUndefined = true; }
    if (year.length === 2) { year = `20${year}`; }
    year = parseInt(year);
    // year += (year < 50) ? 2000 : 1900;  // Adjust year based on the value
    let date = new Date(year, month - 1, day);

    const today = new Date();
    if (date < today && yearUndefined) {  // Check if the parsed date is in the past
      date.setFullYear(date.getFullYear() + 1);  // Set to the next occurrence
    }
    return date;
  }

  // Extract and set dates for start and due
  let dateMatch;
  while ((dateMatch = datePattern.exec(description)) !== null) {
    const [fullMatch, key, dateStr] = dateMatch;
    const dateObj = parseAndAdjustDate(dateStr);
    if (key.toLowerCase() === 'start') {
      startDate = dateObj;
    } else if (key.toLowerCase() === 'due') {
      dueDate = dateObj;
    }
    // Remove the date from the description
    description = description.replace(fullMatch, '').trim();
    datePattern.lastIndex = 0;
  }

  // Extract and set subject
  const subjectMatch = description.match(subjectPattern);
  if (subjectMatch) {
    subject = subjectMatch[1];
    // Remove the subject from the description
    description = description.replace(subjectPattern, '').trim();
  }

  return {
    priority: priority,
    startDate: startDate,
    dueDate: dueDate,
    subject: subject,
    description: description
  };
}