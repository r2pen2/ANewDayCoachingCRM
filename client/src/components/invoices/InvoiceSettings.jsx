import React, { useContext } from 'react'
import { CurrentUserContext } from '../../App'
import { Card, Group, Switch, Text } from '@mantine/core'
import "../../assets/style/invoices.css"

export default function InvoiceSettings() {

  const {currentUser} = useContext(CurrentUserContext)

  function changeVisibility() {
    currentUser.toggleSetting('invoices.studentVisibility');
  }

  return (
    <Card withBorder p="md" className='w-100 invoice-settings-card'>
      <Text fz="lg" className="invoice-settings-title" fw={500}>
        Invoice Settings
      </Text>
      <Text fz="xs" c="dimmed" mt={3} mb="xl">
        Make changes to invoice visiblity and notifications
      </Text>
      <Group justify='space-between' className="invoice-settings-item" wrap="nowrap" gap="xl">
        <div>
          <Text>Student Accessible</Text>
          <Text size="xs" c="dimmed">
            Allow my student to view and manage invoices
          </Text>
        </div>
        <Switch onLabel="ON" offLabel="OFF" readOnly className="invoice-settings-switch" size='lg' checked={currentUser.settings.invoices.studentVisibility} onClick={changeVisibility}/>
      </Group>
    </Card>
  )
}
