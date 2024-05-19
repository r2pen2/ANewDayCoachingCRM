import { Modal, Paper, Text, Tooltip } from '@mantine/core'
import React, { useContext, useEffect, useState } from 'react'
import "../assets/style/forms.css"
import { IconAlertCircle, IconCircleCheckFilled } from '@tabler/icons-react'
import { CurrentUserContext } from '../App'
import Confetti from "react-confetti"
import { FormAssignment, hostname } from '../api/dbManager.ts'
import { getFormById } from '../api/forms.ts'

const dConfetti = 500;

export default function Forms() {

  const {currentUser} = useContext(CurrentUserContext)
  
  const [confettiLeft, setConfettiLeft] = useState(0);

  useEffect(() => {
    if (!currentUser) { return; }
    fetch(`${hostname}/forms/confetti?userId=${currentUser.id}`).then(res => res.json()).then(data => {
      if (data.formId) {
        setConfettiLeft(confettiLeft + dConfetti);
      }
    })
  }, [currentUser, confettiLeft]);

  const FormsList = () => {

    
    return (
      currentUser.formAssignments.map((form, index) => {
        
        const IncompleteNotifier = () => {
          if (form.completed) { return; }
          return (
            <div className="d-flex gap-2 align-items-center flex-column flex-md-row">
              <Text c="orange">Incomplete</Text>
              <Tooltip label="This form has not been completed."><IconAlertCircle color="orange" /></Tooltip>
            </div>
          )
        }

        const CompleteNotifier = () => {
          if (!form.completed) { return; }
          return (
            <div className="d-flex gap-2 align-items-center flex-column flex-md-row">
              <Text c="green">Complete</Text>
              <Tooltip label="All set!"><IconCircleCheckFilled color="green" /></Tooltip>
            </div>
          ) 
        }

        const FormTitle = () => (
          <div className="form-title">
            <h3>{form.formTitle}</h3>
            <p>{form.formDescription}</p>
          </div>
        )

        return (  
          <Paper key={index} onClick={() => window.open(form.assignedLink, "_blank")} className="col-6 col-sm-12 mb-2 p-2 form-paper d-flex flex-row align-items-center justify-content-between" withBorder padding="md" shadow="xs" style={{ width: "100%" }}>
            <FormTitle />
            <CompleteNotifier />
            <IncompleteNotifier />
            <div className="form-decor" />
          </Paper>
        )
      })
    )
  }

  const Header = () => (
    <hgroup className="d-flex align-items-center flex-column">
      <h2>Forms</h2>
      <p>This is a list of all forms assigned to a given client The client can use this page to fill them out for the first time, confirm that they've been filled, and view them at any point.</p>
    </hgroup>
  )
  
  return (
    <div>
      <Confetti recycle={false} numberOfPieces={confettiLeft} />
      <Header />
      <div className="container-fluid">
        <div className="row">
          <FormsList />
        </div>
      </div>
    </div>
  )
}
