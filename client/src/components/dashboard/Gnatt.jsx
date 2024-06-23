import { Scheduler } from "@r2pen2/crm-gnatt";
import { Spoiler, Text, getThemeColor } from "@mantine/core";
import { getOrthodoxDate } from "../../api/dates.ts";
// import "../../libraries/CRM-Gnatt/dist/style.css"

import "../../assets/style/gnatt.css"
import { useEffect, useRef } from "react";
import { useColorScheme } from "@mantine/hooks";
import { getGnattDayString } from "../../api/strings.js";

const tileWidth = 80;
const tileHeight = 60;
const daysPrior = 7;
const daysAfter = 14;

export const CRMGnatt = ({isLoading, assignments, userSubjects}) => {

  const gnattData = formatAssignmentDataForGnatt(assignments, userSubjects);
  const scheme = useColorScheme();

  const GnattGrid = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      const width = canvas.width;
      const height = canvas.height;

      // Clear the canvas
      context.clearRect(0, 0, width, height);


      // Draw vertical lines
      for (let x = 0; x <= width; x += tileWidth) {
        context.beginPath();
        context.moveTo(x, 0);
        context.lineTo(x, height);
        // context.strokeStyle = scheme === "light" ? "dark.8" : "dark.0";
        context.lineWidth = 0.5;
        context.stroke();
      }

      // Draw horizontal lines
      for (let y = 0; y <= height; y += tileHeight) {
        context.beginPath();
        context.moveTo(0, y);
        context.lineTo(width, y);
        context.strokeStyle = scheme === "light" ? "dark.8" : "dark.0";
        context.lineWidth = 0.5;
        context.stroke();
      }
    }, []);
    
    return (
      <canvas
        ref={canvasRef}
        width={tileWidth * (daysPrior + daysAfter)}
        height={tileHeight * gnattData.length}
      />
    );
  };

  const GnattHeader = () => {
    
    function renderHeader() {
      const days = [];
      for (let i = 0; i < daysPrior; i++) {
        days.push(new Date().setDate(new Date().getDate() - i))
      }
      for (let i = 0; i < daysAfter; i++) {
        days.push(new Date().setDate(new Date().getDate() - i))
      }
      return days.map((day, i) => {

        return (
          <div key={i} className="d-flex flex-column justify-content-center align-items-center" style={{width: tileWidth, height: tileHeight}}>
            <Text>{new Date(day).getUTCDate()}</Text>
          </div>
        )
      })
    }

    return (
      <div className="d-flex flex-row" style={{width: tileWidth * (daysAfter + daysPrior)}}>
        {renderHeader()}
      </div>
    )
  }

  return (
    <Spoiler maxHeight={400} style={{minHeight: 400}} showLabel="Expand Gnatt Chart" hideLabel="Collapse Gnatt Chart">
      <div className="w-100" style={{overflowX: "scroll"}}>
        <GnattHeader />
        <div style={{position: "relative"}}>
          <GnattGrid />
        </div>
      </div>
    </Spoiler>
  );
}

function formatAssignmentDataForGnatt(assignments, userSubjects) {

  assignments = assignments.filter(assignment => !assignment.completed && assignment.startDate && assignment.dueDate)

  const gnattData = [];

  function addSubject(subject) {
    const s = {
      id: subject,
      label: { title: subject, },
      data: []
    }
    gnattData.push(s)
    return s;
  }

  function getSubject(subject) {
    return gnattData.find((d) => d.id === subject);
  }

  for (const assignment of assignments) {
    let s = getSubject(assignment.subject);
    if (!s) {
      s = addSubject(assignment.subject);
      s.data.push({
        startDate: getOrthodoxDate(assignment.startDate),
        endDate: getOrthodoxDate(assignment.dueDate),
        title: assignment.description,
        bgColor: userSubjects[assignment.subject].color
      })
    }
  }

  return gnattData;
}