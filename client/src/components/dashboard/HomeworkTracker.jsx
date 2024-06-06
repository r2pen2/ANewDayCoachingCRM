// Library Imports
import React from "react";
import { Badge, Button, ColorPicker, Paper, Popover, Radio, Select, Table, Text, TextInput, Tooltip } from "@mantine/core";
import { IconPlus, IconSchool, IconSend, IconSpeedboat, IconTrash } from "@tabler/icons-react";
// API Imports
import { Homework, HomeworkPriority, HomeworkStatus, HomeworkSubject } from "../../api/db/dbHomework.ts";
// Component Imports
import { notifSuccess } from "../Notifications";
import { CurrentUserContext } from "../../App";
import IconButton from "../IconButton.jsx";
import { getSlashDateString, parseQuickEntry } from "../../api/strings.js";
import { shouldUseBlackText } from "../../api/color.ts";

/**
 * A card that displays a subject
 * @param {HomeworkSubject} subject - the subject to display
 **/
export const SubjectCard = ({subject}) => {
  
  /** Get currentUser from react context */
  const {currentUser} = React.useContext(CurrentUserContext);

  /** The color of the subject */
  const [c, setC] = React.useState(subject.color);

  /** When the delete button is pressed, remove the subject on the user's document */
  function handleDelete() {
    if (window.confirm(`Are you sure you want to delete "${subject.title}"?`)) {
      currentUser.removeSubject(subject.title).then(() => {
        notifSuccess("Subject Removed", `Removed subject "${subject.title}"`)
      });
    }
  }
  
  /** When the color is updated, update the subject on the user's document */
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
        <IconButton onClick={handleDelete} icon={<IconTrash />} buttonProps={{size: 36, color: "red"}} label="Delete Subject" />
      </div>
    </Paper>
  )
}

/**
 * A popover that contains a color picker
 * @param {string} c - the color
 * @param {function} setC - the setter for the color
 * @param {boolean} popoverOpenOverride - whether the popover is open
 * @param {function} setPopoverOpenOverride - the setter for the popover
 * @param {function} onDone - the function to call when the color is selected
 */
export const PickerMenu = ({c, setC, popoverOpenOverride, setPopoverOpenOverride, onDone}) => {
  /** Whether popover is open */
  const [popoverOpen, setPopoverOpen] = React.useState(false)
  
  /** When done is pressed, use the setter or setter override, then call {@link onDone} if it exists */
  const handleDone = () => { 
    setPopoverOpenOverride ? setPopoverOpenOverride(false) : setPopoverOpen(false);
    if (onDone) { onDone(c); }
  }

  /** When the preview button is pressed, toggle the popover wiht the appropriate setter function */
  function handlePreviewButtonPress() {
    if (setPopoverOpenOverride) {
      setPopoverOpenOverride((popoverOpenOverride) => !popoverOpenOverride)
      return;
    }
    setPopoverOpen((popoverOpen) => !popoverOpen);
  }

  return (
    <Popover withArrow position="bottom" shadow="md" opened={popoverOpenOverride ? popoverOpenOverride : popoverOpen}>
      <Popover.Target>
        <Tooltip label="Select Color">            
          <Button className="picker-button" onClick={handlePreviewButtonPress} style={{width: 36, height: 36, background: c}} />
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

export const QuickEntryResults = ({quickExtract}) => {
  
  /** Get currentUser from react context */
  const {currentUser} = React.useContext(CurrentUserContext);

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

export const AssignmentTableHead = () => (
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
)

export function AssignmentRow({homeworkJson}) {

  /** Get currentUser from react context */
  const {currentUser} = React.useContext(CurrentUserContext);

  const homework = new Homework(homeworkJson);

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
    <Table.Tr>
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
}

export const Tracker = ({setSubjectAddMenuOpen, setHomeworkAddMenuOpen}) => {
  
  /** Get current user from react context */
  const {currentUser} = React.useContext(CurrentUserContext);

  const [showCompleted, setShowCompleted] = React.useState(false)

  const [quickEntryString, setQuickEntryString] = React.useState("");
  const [quickExtract, setQuickExtract] = React.useState({
    subject: null,
    description: null,
    startDate: null,
    dueDate: null,
    priority: null
  });
  
  React.useEffect(() => {
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

  const [quickEntryError, setQuickEntryError] = React.useState(null)

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

  const [sortType, setSortType] = React.useState("Priority")
  
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
      <AssignmentTableHead />
      <Table.Tbody>
        {Object.values(currentUser.homework).filter(hw => hw.status !== HomeworkStatus.COMPLETED || showCompleted).sort((a, b) => sortingAlg(a, b)).map((homework, index) => {
          return <AssignmentRow key={index} homeworkJson={homework} />
        })}
      </Table.Tbody>
    </Table>
  </Table.ScrollContainer>
  ]
}