import { Button, TextInput } from '@mantine/core';
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

  return (

    <div>
      <h2>Tool Management</h2>
      <form onSubmit={addTool} className="gap-2 d-flex flex-column">
        <TextInput id="name" label="Tool Name" placeholder="Enter the tool name" required />
        <TextInput id="description" label="Tool Description" placeholder="Enter the tool description" required />
        <Button type="submit">Create Tool</Button>
      </form>
    </div>
  )
}
