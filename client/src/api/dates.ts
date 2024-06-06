export function getOrthodoxDate(date: any): Date {
  return !date.toDate ? date : date.toDate()
}