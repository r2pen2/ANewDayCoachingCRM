import { Button, Table, TextInput } from '@mantine/core';
import React from 'react'
import { Tool } from '../api/dbManager.ts';

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

  const [allTools, setAllTools] = React.useState({});

  React.useEffect(() => {
    Tool.fetchAll().then((tools) => {
      setAllTools(tools);
    })
  })

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
                console.log(tool)
                Tool.delete(tool.id).then((success) => {
                  if (success) { 
                    Tool.fetchAll().then((tools) => {
                      setAllTools(tools);
                    })
                  }
                })
              }
              
              function handleAssign() {
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
                  <Button onClick={handleDelete}>Delete</Button>
                  <Button onClick={handleAssign}>Assign To User</Button>
                </Table.Td>
              </Table.Tr>
            )})}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>
    </div>
  )
}
