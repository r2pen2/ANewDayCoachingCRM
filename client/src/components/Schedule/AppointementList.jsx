import { useState } from "react";
import { mockEvents } from "../../api/calendar.ts";
import { Paper } from "@mantine/core";
import { getEventTime, getVerboseDateString } from "../../api/strings.js";

const EventCard = ({event}) => {
  return (
    <Paper withBorder className="p-2 mt-2 mb-2" style={{marginRight: "1rem", cursor: "pointer", minWidth: 200}} onClick={() => window.open(event.href, "_blank")}>
      <strong>{event.summary}</strong>
      <p style={{marginBottom: 0}}>{getVerboseDateString(event.startAt)}</p>
      <p style={{marginBottom: 0}}>{getEventTime(event.startAt)} - {getEventTime(event.endAt)}</p>
    </Paper>
  )
}

export function AppointmentList() {

  const [events, setEvents] = useState(mockEvents);

  return (
    <div className='d-flex flex-column align-items-start justify-content-start p-4'>
      <h2>
        My Upcoming Appointments:
      </h2>
      <div className="d-flex flex-row w-100 event-list pb-2" style={{overflowX: "scroll", flexWrap: "nowrap"}}>
        {events.map((event, index) => <EventCard key={index} event={event} />)}
      </div>
    </div>
  )
}