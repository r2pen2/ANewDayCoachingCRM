// Library Imports
import React, { useContext, useEffect, useState } from 'react'
import { Badge, Button, Modal, Popover, Radio, Select, Table, Text, TextInput, Tooltip } from '@mantine/core'
import { IconPlus, IconSchool, IconSend, IconSpeedboat, IconTrash } from '@tabler/icons-react';

// API Imports
import { getSlashDateString, parseQuickEntry } from '../api/strings.js'

// Component Imports
import { CurrentUserContext } from '../App.jsx';
import { QuickEntryResults } from '../components/dashboard/HomeworkTracker.jsx';

// Style Imports
import '@mantine/carousel/styles.css';
import "../assets/style/dashboard.css"
import { Homework, HomeworkPriority, HomeworkStatus, HomeworkSubject } from '../api/db/dbHomework.ts';
import { notifSuccess } from '../components/Notifications.jsx';
import { DateInput } from '@mantine/dates';
import { shouldUseBlackText } from '../api/color.ts';
import { ToolsList } from '../components/dashboard/ToolsList.jsx';
import { PickerMenu, SubjectCard } from '../components/dashboard/HomeworkTracker.jsx';
import IconButton from '../components/IconButton.jsx';

export default function Dashboard() {
  
  const { currentUser } = useContext(CurrentUserContext)

  const [subjectAddMenuOpen, setSubjectAddMenuOpen] = React.useState(false);
  const [homeworkAddMenuOpen, setHomeworkAddMenuOpen] = React.useState(false);

  return (
    <div>
      <AddSubjectModal currentUser={currentUser} open={subjectAddMenuOpen} close={() => setSubjectAddMenuOpen(false)} />
      <AddHomeworkModal currentUser={currentUser} open={homeworkAddMenuOpen} close={() => setHomeworkAddMenuOpen(false)} />
      <Tracker currentUser={currentUser} setHomeworkAddMenuOpen={setHomeworkAddMenuOpen} setSubjectAddMenuOpen={setSubjectAddMenuOpen}/>
      <ToolsList />
    </div>
  )
}

const AddSubjectModal = ({currentUser, open, close}) => {
  
  const subjects = Object.values(currentUser.subjects).sort((a, b) => a.title.localeCompare(b.title));
  const hasSubjects = subjects.length > 0;

  const [newTitle, setNewTitle] = React.useState("");
  const [newColor, setNewColor] = React.useState("#ffffff");

  const SubjectList = () => {
    if (!hasSubjects) { return <Text>No subjects found. Add some to get started!</Text> }
    return subjects.map((subject, index) => <SubjectCard subject={subject} key={index} />)
  }

  const [error, setError] = React.useState(null);

  function handleFormSubmit(e) {
    e.preventDefault();
    if (Object.keys(currentUser.subjects).includes(newTitle)) { 
      setError("Subject already exists.");
      return;
    }
    const newSubject = new HomeworkSubject(newTitle, newColor);
    currentUser.addSubject(newSubject).then(() => {
      notifSuccess("Subject Added", `Added subject "${newTitle}"`)
    });
  }

  function handleClose() {
    if (popoverOpen) { setPopoverOpen(false); return; }
    setNewTitle("");
    setNewColor("#ffffff");
    close();
  }

  const [popoverOpen, setPopoverOpen] = React.useState(false);
  
  return (
    <Modal opened={open} onClose={handleClose} title="Manage Subjects">
      <form className="d-flex gap-2 mt-1 mb-2" onSubmit={handleFormSubmit}>
        <TextInput className="w-100" required id="title" placeholder="Subject Title" onChange={(e) => { setNewTitle(e.target.value); setError(null) }} error={error}/>
        <PickerMenu c={newColor} setC={setNewColor} popoverOpenOverride={popoverOpen} setPopoverOpenOverride={setPopoverOpen} />
        <IconButton label="Add Subject" icon={<IconSend />} buttonProps={{size: 36}} type="submit" />
      </form>
      <SubjectList />
    </Modal>
  )
}

