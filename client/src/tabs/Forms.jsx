// Library Imports
import {Paper, Text, Tooltip } from '@mantine/core'
import React, { useContext, useEffect, useState } from 'react'
import { IconAlertCircle, IconCircleCheckFilled } from '@tabler/icons-react'
import Confetti from "react-confetti"

// Component Imports
import { CurrentUserContext } from '../App'

// API Imports
import { hostname } from '../api/db/dbManager.ts'

// Style Imports
import "../assets/style/forms.css"
import { notifSuccess } from '../components/Notifications.jsx'
import { allForms, getFormById } from '../api/forms.ts'

/** How much confetti to add when a form is completed */
const dConfetti = 500;

export default function Forms() {

  /** Current user */
  const {currentUser} = useContext(CurrentUserContext)
  
  /** How much confetti to throw */
  const [confettiLeft, setConfettiLeft] = useState(0);

  useEffect(() => {
    if (!currentUser) { return; }
    fetch(`${hostname}/forms/confetti?userId=${currentUser.id}`).then(res => res.json()).then(data => {
      if (data.formId) {
        setConfettiLeft(confettiLeft + dConfetti);
        notifSuccess("Form Completed", `Thanks for completing ${getFormById(data.formId).formTitle}! 🎉`)
      }
    })
  }, [currentUser, confettiLeft]);

  /** List of all forms. Clicking a form brings the user to the Google Form in a new tab */
  const FormsList = () => {

    if (currentUser.formAssignments.length < 1) { 
      return <div className="text-center">
        <Text size='7rem' style={{marginBottom: "2rem"}}>😴</Text>
        <Text>There's nothing for you to complete!</Text>
      </div>
    }

    return (
      currentUser.formAssignments.map((form, index) => {
        
        /** Component that displays a "Incomplete" message when the form is incomplete */
        const IncompleteNotifier = () => {
          if (form.completed) { return; }
          return (
            <div className="d-flex gap-2 align-items-center flex-column flex-md-row">
              <Text c="orange">Incomplete</Text>
              <Tooltip label="This form has not been completed."><IconAlertCircle color="orange" /></Tooltip>
            </div>
          )
        }

        /** Component that displays a "Complete" message when the form has been completed */
        const CompleteNotifier = () => {
          if (!form.completed) { return; }
          return (
            <div className="d-flex gap-2 align-items-center flex-column flex-md-row">
              <Text c="green">Complete</Text>
              <Tooltip label="All set!"><IconCircleCheckFilled color="green" /></Tooltip>
            </div>
          ) 
        }

        /** This is the left content on the form card: title and description */
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
            <div className="form-decor" style={{backgroundColor: form.completed ? "#008000" : "#ffa500"}} />
          </Paper>
        )
      })
    )
  }

  /** Header that describes the Forms page */
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
