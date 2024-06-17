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
      </Card>
    </div>
  )
})

const VisibilitySetting = ({settings}) => {
    
  const {currentUser} = useContext(CurrentUserContext)
  
  function changeVisibility() {
    currentUser.changeInvoiceSetting('studentVisibility', !settings.studentVisibility);
  }

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