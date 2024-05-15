import { Paper } from '@mantine/core'
import React from 'react'

import { tools } from '../api/tools.ts'

export default function Dashboard() {
  
  const ToolsList = () => (
    <div className="container-fluid">
      <div className="row">
        {tools.map((tool, index) => <ToolCard key={index} tool={tool} />)}
      </div>
    </div>
  )

  return (
    <div>
      <div className="d-flex align-items-center flex-column">
        <h2>Dashboard</h2>
      </div>
      <h3>My Tools</h3>
      <ToolsList />
    </div>
  )
}

const ToolCard = ({tool}) => (
  <div className="col-6 col-md-4 col-lg-3 mb-2 ">
    <Paper withBorder className="p-2 h-100" style={{marginRight: "1rem", minWidth: 200}}>
      <strong>{tool.title}</strong>
      <p >{tool.description}</p>
    </Paper>
  </div>
)