const Tracker = ({currentUser, setSubjectAddMenuOpen, setHomeworkAddMenuOpen}) => {
  
  const [showCompleted, setShowCompleted] = useState(false)

  const [quickEntryString, setQuickEntryString] = React.useState("");
  const [quickExtract, setQuickExtract] = React.useState({
    subject: null,
    description: null,
    startDate: null,
    dueDate: null,
    priority: null
  });
  
  useEffect(() => {
    extractQuickEntry();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quickEntryString]);  // Dependency array includes quickEntryString

  function extractQuickEntry() {
    const props = parseQuickEntry(quickEntryString);
    for (const key of Object.keys(currentUser.subjects)) {
      if (key && props.subject) {
        if (key.replace(" ", "").toLowerCase() === props.subject.toLowerCase()) {
          props.subject = key;
          break;
        }
      }
    }
    setQuickExtract(props);
    setQuickEntryError(null);
  }

  const [quickEntryError, setQuickEntryError] = useState(null)

  function handleEnter(e) {
    if (e.key !== "Enter") { return; }
    sendQuickEntry();
  }

  function sendQuickEntry() {
    const newHomework = new Homework();
    newHomework.subject = quickExtract.subject;
    newHomework.description = quickExtract.description;
    newHomework.startDate = quickExtract.startDate ? new Date(quickExtract.startDate) : null;
    newHomework.dueDate = quickExtract.dueDate ? new Date(quickExtract.dueDate) : null;
    newHomework.priority = quickExtract.priority ? quickExtract.priority : HomeworkPriority.LOW;
    
    if (!newHomework.subject) { setQuickEntryError("Please specify a subject."); return; }
    if (!currentUser.subjects[newHomework.subject]) { 
      if (window.confirm(`Subject "${newHomework.subject}" does not exist. Would you like to create it?`)) {
        currentUser.addSubject(new HomeworkSubject(newHomework.subject, "#ffffff")).then(() => {
          notifSuccess("Subject Added", `Added subject "${newHomework.subject}"`)
        });
      } else { return; }
    }

    setQuickEntryString("");
    currentUser.addHomework(newHomework).then(() => {
      notifSuccess("Assignment Added", `Added assignment: "${newHomework.description}"`)
    });
  }

  const [sortType, setSortType] = useState("Priority")
  
  function sortingAlg(a, b) {
    if (sortType === "Priority") {
      return Homework.getPriorityValue(b) - Homework.getPriorityValue(a);
    }
    if (sortType === "Due Date") {
      if (!a.dueDate) { return 1; }
      return a.dueDate - b.dueDate;
    }
    if (sortType === "Start Date") {
      if (!a.startDate) { return 1; }
      return a.startDate - b.startDate;
    }
    if (sortType === "Subject") {
      return a.subject.localeCompare(b.subject);
    }
  }

  return [
    <div className="d-flex justify-content-between" key="headers">
    <h3>Upcoming Assignments</h3>
    <div className="d-flex gap-2 align-items-center">
      <Tooltip label="Show/Hide Completed Assignments">
        <Radio checked={showCompleted} readOnly onClick={() => setShowCompleted(!showCompleted)} />
      </Tooltip>
      <IconButton label="Manage Subjects" icon={<IconSchool />} onClick={() => setSubjectAddMenuOpen(true)} buttonProps={{size: 36}} />
      <IconButton label="Add Assignment" icon={<IconPlus />} onClick={() => setHomeworkAddMenuOpen(true)} buttonProps={{size: 36}} />
      <Select data={["Priority", "Due Date", "Start Date", "Subject"]} value={sortType} onChange={setSortType} />
    </div>
  </div>,
  <div className="d-flex gap-2" key="controls">
    <TextInput error={quickEntryError} placeholder='Quick Entry' className='w-100' leftSection={<IconSpeedboat />} value={quickEntryString} onChange={(e) => { setQuickEntryString(e.target.value); extractQuickEntry(); }} onKeyDown={handleEnter} />
    <IconButton label="Submit" icon={<IconSend />} buttonProps={{size: 36}} onClick={sendQuickEntry} />
  </div>,
    <QuickEntryResults key="quick-results" quickExtract={quickExtract} />,
    <Table.ScrollContainer minWidth={500} type="native" key="table">
    <Table striped>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>
            Subject
          </Table.Th>
          <Table.Th>
            Assignment
          </Table.Th>
          <Table.Th>
            Status
          </Table.Th>
          <Table.Th>
            Est Time
          </Table.Th>
          <Table.Th>
            Priority
          </Table.Th>
          <Table.Th>
            Start Date
          </Table.Th>
          <Table.Th>
            Due Date
          </Table.Th>
          <Table.Th>
            Actions
          </Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {Object.values(currentUser.homework).filter(hw => hw.status !== HomeworkStatus.COMPLETED || showCompleted).sort((a, b) => sortingAlg(a, b)).map((homework, index) => {
          
          homework = new Homework(homework);

          const subject = currentUser.subjects[homework.subject]

          function handleStatusChange(s) {

            if (s === homework.status) { return; }
            homework.status = s;
            currentUser.updateHomework(homework).then(() => {
              if (s === HomeworkStatus.COMPLETED) { notifSuccess("Assignment Completed", `Completed assignment: "${homework.description}"`) }
              if (s === HomeworkStatus.IN_PROGRESS) { notifSuccess("Assignment Started", `Started assignment: "${homework.description}"`) }
              if (s === HomeworkStatus.NOT_STARTED) { notifSuccess("Assignment Reset", `Reset assignment: "${homework.description}"`) }
            });
          }

          const AssignmentStatus = () => (
            <Table.Td className="hover-clickable">
              <Popover>
                <Popover.Target>
                  <div className="w-100 h-100 d-flex align-items-start">
                    <Badge color={Homework.getStatusColor(homework)}>{homework.status}</Badge>
                  </div>
                </Popover.Target>
                <Popover.Dropdown>
                  <Select data={Object.values(HomeworkStatus)} value={homework.status} onChange={handleStatusChange} />
                </Popover.Dropdown>
              </Popover>
            </Table.Td>
          )

          const AssignmentSubject = () => (
            <Table.Td className="hover-clickable"><Badge color={subject.color} style={{border: "1px solid #00000022", color: shouldUseBlackText(subject.color) ? "#000000" : "#FFFFFF"}}>{subject.title}</Badge></Table.Td>
          )

          const AssignmentDescription = () => (
            <Table.Td className="hover-clickable">{homework.description}</Table.Td>
          )

          const AssignmentEstimatedTime = () => (
            <Table.Td className="hover-clickable">{homework.estTime}</Table.Td>
          )

          const AssignmentPriority = () => (
            <Table.Td className="hover-clickable"><Badge color={Homework.getPriorityColor(homework)}>{homework.priority}</Badge></Table.Td>
          )

          const AssignmentStartDate = () => (
            <Table.Td className="hover-clickable">{homework.startDate ? getSlashDateString(!homework.startDate.toDate ? homework.startDate : homework.startDate.toDate()) : ""}</Table.Td>
          )

          const AssignmentDueDate = () => (
            <Table.Td className="hover-clickable">{homework.dueDate ? getSlashDateString(!homework.dueDate.toDate ? homework.dueDate : homework.dueDate.toDate()) : ""}</Table.Td>
          )

          const AssignmentActions = () => (
            <Table.Td>
              <IconButton onClick={() => homework.handleRemove(currentUser)} icon={<IconTrash />} buttonProps={{color: "red"}} label="Delete Assignment" />
            </Table.Td>
          )

          return (
            <Table.Tr key={index}>
              <AssignmentSubject />
              <AssignmentDescription />
              <AssignmentStatus />
              <AssignmentEstimatedTime />
              <AssignmentPriority />
              <AssignmentStartDate />
              <AssignmentDueDate />
              <AssignmentActions />
            </Table.Tr>
          )
        })}
      </Table.Tbody>
    </Table>
  </Table.ScrollContainer>
  ]
}

