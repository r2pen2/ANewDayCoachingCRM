import { Loader } from "@mantine/core";
import { LinkMaster } from "../../api/links.ts";
import { useRef, useState } from "react";

export function CalendarFrame() {
  
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
    <div style={{height: "100vh", position: "relative"}} className="d-flex flex-column align-items-center justify-content-center">
      <LoadingNotif />
      <iframe ref={iframeRef} onLoad={handleIframeLoad} title="Schedule" src={LinkMaster.schedule.calendarEmbed} style={{border: 0, position: "absolute"}} width="100%" height="100%" frameBorder="0" />
    </div>
  )
  
}