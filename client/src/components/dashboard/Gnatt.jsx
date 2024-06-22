import "@bitnoi.se/react-scheduler/dist/style.css";
import { Scheduler } from "@bitnoi.se/react-scheduler";
import { Spoiler } from "@mantine/core";
import { getOrthodoxDate } from "../../api/dates.ts";

export const CRMGnatt = ({isLoading, assignments, userSubjects}) => {

  return (
    <Spoiler maxHeight={400} style={{minHeight: 400}} showLabel="Expand Gnatt Chart" hideLabel="Collapse Gnatt Chart">
      <Scheduler
        data={formatAssignmentDataForGnatt(assignments, userSubjects)}
        isLoading={isLoading}
        onRangeChange={(newRange) => console.log(newRange)}
        onTileClick={(clickedResource) => console.log(clickedResource)}
        onItemClick={(item) => console.log(item)}
        config={{
          zoom: 0,
        }}
      />
    </Spoiler>
  );
}

function formatAssignmentDataForGnatt(assignments, userSubjects) {

  assignments = assignments.filter(assignment => !assignment.completed)

  const data = [];

  function addSubject(subject) {
    data.push({
      id: subject,
      label: { title: "Joe Doe", },
      data: []
    })
  }

  function getSubject(subject) {
    return data.find((d) => d.id === subject);
  }

  for (const assignment of assignments) {
    const s = getSubject(assignment.subject);
    if (!s) {
      addSubject(assignment.subject);
      s.data.push({
        startDate: getOrthodoxDate(assignment.startDate),
        endDate: getOrthodoxDate(assignment.dueDate),
        occupancy: 3600,
        title: assignment.description,
        bgColor: userSubjects[assignment.subject].color
      })
    }
  }

  console.log(assignments)
  return data;
}

const mockedSchedulerData = [
  {
    id: "070ac5b5-8369-4cd2-8ba2-0a209130cc60",
    label: {
      title: "Joe Doe",
      subtitle: "Frontend Developer"
    },
    data: [
      {
        id: "8b71a8a5-33dd-4fc8-9caa-b4a584ba3762",
        startDate: new Date("2023-04-13T15:31:24.272Z"),
        endDate: new Date("2023-08-28T10:28:22.649Z"),
        occupancy: 3600,
        title: "Project A",
        subtitle: "Subtitle A",
        description: "array indexing Salad West Account",
        bgColor: "rgb(254,165,177)"
      },
      {
        id: "22fbe237-6344-4c8e-affb-64a1750f33bd",
        startDate: new Date("2023-10-07T08:16:31.123Z"),
        endDate: new Date("2023-11-15T21:55:23.582Z"),
        occupancy: 2852,
        title: "Project B",
        subtitle: "Subtitle B",
        description: "Tuna Home pascal IP drive",
        bgColor: "rgb(254,165,177)"
      },
      {
        id: "3601c1cd-f4b5-46bc-8564-8c983919e3f5",
        startDate: new Date("2023-03-30T22:25:14.377Z"),
        endDate: new Date("2023-09-01T07:20:50.526Z"),
        occupancy: 1800,
        title: "Project C",
        subtitle: "Subtitle C",
        bgColor: "rgb(254,165,177)"
      },
      {
        id: "b088e4ac-9911-426f-aef3-843d75e714c2",
        startDate: new Date("2023-10-28T10:08:22.986Z"),
        endDate: new Date("2023-10-30T12:30:30.150Z"),
        occupancy: 11111,
        title: "Project D",
        subtitle: "Subtitle D",
        description: "Garden heavy an software Metal",
        bgColor: "rgb(254,165,177)"
      }
    ]
  }
];
