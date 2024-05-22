// Library Imports
import React from "react";
import { ActionIcon, Button, ColorPicker, Paper, Popover, Text, Tooltip } from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";
// API Imports
import { HomeworkSubject } from "../../api/db/dbHomework.ts";
// Component Imports
import { notifSuccess } from "../Notifications";
import { CurrentUserContext } from "../../App";
import IconButton from "../IconButton.jsx";

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