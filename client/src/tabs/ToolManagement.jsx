import { ActionIcon, Avatar, AvatarGroup, Button, Checkbox, Modal, Paper, Table, Text, TextInput, Tooltip } from '@mantine/core';
import React from 'react'
import { Tool, User } from '../api/dbManager.ts';
import { IconSearch, IconTrash, IconUser, IconUserCancel, IconUserShare } from '@tabler/icons-react';
import "../assets/style/toolsAdmin.css"

export default function ToolManagement() {
  
  /** Create tool on database w/ fields from form */
  function addTool(event) {
    event.preventDefault();
    const name = document.getElementById("name").value;
    const description = document.getElementById("description").value;
    Tool.createOnDatabase(name, description).then((toolId) => {
      console.log(`Created tool with ID: ${toolId}`);
      Tool.fetchAll().then((tools) => { setAllTools(tools); })
      setCurrentTool({title: name, description: description, id: toolId})
      setUserSearchMenuOpen(true);
    })
  }

  /** Whether search menu is open */
  const [userSearchMenuOpen, setUserSearchMenuOpen] = React.useState(false);
  /** Current tool to assign */
  const [currentTool, setCurrentTool] = React.useState(null);
  /** All tools from database */
  const [allTools, setAllTools] = React.useState({});
  /** All users from database (for search) */
  const [allUsers, setAllUsers] = React.useState({});
  /** Current string query to filter users */
  const [userQuery, setUserQuery] = React.useState("");
  /** All users currently selected for tool assignment */
  const [assignees, setAssignees] = React.useState([]);
  /** Whether we are in assign or unassign mode */
  const [assignMode, setAssignMode] = React.useState(null);

  /** Fetch tools and users on component mount */
  React.useEffect(() => {
    Tool.fetchAll().then((tools) => { setAllTools(tools); })
    User.fetchAll().then((users) => { setAllUsers(users); })
  }, [])

  const UserSearchResults = () => {

    let users = Object.values(allUsers);
    if (users.length === 0) { return <Text>No users found.</Text> } // There are no users that match this search, so don't bother with the rest of the logic here

    // If the userQuery is not empty: filter users by their displayName or email
    if (userQuery.length > 0) { users = users.filter((user) => { return user.personalData.displayName.includes(userQuery) || user.personalData.email.includes(userQuery) }) }

    // Let's sort alphabetically by displayName, too
    users.sort((a, b) => a.personalData.displayName.localeCompare(b.personalData.displayName))

    return (
      users.map((user, index) => {

        /** Toggle a userId's existance in assignee array */
        function toggleAssignee() {
          if (disablePaper) { return; } // Don't do anything if there are incompatibilities
          if (assignees.includes(user.id)) { setAssignees(assignees.filter((id) => id !== user.id)); return; }
          setAssignees([...assignees, user.id])
        }

        /** Whether the assignMode is "Assign" and the user already has the tool assigned */
        const assignIncompatibility = Object.keys(user.tools).includes(currentTool.id) && assignMode === "Assign";
        /** Whether the assignMode is "Unassign" and the user does not have the tool assigned */
        const unassignIncompatibility = !Object.keys(user.tools).includes(currentTool.id) && assignMode === "Unassign";

        /** Whether the paper should be disabled */
        const disablePaper = assignIncompatibility || unassignIncompatibility;

        /** Get the tooltip label based on the incompatibility */
        function getTooltip() {
          if (assignIncompatibility) { return `${user.personalData.displayName} already has this tool assigned.` }
          if (unassignIncompatibility) { return `${user.personalData.displayName} does not have this tool assigned.` }
          if (assignMode === "Assign") { return `Assign "${currentTool?.title}" to ${user.personalData.displayName}` }
          if (assignMode === "Unassign") { return `Unassign "${currentTool?.title}" from ${user.personalData.displayName}` }
        }

        return (
          <Paper key={index} onClick={toggleAssignee} className={`d-flex mb-2 flex-row justify-content-between align-items-center p-2 user-assignment-paper ${disablePaper ? "disabled" : ""}`} withBorder style={{cursor: "pointer"}} >
            <div className="d-flex flex-row align-items-center justify-content-center">
              <Avatar src={user.personalData.pfpUrl} alt={user.personalData.displayName} />
              <Text style={{marginLeft: "0.5rem"}}>{user.personalData.displayName}</Text>
            </div>
            <Tooltip label={getTooltip()} >
              <Checkbox readOnly checked={assignees.includes(user.id)} disabled={disablePaper} />
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
        Tool.assignToMultiple(currentTool.title, currentTool.description, currentTool.id, assignees).then((success) => {
          if (success) {
            setUserSearchMenuOpen(false);
          }
        })
        return;
      }
      Tool.unassignMultiple(currentTool.id, assignees).then((success) => {
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
        <Button style={{marginLeft: "1rem"}} onClick={handleDone}>Done</Button>
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
              
              /** Delete this tool on DB and refresh list */
              function handleDelete() {
                Tool.delete(tool.id).then((success) => {
                  if (success) { 
                    Tool.fetchAll().then((tools) => {
                      setAllTools(tools);
                    })
                  }
                })
              }
              
              /** Assign this tool to users on DB */
              function handleAssign() {
                if (currentTool?.title !== tool.title) { setAssignees([]) }
                setCurrentTool(tool)
                setUserSearchMenuOpen(true);
                setAssignMode("Assign");
              }

              /** Unssign this tool to users on DB */
              function handleUnassign() {
                if (currentTool?.title !== tool.title) { setAssignees([]) }
                setCurrentTool(tool)
                setUserSearchMenuOpen(true);
                setAssignMode("Unassign");
              }

              /** Confirm deletion of tool */
              function confirmDelete() { if (window.confirm(`Are you sure you want to delete "${tool.title}"?`)) { handleDelete(); } }

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
                      <ActionIcon onClick={confirmDelete} color="red"><IconTrash /></ActionIcon>
                    </Tooltip>
                    <Tooltip label={`Assign "${tool.title}"`}>
                      <ActionIcon onClick={handleAssign}><IconUserShare /></ActionIcon>
                    </Tooltip>
                    <Tooltip label={`Unassign "${tool.title}"`}>
                      <ActionIcon color="red" onClick={handleUnassign}><IconUserCancel /></ActionIcon>
                    </Tooltip>
                  </Table.Td>
                </Table.Tr>
              )
            })}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>
      <Modal opened={userSearchMenuOpen} onClose={() => setUserSearchMenuOpen(false)} title={`${assignMode} "${currentTool?.title}" ${assignMode === "Assign" ? "to" : "from"} Users:`}>
        { assignMode === "Assign" && <p>Search for users to assign {currentTool?.title} to:</p>}
        { assignMode === "Unassign" && <p>Search for users to unassign {currentTool?.title} from:</p>}
        <TextInput style={{marginBottom: "1rem"}} value={userQuery} onChange={(e) => setUserQuery(e.target.value)} placeholder="Search for a user by display name or email..." rightSection={<IconSearch size="1rem" />}/>
        <UserSearchResults />
        <Assignees />
      </Modal>
    </div>
  )
}
