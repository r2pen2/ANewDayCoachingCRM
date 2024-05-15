import { Blockquote, Button, Modal, Paper, Tooltip } from '@mantine/core'
import React, { useContext, useRef, useState } from 'react'
import "../assets/style/forms.css"
import { IconAlertCircle, IconCheck, IconChevronLeft, IconCircleCheck, IconCircleCheckFilled, IconHelpHexagonFilled, IconInfoCircle, IconQuestionMark } from '@tabler/icons-react'
import { CurrentUserContext } from '../App'

const formHeight = 500
const formWidth = 6404

export default function Forms() {

  const {currentUser} = useContext(CurrentUserContext)

  const forms = {
    PARENTGUARDIAN: {
      title: "Parent / Guardian Application Form",
      description: "Basic information about the student and parent or guardian.",
      complete: false,
      href: `https://docs.google.com/forms/d/e/1FAIpQLSeZ7lFNqQ4KYdrvgoWZ7uo9H82dJ5xXyT4wiB63xU1f23IrTw/viewform?usp=pp_url&entry.986666223=${currentUser.personalData.email}`,
    }
  }

  const FormsList = () => {

    return (
      Object.values(forms).map((form, index) => 
      <Paper key={index} onClick={() => window.open(form.href, "_blank")} className="col-6 col-sm-12 mb-2 p-2 form-paper d-flex flex-row align-items-center justify-content-between" withBorder padding="md" shadow="xs" style={{ width: "100%" }}>
        <div className="form-title">
          <h3>{form.title}</h3>
          <p>{form.description}</p>
        </div>
        {form.complete && <Tooltip label="All set!"><IconCircleCheckFilled color="green" /></Tooltip>}
        {!form.complete && <Tooltip label="This form has not been completed."><IconAlertCircle color="orange" /></Tooltip>}
        <div className="form-decor" />
      </Paper>)
    )
  }

  return (
    <div>
      <div className="d-flex align-items-center flex-column">
        <h2>Forms</h2>
        <p>This is a list of all forms assigned to a given client The client can use this page to fill them out for the first time, confirm that they've been filled, and view them at any point.</p>
      </div>
      <div className="container">
        <div className="row">
          <FormsList />
        </div>
      </div>
    </div>
  )
}
