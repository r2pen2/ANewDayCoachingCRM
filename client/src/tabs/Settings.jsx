// Library Imports
import React, { useContext, useState } from 'react'
import { Avatar, Badge, Button, Group, Indicator, Input, Paper, Select, Switch, Text, TextInput } from '@mantine/core'

// API Imports
import { auth } from '../api/firebase'

// Component Imports
import { CurrentUserContext } from '../App'
import { HomeworkPriority, HomeworkPriorityVerbosity } from '../api/db/dbHomework.ts'
import { notifSuccess } from '../components/Notifications'
import { LMS } from '../api/db/dbUser.ts'
import { updateAfterSwitchFlip } from '../api/settings.ts'
import { LMSIcon } from '../components/LMS.jsx'

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
      if (verbosity === null) { return; }
      currentUser.changeSetting('priorityVerbosity', verbosity);
      notifSuccess("Priority Verbosity Updated", `The priority verbosity has been set to "${verbosity}".`)
    }

    function handlePulseThresholdChange(threshold) {
      if (threshold === null) { return; }
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

    function handleDisplayNameKeyDown(e) { if (e.key === "Enter") { handleSubmitDisplayName() } }
    function handlePhoneNumberKeyDown(e) { if (e.key === "Enter") { handleSubmitPhoneNumber() } }
    function handleAddressKeyDown(e) { if (e.key === "Enter") { handleSubmitAddress() } }
    function handleCityKeyDown(e) { if (e.key === "Enter") { handleSubmitCity() } }
    function handleStateKeyDown(e) { if (e.key === "Enter") { handleSubmitState() } }
    function handleZipKeyDown(e) { if (e.key === "Enter") { handleSubmitZip() } }

    function handleSubmitDisplayName() { 
      if (tempDisplayName === "") { return; }
      if (tempDisplayName === currentUser.personalData.displayName) { return; }
      currentUser.changePersonalData('displayName', tempDisplayName);
      notifSuccess("Display Name Updated", `You will now be referred to as ${tempDisplayName}.`) 
    }

    function handleSubmitPhoneNumber() { 
      if (tempPhoneNumber === "") { return; }
      if (tempPhoneNumber === currentUser.personalData.phoneNumber) { return; }
      currentUser.changePersonalData('phoneNumber', tempPhoneNumber);
      notifSuccess("Phone Number Updated", `Your phone number has been set to ${tempPhoneNumber}.`) 
    }

    function handleSubmitAddress() { 
      if (tempAddress === "") { return; }
      if (tempAddress === currentUser.personalData.address) { return; }
      currentUser.changePersonalData('address', tempAddress);
      notifSuccess("Address Updated", `Your address has been set to ${tempAddress}.`) 
    }

    function handleSubmitCity() { 
      if (tempCity === "") { return; }
      if (tempCity === currentUser.personalData.city) { return; }
      currentUser.changePersonalData('city', tempCity);
      notifSuccess("City Updated", `Your city has been set to ${tempCity}.`) 
    }

    function handleSubmitState() { 
      if (tempState === "") { return; }
      if (tempState === currentUser.personalData.state) { return; }
      currentUser.changePersonalData('state', tempState);
      notifSuccess("State Updated", `Your state has been set to ${tempState}.`) 
    }

    function handleSubmitZip() { 
      if (tempZip === "") { return; }
      if (tempZip === currentUser.personalData.zip) { return; }
      currentUser.changePersonalData('zip', tempZip);
      notifSuccess("Zip Code Updated", `Your zip code has been set to ${tempZip}.`) 
    }


    return (
      <div className="container-fluid px-0 py-2">
        <div className="row">
          <TextInput
            className="col-12 col-md-6" 
            label="Display Name"
            placeholder='Johnny Appleseed' 
            value={tempDisplayName} 
            onChange={e => setTempDisplayName(e.target.value)}
            onBlur={handleSubmitDisplayName}
            onKeyDown={handleDisplayNameKeyDown}
          />        
          <TextInput
            className="col-12 col-md-6" 
            label="Email" 
            disabled 
            type='email'
            placeholder='hire@joed.dev' 
            value={currentUser.personalData.email}
          />        
          <TextInput
            className="col-12 col-md-6" 
            label="Phone Number"
            placeholder='(202) 456-1111'
            value={tempPhoneNumber}
            type="tel"
            onChange={e => setTempPhoneNumber(e.target.value)}
            onBlur={handleSubmitPhoneNumber}
            onKeyDown={handlePhoneNumberKeyDown}
          />        
        </div>
        <div className="row">
          <TextInput
            className="col-12 col-md-6"
            label="Address"
            placeholder='1600 Pennsylvania Avenue'
            value={tempAddress}
            onChange={e => setTempAddress(e.target.value)}
            onBlur={handleSubmitAddress}
            onKeyDown={handleAddressKeyDown}
          />
          <TextInput
            className="col-12 col-md-6"
            label="City"
            placeholder='Washington'
            value={tempCity}
            onChange={e => setTempCity(e.target.value)}
            onBlur={handleSubmitCity}
            onKeyDown={handleCityKeyDown}
          />
          <TextInput
            className="col-12 col-md-6"
            label="State"
            placeholder='District of Columbia' 
            value={tempState}
            onChange={e => setTempState(e.target.value)}
            onBlur={handleSubmitState}
            onKeyDown={handleStateKeyDown}
          />
          <TextInput
            className="col-12 col-md-6"
            label="Zip"
            placeholder='20500'
            value={tempZip}
            onChange={e => setTempZip(e.target.value)}
            onBlur={handleSubmitZip}
            onKeyDown={handleZipKeyDown}
          />
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

  const SchoolSettings = () => {
    
    const [tempAdvisorName, setTempAdvisorName] = useState(currentUser.schoolInfo.advisorName)
    const [tempAdvisorHref, setTempAdvisorHref] = useState(currentUser.schoolInfo.advisorHref)
    const [tempAdvisorEmail, setTempAdvisorEmail] = useState(currentUser.schoolInfo.advisorEmail)
    const [tempAdvisorOffice, setTempAdvisorOffice] = useState(currentUser.schoolInfo.advisorOffice)
    const [tempLMSHref, setTempLMSHref] = useState(currentUser.schoolInfo.LMSHref)
    const [tempLMSName, setTempLMSName] = useState(currentUser.schoolInfo.LMSName)

    function handleLMSNameChange(lms) {
      if (lms === null) { return; }
      setTempLMSName(lms);
      currentUser.changeSchoolInfo('LMSName', lms);
      notifSuccess("LMS Updated", `The Learning Management System has been set to "${lms}".`)
    }

    function handleLMSLinkChange(e) {
      const link = e.target.value
      setTempLMSHref(link);
      if (link.toLowerCase().includes("canvas")) { setTempLMSName(LMS.CANVAS); return; }
      if (link.toLowerCase().includes("blackboard")) { setTempLMSName(LMS.BLACKBOARD); return; }
      if (link.toLowerCase().includes("classroom")) { setTempLMSName(LMS.GOOGLE_CLASSROOM); return; }
      if (link.toLowerCase().includes("schoology")) { setTempLMSName(LMS.SCHOOLOGY); return; }
      setTempLMSName(LMS.OTHER);
    }

    function handleLMSLinkKeyDown(e) { if (e.key === "Enter") { handleLMSLinkSubmit() } }
    function handleAdvisorNameKeyDown(e) { if (e.key === "Enter") { handleAdvisorNameSubmit() } }
    function handleAdvisorOfficeKeyDown(e) { if (e.key === "Enter") { handleAdvisorOfficeSubmit() } }
    function handleAdvisorEmailKeyDown(e) { if (e.key === "Enter") { handleAdvisorEmailSubmit() } }
    function handleAdvisorHrefKeyDown(e) { if (e.key === "Enter") { handleAdvisorHrefSubmit() } }

    function handleLMSLinkSubmit() {
      if (tempLMSHref === "") { return; }
      if (tempLMSHref === currentUser.schoolInfo.LMSHref) { return; }
      currentUser.changeSchoolInfo('LMSHref', tempLMSHref);
      notifSuccess("LMS Link Updated", `The Learning Management System link has been set to ${tempLMSHref}.`)
      if (tempLMSName === currentUser.schoolInfo.LMSName) { return; }
      currentUser.changeSchoolInfo('LMSName', tempLMSName);
    }

    function handleAdvisorNameSubmit() {
      if (tempAdvisorName === "") { return; }
      if (tempAdvisorName === currentUser.schoolInfo.advisorName) { return; }
      currentUser.changeSchoolInfo('advisorName', tempAdvisorName);
      notifSuccess("Advisor Name Updated", `The advisor's name has been set to ${tempAdvisorName}.`)
    }

    function handleAdvisorHrefSubmit() {
      if (tempAdvisorHref === "") { return; }
      if (tempAdvisorHref === currentUser.schoolInfo.advisorHref) { return; }
      currentUser.changeSchoolInfo('advisorHref', tempAdvisorHref);
      notifSuccess("Advisor Link Updated", `The advisor's link has been set to ${tempAdvisorHref}.`)
    }

    function handleAdvisorEmailSubmit() {
      if (tempAdvisorEmail === "") { return; }
      if (tempAdvisorEmail === currentUser.schoolInfo.advisorEmail) { return; }
      currentUser.changeSchoolInfo('advisorEmail', tempAdvisorEmail);
      notifSuccess("Advisor Email Updated", `The advisor's email has been set to ${tempAdvisorEmail}.`)
    }

    function handleAdvisorOfficeSubmit() {
      if (tempAdvisorOffice === "") { return; }
      if (tempAdvisorOffice === currentUser.schoolInfo.advisorOffice) { return; }
      currentUser.changeSchoolInfo('advisorOffice', tempAdvisorOffice);
      notifSuccess("Advisor Office Updated", `The advisor's office has been set to ${tempAdvisorOffice}.`)
    }

    return (
      <div className="container-fluid px-0 py-2">
        <div className="row">
          <TextInput
            className="col-12 col-md-6" 
            label="Advisor Name" 
            placeholder='Talia Wendigo'
            value={tempAdvisorName}
            onChange={t => setTempAdvisorName(t)}
            onBlur={handleAdvisorNameSubmit}
            onKeyDown={handleAdvisorNameKeyDown}
          />        
          <TextInput
            className="col-12 col-md-6" 
            label="Adviror Link" 
            placeholder='https://www.myschool.edu/advisors/talia-wendigo'
            type='url'
            value={tempAdvisorHref}
            onChange={t => setTempAdvisorHref(t)}
            onBlur={handleAdvisorHrefSubmit}
            onKeyDown={handleAdvisorHrefKeyDown}
          />        
          <TextInput
            className="col-12 col-md-6" 
            label="Advisor Email" 
            placeholder='twendigo@myschool.edu'
            value={tempAdvisorEmail}
            onChange={t => setTempAdvisorEmail(t)}
            onBlur={handleAdvisorEmailSubmit}
            onKeyDown={handleAdvisorEmailKeyDown}
          />
          <TextInput
            className="col-12 col-md-6" 
            label="Advisor Office" 
            placeholder='The Woods and The Prairies'
            value={tempAdvisorOffice}
            onChange={t => setTempAdvisorOffice(t)}
            onBlur={handleAdvisorOfficeSubmit}
            onKeyDown={handleAdvisorOfficeKeyDown}
          />
        </div>
        <Group justify='space-between' align="flex-end" className="settings-item gap-2" wrap="nowrap" >
          <TextInput
            leftSection={<LMSIcon name={tempLMSName} />}
            className="w-100"
            label="LMS Link"
            type='url'
            placeholder='https://lms.myschool.edu/'
            value={tempLMSHref}
            onChange={handleLMSLinkChange}
            onBlur={handleLMSLinkSubmit}
            onKeyDown={handleLMSLinkKeyDown}
          />
          <Select label="LMS Name" data={[LMS.BLACKBOARD, LMS.CANVAS, LMS.GOOGLE_CLASSROOM, LMS.SCHOOLOGY, LMS.OTHER]} value={tempLMSName} onChange={handleLMSNameChange}/>
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
            <Text fz="xl" fw={500}>School Settings</Text>
            <SchoolSettings />
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