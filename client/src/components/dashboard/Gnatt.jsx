// import { Scheduler } from "crm-gnatt";
import { Spoiler } from "@mantine/core";
import { getOrthodoxDate } from "../../api/dates.ts";
// import "../../libraries/CRM-Gnatt/dist/style.css"

import "../../assets/style/gnatt.css"

export const CRMGnatt = ({isLoading, assignments, userSubjects}) => {

  return (
    <Spoiler maxHeight={400} style={{minHeight: 400}} showLabel="Expand Gnatt Chart" hideLabel="Collapse Gnatt Chart">
      {/* <Scheduler
        data={formatAssignmentDataForGnatt(assignments, userSubjects)}
        isLoading={isLoading}
        onRangeChange={(newRange) => console.log(newRange)}
        onTileClick={(clickedResource) => console.log(clickedResource)}
        onItemClick={(item) => console.log(item)}
        config={{
          zoom: 0,
        }}
      /> */}
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