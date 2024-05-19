import { ActionIcon, Avatar, AvatarGroup, Button, Checkbox, Modal, Paper, Table, Text, TextInput, Tooltip } from '@mantine/core';
import React from 'react'
import { Tool, User } from '../api/dbManager.ts';
import { IconSearch, IconTrash, IconUser, IconUserShare } from '@tabler/icons-react';

export default function ToolManagement() {
  
  function addTool(event) {
    event.preventDefault();
    const name = document.getElementById("name").value;
    const description = document.getElementById("description").value;
    Tool.createOnDatabase(name, description).then((toolId) => {
      console.log(`Created tool with ID: ${toolId}`);
      setAssignDialogOpen(true);
    })
  }

  const [assignDialogOpen, setAssignDialogOpen] = React.useState(false);
  const [userSearchMenuOpen, setUserSearchMenuOpen] = React.useState(false);

  const [currentTool, setCurrentTool] = React.useState(null);

  const [allTools, setAllTools] = React.useState({});
  const [allUsers, setAllUsers] = React.useState({});

  const [userQuery, setUserQuery] = React.useState("");

  const [assignees, setAssignees] = React.useState([]);

  React.useEffect(() => {
    Tool.fetchAll().then((tools) => {
      // Sort these by their title field
      setAllTools(tools);
    })
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

        function toggleAssignee() {
          if (assignees.includes(user.id)) {
            setAssignees(assignees.filter((id) => id !== user.id))
          } else {
            setAssignees([...assignees, user.id])
          }
        }

        return (
          <Paper onClick={toggleAssignee} className="d-flex mb-2 flex-row justify-content-between align-items-center p-2" withBorder style={{cursor: "pointer"}} >
            <div className="d-flex flex-row align-items-center justify-content-center">
              <Avatar src={user.personalData.pfpUrl} alt={user.personalData.displayName} />
              <Text style={{marginLeft: "0.5rem"}}>{user.personalData.displayName}</Text>
            </div>
            <Tooltip label={`Assign "${currentTool?.title}" to ${user.personalData.displayName}`} >
              <Checkbox readOnly checked={assignees.includes(user.id)} />
            </Tooltip>
          </Paper>
        )
      })
    )
  }

  const Assignees = () => {
    if (assignees.length === 0) { return; }
    
    function assignToAssignees() {
      Tool.assignToMultiple(currentTool.title, currentTool.description, currentTool.id, assignees).then((success) => {
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

  return (

    <div>
      <h2>Tool Management</h2>
      <form onSubmit={addTool} className="gap-2 d-flex flex-column">
        <TextInput id="name" label="Tool Name" placeholder="Enter the tool name" required />
        <TextInput id="description" label="Tool Description" placeholder="Enter the tool description" required />
        <Button type="submit">Create Tool</Button>
      </form>
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
            {Object.values(allTools).sort((a, b) => a.title.localeCompare(b.title)).map((tool, index) => {
              
              function handleDelete() {
                Tool.delete(tool.id).then((success) => {
                  if (success) { 
                    Tool.fetchAll().then((tools) => {
                      setAllTools(tools);
                    })
                  }
                })
              }
              
              function handleAssign() {
                setCurrentTool(tool)
                setAssignDialogOpen(true);
                setUserSearchMenuOpen(true);
              }

              return (
              <Table.Tr key={index}>
                <Table.Td>
                  {tool.title}
                </Table.Td>
                <Table.Td>
                  {tool.description}
                </Table.Td>
                <Table.Td className='d-flex gap-2'>
                  <Tooltip label={`Delete "${tool.title}"`}>
                    <ActionIcon onClick={handleDelete} color="red"><IconTrash /></ActionIcon>
                  </Tooltip>
                  <Tooltip label={`Assign "${tool.title}"`}>
                    <ActionIcon onClick={handleAssign}><IconUserShare /></ActionIcon>
                  </Tooltip>
                </Table.Td>
              </Table.Tr>
            )})}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>
      <Modal opened={userSearchMenuOpen} onClose={() => setUserSearchMenuOpen(false)} title={`Assign "${currentTool?.title}" to Users:`}>
        <p>Search for a user to assign the tool to:</p>
        <TextInput style={{marginBottom: "1rem"}} value={userQuery} onChange={(e) => setUserQuery(e.target.value)} placeholder="Search for a user by display name or email..." rightSection={<IconSearch size="1rem" />}/>
        <UserSearchResults />
        <Assignees />
      </Modal>
    </div>
  )
}
