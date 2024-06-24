import { Scheduler } from "@r2pen2/crm-gnatt";
import { Spoiler, useMantineColorScheme } from "@mantine/core";
import { getOrthodoxDate } from "../../api/dates.ts";
import "@r2pen2/crm-gnatt/dist/style.css"

import "../../assets/style/gnatt.css"
import { getGnattDayString, getSlashDateString } from "../../api/strings.js";

export const CRMGnatt = ({isLoading, assignments, userSubjects}) => {

  const gnattData = formatAssignmentDataForGnatt(assignments, userSubjects);

  const {colorScheme} = useMantineColorScheme()

  return (
    <Spoiler maxHeight={400} style={{minHeight: 400}} showLabel="Expand Gnatt Chart" hideLabel="Collapse Gnatt Chart">
      <Scheduler data={gnattData} isLoading={isLoading} zoom={0} dark={colorScheme !== "light"} onTileClick={(t) => console.log(t)}/>
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
        bgColor: userSubjects[assignment.subject].color,
        description: `${getSlashDateString(getOrthodoxDate(assignment.startDate))} - ${getSlashDateString(getOrthodoxDate(assignment.dueDate))}`
      })
    }
  }

  return gnattData;
}