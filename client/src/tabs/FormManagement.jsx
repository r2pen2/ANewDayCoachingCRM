import { ActionIcon, Avatar, AvatarGroup, Button, Checkbox, Modal, Paper, Table, Text, TextInput, Tooltip } from '@mantine/core';
import React from 'react'
import { FormAssignment, User } from '../api/dbManager.ts';
import { IconSearch, IconTrash, IconUserCancel, IconUserShare } from '@tabler/icons-react';
import { allForms } from '../api/forms.ts';
import "../assets/style/formsAdmin.css"



export default function FormManagement() {

  const [userSearchMenuOpen, setUserSearchMenuOpen] = React.useState(false);

  const [currentForm, setCurrentForm] = React.useState(null);

  const [allUsers, setAllUsers] = React.useState({});

  const [userQuery, setUserQuery] = React.useState("");
  const [assignees, setAssignees] = React.useState([]);

  const [assignMode, setAssignMode] = React.useState(null);

  React.useEffect(() => {
    User.fetchAll().then((users) => {
      setAllUsers(users);
    })
  }, [])

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

        function userHasForm() { return allUsers[user.id].formAssignments.includes(currentForm.id); }

        function toggleAssignee() {

          if (disablePaper) { return; }

          if (assignees.includes(user.id)) {
            setAssignees(assignees.filter((id) => id !== user.id))
          } else {
            setAssignees([...assignees, user.id])
          }
        }

        function getTooltipLabel() {
          if (userHasForm() && assignMode === "Assign") { return `${user.personalData.displayName} already has this form assigned.` }
          if (!userHasForm() && assignMode === "Unassign") { return `${user.personalData.displayName} does not have this form assigned.` }
          return `Assign "${currentForm?.formTitle}" to ${user.personalData.displayName}`
        }

        /** Whether to disable the paper */
        const disablePaper = (userHasForm() && assignMode === "Assign") || (!userHasForm() && assignMode === "Unassign");

        /** Whether to display checkbox as checked */
        const checked = assignees.includes(user.id);
        
        return (
          <Paper onClick={toggleAssignee} className={`d-flex mb-2 flex-row justify-content-between align-items-center p-2 user-assignment-paper ${disablePaper ? "disabled" : ""}`} withBorder style={{cursor: "pointer"}} >
            <div className="d-flex flex-row align-items-center justify-content-center">
              <Avatar src={user.personalData.pfpUrl} alt={user.personalData.displayName} />
              <Text style={{marginLeft: "0.5rem"}}>{user.personalData.displayName}</Text>
            </div>
            <Tooltip label={getTooltipLabel()} >
              <Checkbox checked={checked} disabled={disablePaper}/>
            </Tooltip>
          </Paper>
        )
      })
    )
  }

  const Assignees = () => {
    if (assignees.length === 0) { return; }
    
    function assignToAssignees() {

      currentForm.assignToMultiple(assignees).then((success) => {
        if (success) {
          setUserSearchMenuOpen(false);
        }
      })

    }

    return (
      <div className="d-flex flex-row justify-content-end align-items-center p-2">
        <AvatarGroup>
          {assignees.map((userId, index) => {
            const user = allUsers[userId];
            return <Tooltip key={index} label={user.personalData.displayName}><Avatar src={user.personalData.pfpUrl} alt={user.personalData.displayName} /></Tooltip>
          })}
        </AvatarGroup>
        <Button style={{marginLeft: "1rem"}} onClick={assignToAssignees}>Done</Button>
      </div>
    )
  }

  const ModalHelpText = () => <Text style={{marginBottom: "1rem"}}>{assignMode === "Assign" ? "Select users to assign this form to." : "Select users to unassign this form from."}</Text>;

  return (

    <div>
      <h2>Form Management</h2>
      <Table.ScrollContainer minWidth={500} type="native">
        <Table striped>
          <Table.Thead>
            <Table.Th>
              Name
            </Table.Th>
            <Table.Th>
              Description
            </Table.Th>
            <Table.Th>
              Actions
            </Table.Th>
          </Table.Thead>
          <Table.Tbody>
            {allForms.sort((a, b) => a.formTitle.localeCompare(b.formTitle)).map((form, index) => {
              
              function handleAssign() {
                if (assignMode === "Unssign") { setAssignees([]) }
                if (currentForm.formId !== form.formId) { setAssignees([]) }
                setCurrentForm(form);
                setUserSearchMenuOpen(true);
                setAssignMode("Assign");
              }
              
              function handleUnassign() {
                if (assignMode === "Assign") { setAssignees([]) }
                if (currentForm.formId !== form.formId) { setAssignees([]) }
                setCurrentForm(form);
                setUserSearchMenuOpen(true);
                setAssignMode("Unassign");
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
                </Table.Td>
              </Table.Tr>
            )})}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>
      <Modal opened={userSearchMenuOpen} onClose={() => setUserSearchMenuOpen(false)} title={`${assignMode} "${currentForm?.formTitle}" to Users:`}>
        <ModalHelpText />
        <TextInput style={{marginBottom: "1rem"}} value={userQuery} onChange={(e) => setUserQuery(e.target.value)} placeholder="Search for a user by display name or email..." rightSection={<IconSearch size="1rem" />}/>
        <UserSearchResults />
        <Assignees />
      </Modal>
    </div>
  )
}
