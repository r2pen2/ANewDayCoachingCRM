// Library Imports
import React, { useContext, useState } from 'react'
import { Avatar, Badge, Button, Group, Indicator, Input, Paper, Select, Switch, Text, TextInput } from '@mantine/core'

// API Imports
import { auth } from '../api/firebase'

// Component Imports
import { CurrentUserContext } from '../App'
import { HomeworkPriority, HomeworkPriorityVerbosity } from '../api/db/dbHomework.ts'
import { notifSuccess } from '../components/Notifications'
import { UserRole } from '../api/db/dbUser.ts'
import { updateAfterSwitchFlip } from '../api/settings.ts'

export default function Settings() {

  const {currentUser} = useContext(CurrentUserContext)

  
  const GeneralSettings = () => {
    
    const [tempDarkmodeSetting, setTempDarkmodeSetting] = useState(currentUser.settings.darkMode)
    
    function changeDarkmode() {
      updateAfterSwitchFlip(tempDarkmodeSetting, setTempDarkmodeSetting, () => {
        currentUser.changeSetting('darkMode', !currentUser.settings.darkMode);
        notifSuccess("Color Theme Updated", `Darkmode has been turned ${currentUser.settings.darkMode ? "on" : "off"}.`)
      })
    }

    return (
      <div className="py-2">
        <Group justify='space-between' className="settings-item" wrap="nowrap" gap="xl">
          <div>
            <Text>Darkmode (In Progress)</Text>
            <Text size="xs" c="dimmed">
              Switch to the dark color scheme
            </Text>
          </div>
          <Switch onLabel="ON" offLabel="OFF" readOnly className="settings-switch" size='lg' checked={tempDarkmodeSetting} onClick={changeDarkmode}/>
        </Group>
      </div>
    )
  }

  const HomeworkTrackerSettings = () => {
    
    function getPriorityVerbosityExampleText() {
      switch (currentUser.settings.priorityVerbosity) {
        case HomeworkPriorityVerbosity.VERBOSE:
          return "High Priority";
        case HomeworkPriorityVerbosity.COLORS:
          return "";
        case HomeworkPriorityVerbosity.MINIMAL:
          return "H";
        default:
          return "High";
      }
    }

    const [tempDeadlineHours, setTempDeadlineHours] = useState(currentUser.settings.ringDeadlineThresholdHours)

    function handleThresholdKeyDown(e) {
      if (e.key === "Enter") { handleSubmitThreshold() }
    }

    function handleSubmitThreshold() {
      currentUser.changeSetting('ringDeadlineThresholdHours', tempDeadlineHours);
      notifSuccess("Ring Deadline Threshold Updated", `The Assignment Tracker's ring deadline threshold has been set to ${tempDeadlineHours} hours.`)
    }

    function handleVerbosityChange(verbosity) {
      currentUser.changeSetting('priorityVerbosity', verbosity);
      notifSuccess("Priority Verbosity Updated", `The priority verbosity has been set to "${verbosity}".`)
    }

    function handlePulseThresholdChange(threshold) {
      currentUser.changeSetting('priorityPulseThreshold', threshold);
      notifSuccess("Priority Pulse Threshold Updated", `The priority pulse threshold has been set to "${threshold}".`)
    }

    const [tempDeleteConfirmationSetting, setTempDeleteConfirmationSetting] = useState(currentUser.settings.requireHomeworkDeleteConfirmation)

    function handleDeleteConfirmationChange() {
      updateAfterSwitchFlip(tempDeleteConfirmationSetting, setTempDeleteConfirmationSetting, () => {
        currentUser.changeSetting('requireHomeworkDeleteConfirmation', !currentUser.settings.requireHomeworkDeleteConfirmation);
        notifSuccess("Delete Confirmation Updated", `You will ${currentUser.settings.requireHomeworkDeleteConfirmation ? "now" : "no longer"} be asked to confirm before deleting an assignment.`)
      })
    }
    
    return (
      <div className="py-2">
        <Group justify='space-between' className="settings-item" wrap="nowrap" gap="xl">
          <div>
            <Text>Priority Verbosity</Text>
            <Text size="xs" c="dimmed">
              How verbose should the priority indicators be?
            </Text>
          </div>
          <div className="d-flex gap-3 align-items-center">
            { currentUser.settings.priorityVerbosity !== HomeworkPriorityVerbosity.COLORS ? <Badge color="red">{getPriorityVerbosityExampleText()}</Badge> : <Indicator color="red" processing /> }
            <Select data={[HomeworkPriorityVerbosity.COLORS, HomeworkPriorityVerbosity.MINIMAL, HomeworkPriorityVerbosity.DEFAULT, HomeworkPriorityVerbosity.VERBOSE]} defaultValue={currentUser.settings.priorityVerbosity} onChange={handleVerbosityChange}/>
          </div>
        </Group>
        <Group justify='space-between' className="settings-item" wrap="nowrap" gap="xl">
          <div>
            <Text>Priority Pulse Threshold</Text>
            <Text size="xs" c="dimmed">
              When verbosity is set to "Colors", at which priority do priority indicators begin to pulse?
            </Text>
          </div>
          <div className="d-flex gap-3 align-items-center">
            <Indicator color="red" processing />
            <Select disabled={currentUser.settings.priorityVerbosity !== HomeworkPriorityVerbosity.COLORS} data={[HomeworkPriority.HIGH, HomeworkPriority.MEDIUM, HomeworkPriority.LOW]} defaultValue={currentUser.settings.priorityPulseThreshold} onChange={handlePulseThresholdChange}/>
          </div>
        </Group>
        <Group justify='space-between' className="settings-item" wrap="nowrap" gap="xl">
          <div>
            <Text>Conform Assignment Deletion</Text>
            <Text size="xs" c="dimmed">
              Require confirmation of a popup before assignments are allowed to be deleted
            </Text>
          </div>
          <Switch onLabel="ON" offLabel="OFF" readOnly className="settings-switch" size='lg' checked={tempDeleteConfirmationSetting} onClick={handleDeleteConfirmationChange}/>
        </Group>
        <Group justify='space-between' className="settings-item" wrap="nowrap" gap="xl">
          <div>
            <Text>Ring Deadline Threshold (Hours)</Text>
            <Text size="xs" c="dimmed">
              When set to "Deadline", the Assignment Tracker ring will include only assignments that are due within this many hours
            </Text>
          </div>
          <TextInput type="number" value={tempDeadlineHours} placeholder='24' onChange={e => setTempDeadlineHours(parseInt(e.target.value))} onBlur={handleSubmitThreshold} onKeyDown={handleThresholdKeyDown}/>
        </Group>
      </div>
    )
  }

  const PersonalInformationSettings = () => {
    
    const [tempDisplayName, setTempDisplayName] = useState(currentUser.personalData.displayName)
    const [tempPhoneNumber, setTempPhoneNumber] = useState(currentUser.personalData.phoneNumber)
    const [tempAddress, setTempAddress] = useState(currentUser.personalData.address)
    const [tempCity, setTempCity] = useState(currentUser.personalData.city)
    const [tempState, setTempState] = useState(currentUser.personalData.state)
    const [tempZip, setTempZip] = useState(currentUser.personalData.zip)

    return (
      <div className="container-fluid px-0 py-2">
        <div className="row">
          <TextInput className="col-12 col-md-6" label="Display Name" placeholder='Johnny Appleseed' value={tempDisplayName} onChange={t => setTempDisplayName(t)}/>        
          <TextInput className="col-12 col-md-6" label="Email" disabled placeholder='hire@joed.dev' value={currentUser.personalData.email}/>        
          <TextInput className="col-12 col-md-6" label="Phone Number" placeholder='(202) 456-1111' value={tempPhoneNumber} onChange={t => setTempPhoneNumber(t)}/>        
        </div>
        <div className="row">
          <TextInput className="col-12 col-md-6" label="Address" placeholder='1600 Pennsylvania Avenue' value={tempAddress} onChange={t => setTempAddress(t)}/>
          <TextInput className="col-12 col-md-6" label="City" placeholder='Washington' value={tempCity} onChange={t => setTempCity(t)}/>
          <TextInput className="col-12 col-md-6" label="State" placeholder='District of Columbia' value={tempState} onChange={t => setTempState(t)}/>
          <TextInput className="col-12 col-md-6" label="Zip" placeholder='20500' value={tempZip} onChange={t => setTempZip(t)}/>
        </div>
      </div>
    )
  }

  const InvoiceSettings = () => {

    const [tempStudentAccessibleSetting, setTempStudentAccessibleSetting] = useState(currentUser.settings.invoices.studentVisibility)
    const [tempPendingNotificationSetting, setTempPendingNotificationSetting] = useState(currentUser.settings.invoices.pendingStatusEmailNotification)
    const [tempNewNotificationSetting, setTempNewNotificationSetting] = useState(currentUser.settings.invoices.newInvoiceEmailNotification)

    function handleStudentVisibilityChange() {
      updateAfterSwitchFlip(tempStudentAccessibleSetting, setTempStudentAccessibleSetting, () => {
        currentUser.changeInvoiceSetting('studentVisibility', !currentUser.settings.invoices.studentVisibility);
        notifSuccess("Student Access Updated", `Your student can now ${currentUser.settings.invoices.studentVisibility ? "no longer" : ""} view and manage invoices.`)
      })
    }
    
    function handlePendingNotificationChange() {
      updateAfterSwitchFlip(tempPendingNotificationSetting, setTempPendingNotificationSetting, () => {
        currentUser.changeInvoiceSetting('pendingStatusEmailNotification', !currentUser.settings.invoices.pendingStatusEmailNotification);
        notifSuccess("Email Preferences Updated Updated", `You will now ${currentUser.settings.invoices.pendingStatusEmailNotification ? "" : "no longer"} receive an email when the pending status of an invoice is updated.`)
      })
    }

    function handleNewNotificationChange() {
      updateAfterSwitchFlip(tempNewNotificationSetting, setTempNewNotificationSetting, () => {
        currentUser.changeInvoiceSetting('newInvoiceEmailNotification', !currentUser.settings.invoices.newInvoiceEmailNotification);
        notifSuccess("Email Preferences Updated Updated", `You will now ${currentUser.settings.invoices.newInvoiceEmailNotification ? "" : "no longer"} receive an email when a new invoice is assigned to you.`)
      })
    }

    return (
      <div className="py-2">
        <Group justify='space-between' className="settings-item" wrap="nowrap" gap="xl">
          <div>
            <Text>Student Accessible (Coming Soon)</Text>
            <Text size="xs" c="dimmed">
              Allow my student to view and manage invoices
            </Text>
          </div>
          <Switch onLabel="ON" offLabel="OFF" readOnly className="settings-switch" size='lg' checked={tempStudentAccessibleSetting} onClick={handleStudentVisibilityChange}/>
        </Group>
        <Group justify='space-between' className="settings-item" wrap="nowrap" gap="xl">
          <div>
            <Text>Pending Update Emails (Coming Soon)</Text>
            <Text size="xs" c="dimmed">
              Get an email notification when an invoice's pending status is updated
            </Text>
          </div>
          <Switch onLabel="ON" offLabel="OFF" readOnly className="settings-switch" size='lg' checked={tempPendingNotificationSetting} onClick={handlePendingNotificationChange}/>
        </Group>
        <Group justify='space-between' className="settings-item" wrap="nowrap" gap="xl">
          <div>
            <Text>New Invoice Emails (Coming Soon)</Text>
            <Text size="xs" c="dimmed">
              Get an email notification when a invoice is assigned to
            </Text>
          </div>
          <Switch onLabel="ON" offLabel="OFF" readOnly className="settings-switch" size='lg' checked={tempNewNotificationSetting} onClick={handleNewNotificationChange}/>
        </Group>
      </div>
    )
  }

  return (
    <div className="d-flex flex-column gap-2 align-items-center justify-content-center p-2 container-fluid">
      <div className="row w-100">
        <div className="col-12 col-md-6 col-lg-4 col-xxl-2 ">
          <Paper withBorder p="lg" className="d-flex flex-column align-items-center" bg="var(--mantine-color-body)">
            <SettingsAvatar currentUser={currentUser} />
            <Text ta="center" fz="lg" fw={500} mt="md">{currentUser.personalData.displayName}</Text>
            <Text ta="center" fz="sm" c="dimmed">{currentUser.personalData.role}</Text>
            <Button mt="md" onClick={() => auth.signOut()}>Sign Out</Button>
          </Paper>
        </div>
        <div className="col-12 col-md-6 col-lg-8 col-xxl-10 px-0">
          <Paper withBorder p="lg" className="d-flex flex-column" bg="var(--mantine-color-body)">
            <Text fz="xl" fw={500}>Personal Information</Text>
            <PersonalInformationSettings />
            <Text fz="xl" fw={500}>General Settings</Text>
            <GeneralSettings />
            <Text fz="xl" fw={500}>Homework Tracker Settings</Text>
            <HomeworkTrackerSettings />
            <Text fz="xl" fw={500}>Invoice Settings</Text>
            <InvoiceSettings />
          </Paper>
        </div>
      </div>
    </div>
  )
}

const SettingsAvatar = ({currentUser}) => <Avatar mx="auto" src={currentUser.personalData.pfpUrl} alt={currentUser.personalData.displayName} size={120} style={{marginBottom: "1rem"}} />