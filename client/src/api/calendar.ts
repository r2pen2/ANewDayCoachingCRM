import { google } from 'googleapis';
const apiKey = "AIzaSyC5ZVmYG2Zy4libVavKPB_Nd3esgAyvwH0"
const clientId = "528674261946-th0qdq598qr8l0oink7p3lepl4svbnc2.apps.googleusercontent.com"

export function getCalendarEvents() {
  fetch("calendar/events").then((res) => {
    console.log(res)
  })
}

const mockEventData = {
  "events":[{"kind":"calendar#event","etag":"\"3428838388434000\"","id":"_7124cgi484skaba4851j0b9k8ork8b9p652jaba36h230c1n8514cd1k8k","status":"confirmed","htmlLink":"https://www.google.com/calendar/event?eid=XzcxMjRjZ2k0ODRza2FiYTQ4NTFqMGI5azhvcms4YjlwNjUyamFiYTM2aDIzMGMxbjg1MTRjZDFrOGsgam9lZG9iYmVsYWFyQG0","created":"2024-04-29T19:32:56.000Z","updated":"2024-04-29T19:33:14.217Z","summary":"Karen bday celebrate ","creator":{"email":"julwrr@gmail.com"},"organizer":{"email":"julwrr@gmail.com"},"start":{"dateTime":"2024-05-19T15:00:00-04:00","timeZone":"America/New_York"},"end":{"dateTime":"2024-05-19T19:00:00-04:00","timeZone":"America/New_York"},"iCalUID":"8DFBDA9E-DAC0-4F7D-91E5-C4D007ABF44E","sequence":0,"attendees":[{"email":"julwrr@gmail.com","organizer":true,"responseStatus":"accepted"},{"email":"jdobbelaar@gmail.com","displayName":"Joshua Dobbelaar","responseStatus":"needsAction"},{"email":"joedobbelaar@gmail.com","self":true,"responseStatus":"needsAction"}],"reminders":{"useDefault":true},"eventType":"default"},]
}

export class EventWrapper {

  href: string;
  createdAt: Date;
  startAt: Date;
  endAt: Date;
  summary: string;
  organizer: string;
  id: string;

  constructor(event: any) {
    this.href = event.htmlLink
    this.createdAt = new Date(event.created)
    this.startAt = new Date(event.start.dateTime)
    this.endAt = new Date(event.end.dateTime)
    this.summary = event.summary
    this.organizer = event.organizer
    this.id = event.id
  }
}

export const mockEvents = mockEventData.events.map((event) => new EventWrapper(event))
