import { Paper, Table } from '@mantine/core'
import React from 'react'

import { tools } from '../api/tools.ts'
import { getSlashDateString } from '../api/strings.js'

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
      <h3>Upcoming Assignments</h3>
      <Tracker />
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

const Tracker = () => {
  return (
    
    <Table.ScrollContainer minWidth={500} type="native">
    <Table striped>
      <Table.Thead>
        <Table.Th>
          Subject
        </Table.Th>
        <Table.Th>
          Assignment
        </Table.Th>
        <Table.Th>
          Status
        </Table.Th>
        <Table.Th>
          Est Time
        </Table.Th>
        <Table.Th>
          Priority
        </Table.Th>
        <Table.Th>
          Start Date
        </Table.Th>
        <Table.Th>
          Due Date
        </Table.Th>
      </Table.Thead>
      <Table.Tbody>
        <Table.Tr key={1}>
          <Table.Td>English 2000</Table.Td>
          <Table.Td>Read Intro, 1-11 and 18-19  and Chapter 1, 21-32</Table.Td>
          <Table.Td>Done</Table.Td>
          <Table.Td>2 Hours</Table.Td>
          <Table.Td>Low</Table.Td>
          <Table.Td>{getSlashDateString(new Date())}</Table.Td>
          <Table.Td>{getSlashDateString(new Date())}</Table.Td>
        </Table.Tr>
      </Table.Tbody>
    </Table>
  </Table.ScrollContainer>
  )
}