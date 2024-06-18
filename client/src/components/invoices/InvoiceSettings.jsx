import React, { useContext, memo } from 'react'
import { CurrentUserContext } from '../../App'
import { Card, Group, Switch, Text } from '@mantine/core'
import "../../assets/style/invoices.css"

export const InvoiceSettings = memo(function InvoiceSettings({settings}) {

  return (
    <div className="col-12 col-md-6 mh-100 p-2" >
      <Card withBorder p="md" className='card-bg-1 invoice-settings-card h-100'>
        <Text fz="lg" className="invoice-settings-title" fw={500}>
          Invoice Settings
        </Text>
        <Text fz="xs" c="dimmed" mt={3} mb="xl">
          Make changes to invoice visiblity and notifications
        </Text>
        <VisibilitySetting settings={settings} />
        <PendingEmailNotificationSetting settings={settings} />
        <NewInvoiceEmailNotificationSetting settings={settings} />
      </Card>
    </div>
  )
})

const VisibilitySetting = ({settings}) => {
    
  const {currentUser} = useContext(CurrentUserContext)
  
  function changeVisibility() { currentUser.changeInvoiceSetting('studentVisibility', !settings.studentVisibility); }

  return (
    <Group justify='space-between' className="invoice-settings-item" wrap="nowrap" gap="xl">
      <div>
        <Text>Student Accessible</Text>
        <Text size="xs" c="dimmed">
          Allow my student to view and manage invoices
        </Text>
      </div>
      <Switch onLabel="ON" offLabel="OFF" readOnly className="invoice-settings-switch" size='lg' checked={settings.studentVisibility} onClick={changeVisibility}/>
    </Group>
  )
}

const PendingEmailNotificationSetting = ({settings}) => {
    
  const {currentUser} = useContext(CurrentUserContext)
  
  function changePendingNotificationSetting() {
    currentUser.changeInvoiceSetting('pendingStatusEmailNotification', !settings.pendingStatusEmailNotification);
  }

  return (
    <Group justify='space-between' className="invoice-settings-item" wrap="nowrap" gap="xl">
      <div>
        <Text>Pending Update Emails</Text>
        <Text size="xs" c="dimmed">
          Get an email notification when an invoice's pending status is updated
        </Text>
      </div>
      <Switch onLabel="ON" offLabel="OFF" readOnly className="invoice-settings-switch" size='lg' checked={settings.pendingStatusEmailNotification} onClick={changePendingNotificationSetting}/>
    </Group>
  )
}

const NewInvoiceEmailNotificationSetting = ({settings}) => {
    
  const {currentUser} = useContext(CurrentUserContext)
  
  function changeNewNotificationSetting() {
    currentUser.changeInvoiceSetting('newInvoiceEmailNotification', !settings.newInvoiceEmailNotification);
  }

  return (
    <Group justify='space-between' className="invoice-settings-item" wrap="nowrap" gap="xl">
      <div>
        <Text>New Invoice Emails</Text>
        <Text size="xs" c="dimmed">
          Get an email notification when an invoice is assigned to you
        </Text>
      </div>
      <Switch onLabel="ON" offLabel="OFF" readOnly className="invoice-settings-switch" size='lg' checked={settings.newInvoiceEmailNotification} onClick={changeNewNotificationSetting}/>
    </Group>
  )
}