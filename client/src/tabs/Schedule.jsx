import { Loader, Paper } from '@mantine/core'
import React, { useEffect, useRef, useState } from 'react'
import "../assets/style/schedule.css";
import { mockEvents } from '../api/calendar.ts';
import { getEventTime, getVerboseDateString } from '../api/strings.js';
import { LinkMaster } from '../api/links.ts';

const EventCard = ({event}) => {
  return (
    <Paper withBorder className="p-2 mt-2 mb-2" style={{marginRight: "1rem", cursor: "pointer", minWidth: 200}} onClick={() => window.open(event.href, "_blank")}>
      <strong>{event.summary}</strong>
      <p style={{marginBottom: 0}}>{getVerboseDateString(event.startAt)}</p>
      <p style={{marginBottom: 0}}>{getEventTime(event.startAt)} - {getEventTime(event.endAt)}</p>
    </Paper>
  )
}

export default function Schedule() {
  
  const [events, setEvents] = useState(mockEvents);

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
        My Upcoming Appointments:
      </h2>
      <div className="d-flex flex-row w-100 event-list pb-2" style={{overflowX: "scroll", flexWrap: "nowrap"}}>
        {events.map((event, index) => <EventCard key={index} event={event} />)}
      </div>
    </div>,
    <div style={{height: "100vh", position: "relative"}} className="d-flex flex-column align-items-center justify-content-center">
      <LoadingNotif />
      <iframe ref={iframeRef} onLoad={handleIframeLoad} title="Schedule" src={LinkMaster.schedule.calendarEmbed} style={{border: 0, position: "absolute"}} width="100%" height="100%" frameBorder="0" />
    </div>
  ]
}
