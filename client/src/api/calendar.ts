import { google } from 'googleapis';
const apiKey = "AIzaSyC5ZVmYG2Zy4libVavKPB_Nd3esgAyvwH0"
const clientId = "528674261946-th0qdq598qr8l0oink7p3lepl4svbnc2.apps.googleusercontent.com"

export function getCalendarEvents() {
  fetch("calendar/events").then((res) => {
    console.log(res)
  })
}