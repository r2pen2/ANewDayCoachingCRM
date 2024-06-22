export function getOrthodoxDate(date: any): Date {
  if(date["_nanoseconds"] !== null && date["_seconds"] !== null) {
    return new Date(date["_seconds"] * 1000 + date["_nanoseconds"] / 1000000)
  }
  return !date.toDate ? date : date.toDate()
}