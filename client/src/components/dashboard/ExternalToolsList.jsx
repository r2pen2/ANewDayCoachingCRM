import React from 'react'
import DashboardSectionHeader from './DashboardSectionHeader'
import { Paper, Spoiler } from '@mantine/core'
import ModuleHeader from './ModuleHeader'

export default function ExternalToolsList({height}) {
  return (
    
    <Paper withBorder className="mb-2" style={{height: height}}>
      <ModuleHeader>My External Resources</ModuleHeader>
      <div className="p-2">
        <Spoiler maxHeight={180} showLabel="See All Resources" hideLabel="Collapse Resources" className="centered-expander">
          <div className="container-fluid">
            <div className="row">
              {/* <DocList /> */}
            </div>
          </div>
        </Spoiler>
      </div>
    </Paper>
  )
}
