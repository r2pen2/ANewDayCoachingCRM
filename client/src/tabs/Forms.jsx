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
import { getFormById } from '../api/forms.ts'
import { CRMBreadcrumbs } from '../components/Breadcrumbs.jsx'
import { navigationItems } from '../components/Navigation.jsx'
import { FormCard } from '../components/forms/FormCard.jsx'

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
  const FormsDisplay = () => {

    if (currentUser.formAssignments.length < 1) { 
      return <div className="text-center">
        <Text size='7rem' style={{marginBottom: "2rem"}}>😴</Text>
        <Text>There's nothing for you to complete!</Text>
      </div>
    }

    return (
      currentUser.formAssignments.map((form, index) => <div className="col-4 mb-2" key={index}><FormCard form={form} /></div>)
    )
  }
  
  return (
    <div>
      <Confetti recycle={false} numberOfPieces={confettiLeft} />
      <div className="container-fluid">
        <div className="row pt-2">
          <FormsDisplay />
        </div>
      </div>
    </div>
  )
}
