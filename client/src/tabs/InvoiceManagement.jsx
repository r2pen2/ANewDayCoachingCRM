// Library Imports
import React from 'react'
import { Avatar, Button, Modal, NumberInput, Paper, Table, Text, TextInput, Tooltip } from '@mantine/core'
import { DateInput } from "@mantine/dates"
import { IconCheck, IconSearch, IconX } from '@tabler/icons-react'

// API Imports
import { Invoice, LimboInvoice } from '../api/db/dbInvoice.ts'
import { User } from '../api/db/dbUser.ts'
import { getSlashDateString, getTimeString } from '../api/strings.js'

// Component Imports
import { navigationItems } from '../components/Navigation.jsx'
import { notifSuccess } from '../components/Notifications.jsx'

// Style Imports
import '@mantine/dates/styles.css';
import IconButton from '../components/IconButton.jsx'
import { CRMBreadcrumbs } from '../components/Breadcrumbs.jsx'

export default function InvoiceManagement() {
  
  function fetchInvoices() { LimboInvoice.getAll().then((invoices) => { setInvoices(invoices); }) }

  const [invoices, setInvoices] = React.useState([])
  const [allUsers, setAllUsers] = React.useState({});
  const [userQuery, setUserQuery] = React.useState("");
  const [dueDate, setDueDate] = React.useState(null)
  const [href, setHref] = React.useState("")
  const [amount, setAmount] = React.useState("")
  const [createMenuOpen, setCreateMenuOpen] = React.useState(false);
  React.useEffect(() => {
    fetchInvoices()
    User.fetchSearch(navigationItems.ADMINFORMS).then((users) => { setAllUsers(users); })
  }, [])

  function createInvoice(event) {
    event.preventDefault()
    
    if (window.confirm(`Send ${selectedUser.personalData.displayName} an invoice for $${amount}?`)) {
      Invoice.create(href, amount, selectedUser, dueDate).then(() => {
        fetchInvoices()
        notifSuccess("Invoice Created", `Invoice sent to ${selectedUser.personalData.displayName}`)
      })
    }

  }

  const [selectedUser, setSelectedUser] = React.useState(null)

  const UserSearchResults = () => {

    if (selectedUser) { return; }

    let users = Object.values(allUsers);

    if (userQuery.length > 0) {
      users = users.filter((user) => { return user.personalData.displayName.includes(userQuery) || user.personalData.email.includes(userQuery) })
    }

    // Let's sort alphabetically by displayName, too
    users.sort((a, b) => a.personalData.displayName.localeCompare(b.personalData.displayName))

    if (users.length === 0) {
      return <Text>No users found.</Text>
    }

    return (
      users.map((user, index) => {
        return (
          <Paper key={index} onClick={() => {setSelectedUser(user)}} className={`d-flex mb-2 flex-row justify-content-between align-items-center p-2`} withBorder style={{cursor: "pointer"}} >
            <div className="d-flex flex-row align-items-center justify-content-center">
              <Avatar src={user.personalData.pfpUrl} alt={user.personalData.displayName} />
              <Text style={{marginLeft: "0.5rem"}}>{user.personalData.displayName}</Text>
            </div>
          </Paper>
        )
      })
    )
  }

  function handleSearchChange(event) {
    if (selectedUser) { setSelectedUser(null) }
    setUserQuery(event.target.value)
  }


  const LimboTable = () => {
    if (invoices.length === 0) { return <Text>No invoices to review.</Text> }
    return (
    <Table.ScrollContainer minWidth={500} type="native">
      <Table striped>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>
              Timestamp
            </Table.Th>
            <Table.Th>
              Submitted By
            </Table.Th>
            <Table.Th>
              Platform
            </Table.Th>
            <Table.Th>
              Memo
            </Table.Th>
            <Table.Th>
              Actions
            </Table.Th>
          </Table.Tr>
        </Table.Thead>

        <Table.Tbody>
          {Object.values(invoices).sort((a, b) => a.paidAt - b.paidAt).map((invoice, index) => {

            function handleAccept() { invoice.accept().then(() => fetchInvoices()) }
            function handleReject() { invoice.reject().then(() => fetchInvoices()) }

            return (
              <Table.Tr key={index}>
                <Table.Td>{getSlashDateString(invoice.paidAt)} {getTimeString(invoice.paidAt)}</Table.Td>
                <Table.Td>{invoice.userDisplayName}</Table.Td>
                <Table.Td><strong style={{color: invoice.getPlatformColor()}}>{invoice.limbo}</strong></Table.Td>
                <Table.Td>{invoice.generateMemo()}</Table.Td>
                <Table.Td className='d-flex gap-2'>
                  <IconButton icon={<IconCheck />} color="green" onClick={handleAccept} label="Accept" />
                  <IconButton icon={<IconX />} color="red" onClick={handleReject} label="Reject" />
                </Table.Td>
              </Table.Tr>
            )
          })}
        </Table.Tbody>
      </Table>
    </Table.ScrollContainer>
  )}

  const submitReady = selectedUser && dueDate && amount > 0 && href.length > 0

  const AssignmentConfirmation = () => (
    <div className="d-flex flex-row justify-content-end align-items-center p-2 gap-2">
      { selectedUser && <Avatar src={selectedUser.personalData.pfpUrl} alt={selectedUser.personalData.displayName} />}
      <Button type="submit" disabled={!submitReady}>Create Invoice</Button>
    </div>
  )

  function handleCreateModalClose() {
    setCreateMenuOpen(false);
    setSelectedUser(null)
    setUserQuery("")
    setDueDate(null)
  }

  return (
    <div>
      <CRMBreadcrumbs items={[{title: "Invoice Management", href: navigationItems.ADMININVOICES}]} />
      <Button onClick={() => setCreateMenuOpen(true)}>Create A New Invoice</Button>
      <Modal opened={createMenuOpen} onClose={handleCreateModalClose} title="Create A New Invoice">
        <form onSubmit={createInvoice} className="gap-2 d-flex flex-column">
          <TextInput id="href" label="Link" placeholder="Enter a link to the invoice" required onChange={(e) => setHref(e.target.value)} />
          <NumberInput id="amount" label="Amount" placeholder="Enter the invoice amount" required leftSection="$" onChange={(v) => setAmount(parseInt(v))} />
          <DateInput value={dueDate} required label="Due Date" placeholder="Due date" onChange={setDueDate} />
          <TextInput label="User" required style={{marginBottom: "1rem"}} value={selectedUser ? selectedUser.personalData.displayName : userQuery} onChange={handleSearchChange} placeholder="Search for a user by display name or email..." rightSection={<IconSearch size="1rem" />}/>
          <UserSearchResults />
          <AssignmentConfirmation />
        </form>
      </Modal>
      <h3>Inbox</h3>
      <LimboTable />
    </div>
  )
}
