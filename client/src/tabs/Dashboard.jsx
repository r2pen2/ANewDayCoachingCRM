// Library Imports
import React, { useContext, useEffect, useState } from 'react'
import { ActionIcon, Badge, Button, ColorPicker, Loader, Modal, Paper, Popover, Radio, Select, Table, Text, TextInput, Tooltip } from '@mantine/core'
import { Carousel } from '@mantine/carousel';
import { IconPlus, IconSchool, IconSend, IconSpeedboat, IconStar, IconTrash } from '@tabler/icons-react';

// API Imports
import { getSlashDateString, parseQuickEntry } from '../api/strings.js'
import { Tool } from '../api/db/dbTool.ts';

// Component Imports
import { CurrentUserContext } from '../App.jsx';

// Style Imports
import '@mantine/carousel/styles.css';
import "../assets/style/dashboard.css"
import { Homework, HomeworkPriority, HomeworkStatus, HomeworkSubject } from '../api/db/dbHomework.ts';
import { notifSuccess } from '../components/Notifications.jsx';
import { DateInput } from '@mantine/dates';

export default function Dashboard() {
  
  const {currentUser} = useContext(CurrentUserContext)

  const tools = Object.values(currentUser.tools);

  const ToolsList = () => (
    <Carousel
      slideSize={{ base: '100%', sm: '50%', md: '33.333333%' }}
      slideGap={{ base: 0, sm: 'md' }} 
      withIndicators
      loop
      withControls={false}
      dragFree
      className="indicator-container"
    >
      {tools.map((tool, index) => <ToolCard currentUser={currentUser} key={index} tool={tool} />)}
    </Carousel>
  )

  const [subjectAddMenuOpen, setSubjectAddMenuOpen] = React.useState(false);
  const [homeworkAddMenuOpen, setHomeworkAddMenuOpen] = React.useState(false);

  return (
    <div>
      <div className="d-flex align-items-center flex-column">
        <h2>Dashboard</h2>
      </div>
      <AddSubjectModal currentUser={currentUser} open={subjectAddMenuOpen} close={() => setSubjectAddMenuOpen(false)} />
      <AddHomeworkModal currentUser={currentUser} open={homeworkAddMenuOpen} close={() => setHomeworkAddMenuOpen(false)} />
      <Tracker currentUser={currentUser} setHomeworkAddMenuOpen={setHomeworkAddMenuOpen} setSubjectAddMenuOpen={setSubjectAddMenuOpen}/>
      <h3 style={{marginTop: "2rem"}}>My Tools</h3>
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

  const SubjectCard = ({subject}) => {
      
    const [c, setC] = React.useState(subject.color);

    function handleDelete() {
      if (window.confirm(`Are you sure you want to delete "${subject.title}"?`)) {
        currentUser.removeSubject(subject.title).then(() => {
          notifSuccess("Subject Removed", `Removed subject "${subject.title}"`)
        });
      }
    }
    
    function updateColor(c) {
      if (c === subject.color) { return; }
      currentUser.updateSubject(new HomeworkSubject(subject.title, c)).then(() => {
        notifSuccess("Subject Updated", `Changed the color for "${subject.title}"`)
      })
    }

    return (
      <Paper className="p-2 d-flex justify-content-between align-items-center mb-2" withBorder>
        <Text>{subject.title}</Text>
        <div className="d-flex gap-2">
          <PickerMenu c={c} setC={setC} onDone={updateColor} />
          <Tooltip label="Delete Subject">
            <ActionIcon color="red" size={36} onClick={handleDelete}>
              <IconTrash />
            </ActionIcon>
          </Tooltip>
        </div>
      </Paper>
    )
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
        <Tooltip label="Add Subject">
          <ActionIcon size={36} type="submit">
            <IconSend />
          </ActionIcon>
        </Tooltip>
      </form>
      <SubjectList />
    </Modal>
  )
}

const PickerMenu = ({c, setC, popoverOpenOverride, setPopoverOpenOverride, onDone}) => {
  const [popoverOpen, setPopoverOpen] = React.useState(false)
  const handleDone = () => { 
    setPopoverOpenOverride ? setPopoverOpenOverride(false) : setPopoverOpen(false);
    if (onDone) { onDone(c); }
  }
  return (
    <Popover withArrow position="bottom" shadow="md" opened={popoverOpenOverride ? popoverOpenOverride : popoverOpen}>
      <Popover.Target>
        <Tooltip label="Select Color">            
          <Button className="picker-button" onClick={setPopoverOpenOverride ? () => setPopoverOpenOverride((popoverOpenOverride) => !popoverOpenOverride) : () => setPopoverOpen((popoverOpen) => !popoverOpen)} style={{width: 36, height: 36, background: c}} />
        </Tooltip>
      </Popover.Target>
      <Popover.Dropdown>
        <ColorPicker value={c} onChange={setC} format="hex" swatches={['#2e2e2e', '#868e96', '#fa5252', '#e64980', '#be4bdb', '#7950f2', '#4c6ef5', '#228be6', '#15aabf', '#12b886', '#40c057', '#82c91e', '#fab005', '#fd7e14']} />
        <div className="d-flex justify-content-end w-100 mt-2">
          <Button onClick={handleDone}>Done</Button>
        </div>
      </Popover.Dropdown>
    </Popover>
  )
}

const ToolCard = ({tool, currentUser}) => {

  function getLabel() { return (tool.starred ? "Unfavorite" : "Favorite") + ` "${tool.title}"` }

  const [loading, setLoading] = React.useState(false);

  return (
    <Carousel.Slide style={{marginTop: "1rem", marginBottom: "1rem"}}>
    <Paper
        withBorder 
        className={"p-2 h-100"} 
        style={{
          marginRight: "1rem",
          filter: tool.starred ? "drop-shadow(0 0 0.5rem gold)" : "none",
        }}
      >
        <div className="d-flex justify-content-between">
          <strong>{tool.title}</strong>
          {!loading && <Tooltip label={getLabel()} onClick={() => {Tool.star(tool.id, currentUser.id); setLoading(true)}}>
            { <IconStar className='favorite-button' fill={tool.starred ? "gold" : "transparent"} stroke={tool.starred ? "gold" : "black"} /> }
          </Tooltip>}
          { loading && <Loader size={"1.25rem"}/> }
        </div>
        <p>{tool.description}</p>
      </Paper>
    </Carousel.Slide>
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
  }

  function handleEnter(e) {
    if (e.key === "Enter") {
      const newHomework = new Homework();
      newHomework.subject = quickExtract.subject;
      newHomework.description = quickExtract.description;
      newHomework.startDate = quickExtract.startDate ? new Date(quickExtract.startDate) : null;
      newHomework.dueDate = quickExtract.dueDate ? new Date(quickExtract.dueDate) : null;
      newHomework.priority = quickExtract.priority ? quickExtract.priority : HomeworkPriority.LOW;
      setQuickEntryString("");
      currentUser.addHomework(newHomework).then(() => {
        notifSuccess("Assignment Added", `Added assignment: "${newHomework.description}"`)
      });
    }
  }

  const QuickEntryResults = () => {
    
    if (!quickExtract.subject && !quickExtract.priority && !quickExtract.dueDate && !quickExtract.startDate) { return null; }

    return (
      <div className=" align-items-center d-flex gap-2 mt-2">
        { currentUser.subjects[quickExtract.subject] && <Badge color={currentUser.subjects[quickExtract.subject].color}>Subject: {quickExtract.subject}</Badge> }
        { quickExtract.priority && <Badge color={Homework.getPriorityColor(quickExtract.priority)}>!{quickExtract.priority}</Badge> }
        { quickExtract.startDate && <Badge color="gray">Start: {getSlashDateString(quickExtract.startDate)}</Badge> }
        { quickExtract.dueDate && <Badge color="gray">Due: {getSlashDateString(quickExtract.dueDate)}</Badge> }
      </div>
    )
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
      <Tooltip label="Show Completed Assignments">
        <Radio checked={showCompleted} onClick={() => setShowCompleted(!showCompleted)} />
      </Tooltip>
      <Tooltip label="Manage Subjects">
        <ActionIcon size={36} onClick={() => setSubjectAddMenuOpen(true)}>
          <IconSchool />
        </ActionIcon>
      </Tooltip>
      <Tooltip label="Add Assignment">
        <ActionIcon size={36} onClick={() => setHomeworkAddMenuOpen(true)}>
          <IconPlus />
        </ActionIcon>
      </Tooltip>
      <Select data={["Priority", "Due Date", "Start Date", "Subject"]} value={sortType} onChange={setSortType} />
    </div>
  </div>,
  <div className="d-flex gap-2" key="controls">
    <TextInput placeholder='Quick Entry' className='w-100' leftSection={<IconSpeedboat />} value={quickEntryString} onChange={(e) => { setQuickEntryString(e.target.value); extractQuickEntry(); }} onKeyDown={handleEnter} />
    <Tooltip label="Submit">
      <ActionIcon style={{height: 36, width: 36}}>
        <IconSend />
      </ActionIcon>
    </Tooltip>
  </div>,
    <QuickEntryResults key="quick-results" />,
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

          return (
            <Table.Tr key={index}>
              <Table.Td><Badge color={subject.color}>{subject.title}</Badge></Table.Td>
              <Table.Td>{homework.description}</Table.Td>
              <Table.Td>
                <Popover style={{cursor: "pointer"}}>
                  <Popover.Target>
                    <Badge color={Homework.getStatusColor(homework)}>{homework.status}</Badge>
                  </Popover.Target>
                  <Popover.Dropdown>
                    <Select data={Object.values(HomeworkStatus)} value={homework.status} onChange={handleStatusChange} />
                  </Popover.Dropdown>
                </Popover>
              </Table.Td>
              <Table.Td>{homework.estTime}</Table.Td>
              <Table.Td><Badge color={Homework.getPriorityColor(homework)}>{homework.priority}</Badge></Table.Td>
              <Table.Td>{homework.startDate ? getSlashDateString(!homework.startDate.toDate ? homework.startDate : homework.startDate.toDate()) : ""}</Table.Td>
              <Table.Td>{homework.dueDate ? getSlashDateString(!homework.dueDate.toDate ? homework.dueDate : homework.dueDate.toDate()) : ""}</Table.Td>
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