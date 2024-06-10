import React from 'react'

export default function DashboardSectionHeader(props) {
  return (
    <div className="mt-1 d-flex align-items-center">
      <div className="coaching-line m-2" />
      <h3 style={{minWidth: "fit-content"}}>{props.children}</h3>
      <div className="coaching-line m-2" />
    </div>
  )
}
