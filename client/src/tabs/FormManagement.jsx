import { ActionIcon, Avatar, AvatarGroup, Button, Checkbox, Modal, Paper, Table, Text, TextInput, Tooltip } from '@mantine/core';
import React from 'react'
import { FormAssignment, User } from '../api/dbManager.ts';
import { IconAlertCircle, IconSearch, IconTrash, IconUserCancel, IconUserShare, IconX } from '@tabler/icons-react';
import { allForms } from '../api/forms.ts';
import "../assets/style/formsAdmin.css"
import { navigationItems } from '../components/Navigation.jsx';
import { notifSuccess } from '../components/Notifications.jsx';

export default function FormManagement() {

  const [userSearchMenuOpen, setUserSearchMenuOpen] = React.useState(false);

  const [currentForm, setCurrentForm] = React.useState(null);

  const [allUsers, setAllUsers] = React.useState({});

  const [userQuery, setUserQuery] = React.useState("");
  const [assignees, setAssignees] = React.useState([]);

  const [assignMode, setAssignMode] = React.useState(null);

  React.useEffect(() => { User.fetchSearch(navigationItems.ADMINFORMS).then((users) => { setAllUsers(users); }) }, [])

  const UserSearchResults = () => {

    let users = Object.values(allUsers);

    if (userQuery.length > 0) {
      users = users.filter((user) => { return user.personalData.displayName.includes(userQuery) || user.personalData.email.includes(userQuery) })
    }

    // Let's sort alphabetically by displayName, too
    users.sort((a, b) => a.personalData.displayName.localeCompare(b.personalData.displayName))

    if (users.length === 0) {
      return <Text>No users found.</Text>
    }

    return (
      users.map((user, index) => {

        const userHasForm = allUsers[user.id].formAssignments.filter(fa => fa.formId === currentForm.formId).length > 0;
        const userCompletedForm = allUsers[user.id].formAssignments.filter(fa => fa.formId === currentForm.formId)[0]?.completed;

        function toggleAssignee() {
          if (disablePaper) { return; } // Don't do anything if there are incompatibilities
          // Otherwise add / remove the user from assignees
          if (assignees.includes(user.id)) { setAssignees(assignees.filter((id) => id !== user.id)) } else { setAssignees([...assignees, user.id]) }
        }


        /** Whether the assignMode is "Assign" and the user already has the form assigned */
        const assignIncompatibility = userHasForm && assignMode === "Assign";
        /** Whether the assignMode is "Unassign" and the user does not have the form assigned */
        const unassignIncompatibility = !userHasForm && assignMode === "Unassign";
        /** Whether the assignMode is "Incomplete" and the user has not completed the form */
        const incompleteIncompatibility = !userCompletedForm && assignMode === "Incomplete";

        function getTooltipLabel() {
          if (assignIncompatibility) { return `${user.personalData.displayName} already has this form assigned.` }
          if (unassignIncompatibility) { return `${user.personalData.displayName} does not have this form assigned.` }
          if (incompleteIncompatibility) { return `${user.personalData.displayName} has not completed this form.` }
          if (assignMode === "Assign") { return `Assign "${currentForm?.formTitle}" to ${user.personalData.displayName}` }
          if (assignMode === "Unassign") { return `Unassign "${currentForm?.formTitle}" from ${user.personalData.displayName}` }
          if (assignMode === "Incomplete") { return `Mark "${currentForm?.formTitle}" as incomplete for ${user.personalData.displayName}` }
        }

        /** Disable the paper and checkbox if there are any incompatibilities at all */
        const disablePaper = assignIncompatibility || unassignIncompatibility || incompleteIncompatibility;

        /** Whether to display checkbox as checked */
        const checked = assignees.includes(user.id);
        
        return (
          <Paper key={index} onClick={toggleAssignee} className={`d-flex mb-2 flex-row justify-content-between align-items-center p-2 user-assignment-paper ${disablePaper ? "disabled" : ""}`} withBorder style={{cursor: "pointer"}} >
            <div className="d-flex flex-row align-items-center justify-content-center">
              <Avatar src={user.personalData.pfpUrl} alt={user.personalData.displayName} />
              <Text style={{marginLeft: "0.5rem"}}>{user.personalData.displayName}</Text>
            </div>
            <Tooltip label={getTooltipLabel()} >
              <Checkbox readOnly checked={checked} disabled={disablePaper}/>
            </Tooltip>
          </Paper>
        )
      })
    )
  }

  const Assignees = () => {
    if (assignees.length === 0) { return; }
    
    function handleDone() {

      if (assignMode === "Assign") {
        currentForm.assignToMultiple(assignees).then((success) => {
          if (success) {
            setUserSearchMenuOpen(false);
            notifSuccess("Form Assigned", `Assigned "${currentForm.formTitle}" to ${assignees.length} user${assignees.length !== 1 ? "s" : ""}.`)
          }
        })
        return;
      }

      if (assignMode === "Unassign") {
        currentForm.unassignToMultiple(assignees).then((success) => {
          if (success) {
            setUserSearchMenuOpen(false);
            notifSuccess("Form Unassigned", `Unssigned "${currentForm.formTitle}" from ${assignees.length} user${assignees.length !== 1 ? "s" : ""}.`)
          }
        })
        return;
      }

      if (assignMode === "Incomplete") {
        currentForm.incompleteToMultiple(assignees).then((success) => {
          if (success) {
            setUserSearchMenuOpen(false);
            notifSuccess("Form Marked Incomplete", `Marked "${currentForm.formTitle}" as incomplete for ${assignees.length} user${assignees.length !== 1 ? "s" : ""}.`)
          }
        })
        return;
      }

    }

    return (
      <div className="d-flex flex-row justify-content-end align-items-center p-2">
        <AvatarGroup>
          {assignees.map((userId, index) => {
            const user = allUsers[userId];
            return <Tooltip key={index} label={user.personalData.displayName}><Avatar src={user.personalData.pfpUrl} alt={user.personalData.displayName} /></Tooltip>
          })}
        </AvatarGroup>
        <Button style={{marginLeft: "1rem"}} onClick={handleDone}>Done</Button>
      </div>
    )
  }

  function getModalHelpText() {
    if (assignMode === "Assign")      { return "Select users to assign the form to." }
    if (assignMode === "Unassign")    { return "Select users to unassign the form from." }
    if (assignMode === "Incomplete")  { return "Select users to mark the form as incomplete for." }
  }

  function getModalTitle() {
    if (assignMode === "Incomplete")  { return `Mark "${currentForm?.formTitle}" as Incomplete For Users:` }
    return `${assignMode} "${currentForm?.formTitle}" to Users:`
  }

  return (
    <div>
      <h2>Form Management</h2>
      <Table.ScrollContainer minWidth={500} type="native">
        <Table striped>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>
                Name
              </Table.Th>
              <Table.Th>
                Description
              </Table.Th>
              <Table.Th>
                Actions
              </Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {allForms.sort((a, b) => a.formTitle.localeCompare(b.formTitle)).map((form, index) => {
              
              function handleAssign() {
                if (assignMode !== null && assignMode !== "Assign") { setAssignees([]) }
                if (currentForm?.formId !== form.formId) { setAssignees([]) }
                setCurrentForm(form);
                setUserSearchMenuOpen(true);
                setAssignMode("Assign");
              }
              
              function handleUnassign() {
                if (assignMode !== null && assignMode !== "Unssign") { setAssignees([]) }
                if (currentForm?.formId !== form.formId) { setAssignees([]) }
                setCurrentForm(form);
                setUserSearchMenuOpen(true);
                setAssignMode("Unassign");
              }

              function handleIncomplete() {
                if (assignMode !== null && assignMode !== "Incomplete") { setAssignees([]) }
                if (currentForm?.formId !== form.formId) { setAssignees([]) }
                setCurrentForm(form);
                setUserSearchMenuOpen(true);
                setAssignMode("Incomplete");
              }

              return (
              <Table.Tr key={index}>
                <Table.Td>
                  {form.formTitle}
                </Table.Td>
                <Table.Td>
                  {form.formDescription}
                </Table.Td>
                <Table.Td className='d-flex gap-2'>
                  <Tooltip label={`Assign "${form.formTitle}"`}>
                    <ActionIcon onClick={handleAssign}><IconUserShare /></ActionIcon>
                  </Tooltip>
                  <Tooltip label={`Unassign "${form.formTitle}"`}>
                    <ActionIcon color="red" onClick={handleUnassign}><IconUserCancel /></ActionIcon>
                  </Tooltip>
                  <Tooltip label={`Mark "${form.formTitle}" as Incomplete`}>
                    <ActionIcon color="orange" onClick={handleIncomplete}><IconAlertCircle /></ActionIcon>
                  </Tooltip>
                </Table.Td>
              </Table.Tr>
            )})}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>
      <Modal opened={userSearchMenuOpen} onClose={() => setUserSearchMenuOpen(false)} title={getModalTitle()}>
        <Text style={{marginBottom: "1rem"}}>{getModalHelpText()}</Text>
        <TextInput style={{marginBottom: "1rem"}} value={userQuery} onChange={(e) => setUserQuery(e.target.value)} placeholder="Search for a user by display name or email..." rightSection={<IconSearch size="1rem" />}/>
        <UserSearchResults />
        <Assignees />
      </Modal>
    </div>
  )
}