const AddHomeworkModal = ({currentUser, open, close}) => {

  function handleFormSubmit(e) {
    e.preventDefault();
    const subject = document.getElementById('subject').value;
    const description = document.getElementById('description').value;
    const startDate = document.getElementById('start-date').value;
    const dueDate = document.getElementById('due-date').value;
    let priority = document.getElementById('priority').value;
    const estTime = document.getElementById('est-time').value;
    if (!priority) { priority = HomeworkPriority.LOW; }
    
    
    const newHomework = new Homework();
    newHomework.subject = subject;
    newHomework.description = description;
    newHomework.startDate = new Date(startDate);
    newHomework.dueDate = new Date(dueDate);
    newHomework.priority = priority;
    newHomework.estTime = estTime;

    currentUser.addHomework(newHomework).then(() => {
      notifSuccess("Assignment Added", `Added assignment: "${description}"`)
    });
  }

  function handleClose() {
    close();
  }

  return (
    <Modal opened={open} onClose={handleClose} title="Add Assignment">
      <form className="d-flex flex-column gap-2 mt-1 mb-2" onSubmit={handleFormSubmit}>
        <Select label="Subject" id="subject" placeholder="Pick a subject" data={Object.keys(currentUser.subjects).sort((a, b) => a.localeCompare(b))} searchable />
        <TextInput label="Description" id="description" required placeholder="What is this assignment?" />
        <div className="d-flex gap-2">
          <DateInput label="Start Date" id="start-date" w={"100%"} placeholder='When will you start?'/>
          <DateInput label="Due Date" id="due-date" w={"100%"} placeholder='When is it due?'/>
        </div>
        <div className="d-flex gap-2">
          <TextInput label="Estimated Time" id="est-time" placeholder="How long will it take?"  w={"100%"}  />
          <Select label="Priority" id="priority" placeholder="Pick a priority" data={[HomeworkPriority.LOW, HomeworkPriority.MEDIUM, HomeworkPriority.HIGH]} searchable />
        </div>

        <div className="d-flex flex-row justify-content-end w-100">
          <Tooltip label="Add Assignment">
            <Button type="submit">
              Done
            </Button>
          </Tooltip>
        </div>
      </form>
    </Modal>
  )
}