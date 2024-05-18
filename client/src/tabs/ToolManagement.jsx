import { Button, TextInput } from '@mantine/core';
import React from 'react'

export default function ToolManagement() {
  
  function addTool(event) {
    fetch("")
  }

  const [assignDialogOpen, setAssignDialogOpen] = React.useState(false);

  return (

    <div>
      <h2>Tool Management</h2>
      <form onSubmit={addTool} className="gap-2 d-flex flex-column">
        <TextInput label="Tool Name" placeholder="Enter the tool name" required />
        <TextInput label="Tool Description" placeholder="Enter the tool description" required />
        <Button type="submit">Create Tool</Button>
      </form>
    </div>
  )
}
