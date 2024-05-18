import { ActionIcon, Button, Modal, Table, TextInput, Tooltip } from '@mantine/core';
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

  React.useEffect(() => {
    Tool.fetchAll().then((tools) => {
      setAllTools(tools);
    })
    User.fetchAll().then((users) => {
      setAllUsers(users);
    })
  })

  const UserSearchResults = () => {
    const query = document.getElementById("user-query").value;
    const users = Object.values(allUsers).filter((user) => { return user.displayName.includes(query) || user.email.includes(query) });

    return (
      <Table.ScrollContainer minWidth={500} type="native">

      </Table.ScrollContainer>
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
            {Object.values(allTools).map((tool, index) => {
              
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
        <TextInput id="user-query" placeholder="Search for a user by display name or email..." rightSection={<IconSearch size="1rem" />}/>
        <UserSearchResults />
      </Modal>
    </div>
  )
}
