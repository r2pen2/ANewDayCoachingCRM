import { ActionIcon, Tooltip } from '@mantine/core'
import React from 'react'

/** Abstraction of a structure I seem to be using a lot in this project */
export default function IconButton(props) {
  return (
    <Tooltip label={props.label}>
      <ActionIcon {...props.buttonProps} onClick={props.onClick}>
        {props.icon}
      </ActionIcon>
    </Tooltip>
  )
}
