import { Blockquote, Loader, LoadingOverlay, Paper } from '@mantine/core'
import React, { useEffect, useRef, useState } from 'react'
import "../assets/style/schedule.css";
import { IconInfoCircle } from '@tabler/icons-react';
import { mockEvents } from '../api/calendar.ts';
import { getEventTime, getSlashDateString, getVerboseDateString } from '../api/strings.js';

const scheduleLink = "https://calendar.google.com/calendar/appointments/schedules/AcZssZ2J3ZABQTIlgx_Exw3x8rZU6w_jmcQOhL_S99FeVu1B4BXLWwMO-XX6c_73b8p_3fyLDKiYpVWU?gv=true"

const EventCard = ({event}) => {
  return (
    <Paper w="200px" withBorder className="p-2 mt-2 mb-2" style={{cursor: "pointer"}} onClick={() => window.open(event.href, "_blank")}>
      <strong>{event.summary}</strong>
      <p style={{marginBottom: 0}}>{getVerboseDateString(event.startAt)}</p>
      <p style={{marginBottom: 0}}>{getEventTime(event.startAt)} - {getEventTime(event.endAt)}</p>
    </Paper>
  )
}

export default function Schedule() {
  
  const [events, setEvents] = useState(mockEvents);

  console.log(events);

  const [isMounted, setIsMounted] = useState(false);
  const iframeRef = useRef(null);

  const handleIframeLoad = () => {
    setIsMounted(true);
  };

  const LoadingNotif = () => {
    if (isMounted) { return; }
    return (
      <div className="d-flex flex-column align-items-center justify-content-center">
        <Loader />
        <p>Fetching Calendar...</p>
      </div>
    )
  }

  return [
    <div className='d-flex flex-column align-items-start justify-content-start p-4'>
      <h2>
        My Appointments:
      </h2>
      <div className="d-flex flex-row w-100" style={{overflowX: "scroll"}}>
        {events.map((event, index) => <EventCard key={index} event={event} />)}
      </div>
    </div>,
    <div style={{height: "100vh", position: "relative"}} className="d-flex flex-column align-items-center justify-content-center">
      <LoadingNotif />
      <iframe ref={iframeRef} onLoad={handleIframeLoad} title="Schedule" src={scheduleLink} style={{border: 0, position: "absolute"}} width="100%" height="100%" frameBorder="0" />
    </div>
  ]
}
