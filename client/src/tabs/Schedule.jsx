import { Blockquote, Loader, LoadingOverlay } from '@mantine/core'
import React, { useEffect, useRef, useState } from 'react'
import "../assets/style/schedule.css";
import { IconInfoCircle } from '@tabler/icons-react';

const scheduleLink = "https://calendar.google.com/calendar/appointments/schedules/AcZssZ2J3ZABQTIlgx_Exw3x8rZU6w_jmcQOhL_S99FeVu1B4BXLWwMO-XX6c_73b8p_3fyLDKiYpVWU?gv=true"

export default function Schedule() {
  

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

  return (
    <div style={{height: "100vh", position: "relative"}} className='d-flex flex-column align-items-center justify-content-center'>
      <LoadingNotif />
      <iframe ref={iframeRef} onLoad={handleIframeLoad} title="Schedule" src={scheduleLink} style={{border: 0, position: "absolute"}} width="100%" height="100%" frameborder="0" />
      
      <Blockquote color="blue" icon={<IconInfoCircle />} mt="xl" style={{position: "absolute", bottom: 0}}>
        1. This is awesome! I hadn't realized that we could just add a Google Scheduler right into the page. This little suite seems to be coming together nicely.
      </Blockquote>
    </div>
  )
}
