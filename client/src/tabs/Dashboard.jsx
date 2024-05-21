import { Loader, Paper, Table, Tooltip } from '@mantine/core'
import React, { useContext } from 'react'
import { Carousel } from '@mantine/carousel';
import '@mantine/carousel/styles.css';

import "../assets/style/dashboard.css"

import { getSlashDateString } from '../api/strings.js'
import { IconStar } from '@tabler/icons-react';
import { Tool } from '../api/db/dbTool.ts';
import { CurrentUserContext } from '../App.jsx';

export default function Dashboard() {
  
  const {currentUser} = useContext(CurrentUserContext)

  const tools = Object.values(currentUser.tools);

  const ToolsList = () => (
    <Carousel
      slideSize={{ base: '100%', sm: '50%', md: '33.333333%' }}
      slideGap={{ base: 0, sm: 'md' }} 
      withIndicators
      loop
      withControls={false}
      dragFree
      className="indicator-container"
    >
      {tools.map((tool, index) => <ToolCard currentUser={currentUser} key={index} tool={tool} />)}
    </Carousel>
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

const ToolCard = ({tool, currentUser}) => {

  function getLabel() { return (tool.starred ? "Unfavorite" : "Favorite") + ` "${tool.title}"` }

  const [loading, setLoading] = React.useState(false);

  return (
    <Carousel.Slide style={{marginTop: "1rem", marginBottom: "1rem"}}>
    <Paper
        withBorder 
        className={"p-2 h-100"} 
        style={{
          marginRight: "1rem",
          filter: tool.starred ? "drop-shadow(0 0 0.5rem gold)" : "none",
        }}
      >
        <div className="d-flex justify-content-between">
          <strong>{tool.title}</strong>
          {!loading && <Tooltip label={getLabel()} onClick={() => {Tool.star(tool.id, currentUser.id); setLoading(true)}}>
            { <IconStar className='favorite-button' fill={tool.starred ? "gold" : "transparent"} stroke={tool.starred ? "gold" : "black"} /> }
          </Tooltip>}
          { loading && <Loader size={"1.25rem"}/> }
        </div>
        <p>{tool.description}</p>
      </Paper>
    </Carousel.Slide>
  )
}

const Tracker = () => {
  return (
    
    <Table.ScrollContainer minWidth={500} type="native">
    <Table striped>
      <Table.Thead>
        <Table.Tr>
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
        </Table.Tr>
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