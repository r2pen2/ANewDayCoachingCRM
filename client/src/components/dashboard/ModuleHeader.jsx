import { Text } from '@mantine/core'
import React from 'react'

export default function ModuleHeader(props) {
  return (
    <div style={{height: 50}} className="green-bg mb-2 text-center d-flex align-items-center justify-content-center w-100">
      <Text size="xl">{props.children}</Text>
    </div>
  )
}
