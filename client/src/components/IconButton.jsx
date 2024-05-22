import { ActionIcon, Tooltip } from '@mantine/core'
import React from 'react'

/** Abstraction of a structure I seem to be using a lot in this project */
export default function IconButton(props) {
  
  /** Color could come from two places in the props */
  const color = props.color ? props.color : props.buttonProps?.color;

  return (
    <Tooltip label={props.label}>
      <ActionIcon {...props.buttonProps} color={color} disabled={props.disabled} onClick={props.onClick}>
        {props.icon}
      </ActionIcon>
    </Tooltip>
  )
}
