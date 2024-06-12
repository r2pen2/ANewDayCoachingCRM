import { Paper, RingProgress, SegmentedControl, Text, TextInput } from '@mantine/core'
import React from 'react'
import { CurrentUserContext } from '../../App'
import { HomeworkStatus } from '../../api/db/dbHomework.ts';
import { IconSend, IconSpeedboat } from '@tabler/icons-react';
import IconButton from '../IconButton.jsx';

export default function Progress({setSortType, sortType, quickEntryError, quickEntryString, onQuickEntryChange, onQuickEntryKeyDown, sendQuickEntry, showCompleted, setShowCompleted}) {
  
  const {currentUser} = React.useContext(CurrentUserContext);
  
  const [dataType, setDataType] = React.useState("Subject");
  const [unitType, setUnitType] = React.useState("Count");

  function getSections() {
    const sections = [];
    const incompleteAssignments = currentUser.homework.filter(h => h.status !== HomeworkStatus.COMPLETED);
    
    const subjects = {};

    for (const hw of incompleteAssignments) {
      
      if (unitType === "Count") {
        if (hw.subject in subjects) {
          subjects[hw.subject]++;
        } else {
          subjects[hw.subject] = 1;
        }
      }
    }

    
    for (const subjectKey of Object.keys(subjects)) {
      const count = subjects[subjectKey];
      const val = count / incompleteAssignments.length * 100;
      const createTooltip = () => {
        return `${subjectKey}: ${Math.trunc(val)}%`
      }
      sections.push({value: val, color: currentUser.subjects[subjectKey].color, tooltip: createTooltip()});
    }


    return sections;
  }

  const innerCircleRadius = 240
  const outerCircleRadius = innerCircleRadius + 20
  const backgroundColor = "#D6E3D1"

  const GreenCircle = () => (
    <svg width={innerCircleRadius} height={innerCircleRadius} style={{position: "absolute", top: 10, left: 10, border: "1px solid #00000022", borderRadius: "50%"}}>
      <circle cx={innerCircleRadius / 2} cy={innerCircleRadius / 2} r={innerCircleRadius / 2} fill={backgroundColor} />
    </svg>
  )

  const WhiteSpace = () => (
    <svg width={outerCircleRadius} height={outerCircleRadius} style={{position: "absolute", top: 0, left: 0}}>
      <circle cx={outerCircleRadius / 2} cy={outerCircleRadius / 2} r={outerCircleRadius / 2} fill="white" className="white-space" />
    </svg>
  )

  function handleFilterChange(e) {
    setShowCompleted(e === "All")
  }

  return (
    <div style={{position: 'relative', height: 280}}>
      <Paper className="w-100 text-center d-flex flex-column" style={{position: "absolute", top: 10, left: outerCircleRadius / 2, maxWidth: `calc(100% - ${(outerCircleRadius / 2) + 20}px)`}}>
        <h3 style={{color:"white", fontSize: "2rem", width: "100%", background: "#60A483", paddingTop: "0.5rem", paddingBottom: "0.5rem", }}>My Assignments</h3>
        <div className='d-flex gap-2 flex-row w-100 justify-content-start' style={{marginLeft: outerCircleRadius / 2}}>
          <Paper withBorder className="pt-2">
            <Text size="sm" fw={500} mb={3}>
              Progress Context
            </Text>
            <SegmentedControl data={["Subject", "Deadline"]} />
          </Paper>
          <Paper withBorder className="pt-2">
            <Text size="sm" fw={500} mb={3}>
              Sort Order
            </Text>
            <SegmentedControl onChange={setSortType} value={sortType} data={["Priority", "Due Date", "Start Date", "Subject"]} />
          </Paper>
          <Paper withBorder className="pt-2">
            <Text size="sm" fw={500} mb={3}>
              Filter
            </Text>
            <SegmentedControl data={["Incomplete", "All"]} value={showCompleted ? "All" : "Incomplete"} onChange={handleFilterChange} />
          </Paper>
        </div>
        <div className='mt-2 d-flex gap-2 flex-row w-100 justify-content-start' style={{marginLeft: outerCircleRadius / 2, width: "100%", maxWidth: `calc(100% - ${outerCircleRadius / 2}px)`}}>
          <TextInput error={quickEntryError} placeholder='Quick Entry' className='w-100' leftSection={<IconSpeedboat />} value={quickEntryString} onChange={onQuickEntryChange} onKeyDown={onQuickEntryKeyDown} />
          <IconButton label="Submit" icon={<IconSend />} color="#60A483" buttonProps={{size: 36, variant: "light"}} onClick={sendQuickEntry} />
        </div>
      </Paper>
      <WhiteSpace />
      <GreenCircle />
      <RingProgress
        style={{position: "absolute", top: 0, left: 0,}}
        className="ring"
        size={260}
        thickness={16}
        roundCaps
        label={
          <div className="d-flex flex-row align-items-center justify-content-center gap-2 no-shadow">
          </div>
        }
        sections={getSections()}
      />
    </div>
  )
}
