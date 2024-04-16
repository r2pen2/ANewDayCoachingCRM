import { Blockquote, Paper, Tooltip } from '@mantine/core'
import React from 'react'
import "../assets/style/forms.css"
import { IconAlertCircle, IconCheck, IconCircleCheck, IconCircleCheckFilled, IconHelpHexagonFilled, IconInfoCircle, IconQuestionMark } from '@tabler/icons-react'

const forms = [
  {
    title: "Client Intake Form",
    description: "Basic information about the client: name, address, phone number, etc.",
    complete: false,
  },
  {
    title: "About Me Form",
    description: "Information about the client's background, family, and other personal details.",
    complete: true,
  },
]

export default function Forms() {
  
  const FormsList = () => {
    return (
      forms.map((form, index) => 
      <Paper key={index} className="col-6 col-sm-12 mb-2 p-2 form-paper d-flex flex-row align-items-center justify-content-between" withBorder padding="md" shadow="xs" style={{ width: "100%" }}>
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
      
      <Blockquote color="blue" icon={<IconInfoCircle />} mt="xl">
        1. I've just figured out how to send POST requests from Google Form submissions! This means that we can redirect a user to a Google Form, have Google tell us when the form is completed, and then validate a response right here. Seamless integration. Super cool.<br />
        2. This page could have an in-app form entry tool, rather than have the user redirected to a google form. This would be nice for having everything in one place, but it would make it difficult for you to edit forms. I think this is unnecessary, especially when we can just listen for Google Form responses.<br />
      </Blockquote>
    </div>
  )
}
