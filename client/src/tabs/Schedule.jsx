// Library Imports
import { useRef, useState } from "react";
import { Loader, Paper } from "@mantine/core";

// API Imports
import { getEventTime, getVerboseDateString } from "../api/strings.js";
import { LinkMaster } from "../api/links.ts";
import { mockEvents } from "../api/calendar.ts";

// Style Imports
import "../assets/style/schedule.css";


export default function Schedule() {
  return (
    <div>
      <AppointmentList />
      <CalendarFrame />
    </div>
  )
}

/**
 * A list of upcoming appointments from the google calendar API. Each item is a clickable Paper component.
 * todo: This should fetch data from the Google Calendar API.
 */
function AppointmentList() {

  const [events, setEvents] = useState(mockEvents);
  
  /**
   * Renders an upcoming event in a Paper component. Clicking on the event opens the calendar item in a new tab.
   * @param {any} event - Event JSON data from Google Calendar API 
   */
  const EventCard = ({event}) => {
    return (
      <Paper withBorder className="p-2 mt-2 mb-2" style={{marginRight: "1rem", cursor: "pointer", minWidth: 200}} onClick={() => window.open(event.href, "_blank")}>
        <strong>{event.summary}</strong>
        <p style={{marginBottom: 0}}>{getVerboseDateString(event.startAt)}</p>
        <p style={{marginBottom: 0}}>{getEventTime(event.startAt)} - {getEventTime(event.endAt)}</p>
      </Paper>
    )
  }

  return (
    <div className='d-flex flex-column align-items-start justify-content-start p-4'>
      <h2>My Upcoming Appointments:</h2>
      <div className="d-flex flex-row w-100 event-list pb-2" style={{overflowX: "scroll", flexWrap: "nowrap"}}>
        {events.map((event, index) => <EventCard key={index} event={event} />)}
      </div>
    </div>
  )
}

function CalendarFrame() {
  
  const [isMounted, setIsMounted] = useState(false);
  const iframeRef = useRef(null);

  /** When the iframe loads, set that it's mounted and hide the loading indicator */
  const handleIframeLoad = () => { setIsMounted(true); };

  /** Display a loading indicator when the iframe has not been completely mounted */
  const LoadingNotif = () => {
    if (isMounted) { return; }
    return (
      <div className="d-flex flex-column align-items-center justify-content-center">
        <Loader />
        <p>Fetching Calendar...</p>
      </div>
    )
  }

  return (
    <div style={{height: "100vh", position: "relative"}} className="d-flex flex-column align-items-center justify-content-center">
      <LoadingNotif />
      <iframe ref={iframeRef} onLoad={handleIframeLoad} title="Schedule" src={LinkMaster.schedule.calendarEmbed} style={{border: 0, position: "absolute"}} width="100%" height="100%" frameBorder="0" />
    </div>
  )
}