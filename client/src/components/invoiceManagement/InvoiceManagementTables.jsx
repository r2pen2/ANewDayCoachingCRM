import { NumberFormatter, Paper, Table } from "@mantine/core";
import { CRMScrollContainer } from "../Tables";
import IconButton from "../IconButton";
import { IconCheck, IconTrash, IconX } from "@tabler/icons-react";
import { getSlashDateString, getTimeString } from "../../api/strings";
import { useState } from "react";
import ModuleHeader from "../dashboard/ModuleHeader";

export const LimboTable = ({invoices, fetchInvoices}) => {

  const limboInvoices = Object.values(invoices).sort((a, b) => a.paidAt - b.paidAt);
  
  const [scrolled, setScrolled] = useState(false);

  const LimboTableHead = () => (
    <Table.Thead className={"scroll-table-header " + (scrolled ? "scrolled" : "")}>
      <Table.Tr>
        <Table.Th>Timestamp</Table.Th>
        <Table.Th>Submitted By</Table.Th>
        <Table.Th>Platform</Table.Th>
        <Table.Th>Memo</Table.Th>
        <Table.Th>Actions</Table.Th>
      </Table.Tr>
    </Table.Thead>
  )

  const LimboRow = ({invoice}) => {           
    function handleAccept() { invoice.accept().then(() => fetchInvoices()) }
    function handleReject() { invoice.reject().then(() => fetchInvoices()) }
  
    return (
      <Table.Tr>
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
  }

  return (
    <div className="col-12 p-1">
      <Paper withBorder>
        <ModuleHeader min>Pending Invoices</ModuleHeader>
        <CRMScrollContainer setScrolled={setScrolled}>
          <Table striped>
            <LimboTableHead scrolled={scrolled}/>
              <Table.Tbody>
                {limboInvoices.map((invoice, index) => <LimboRow invoice={invoice} key={index} />)}
              </Table.Tbody>
          </Table>
        </CRMScrollContainer>
      </Paper>
    </div>
  )
}

export const UnpaidTable = ({invoices, fetchInvoices}) => {

  const unpaidInvoices = Object.values(invoices).sort((a, b) => a.dueAt - b.dueAt);
  
  const [scrolled, setScrolled] = useState(false);

  const UnpaidTableHead = () => (
    <Table.Thead className={"scroll-table-header " + (scrolled ? "scrolled" : "")}>
      <Table.Tr>
        <Table.Th>User</Table.Th>
        <Table.Th>Created</Table.Th>
        <Table.Th>Due</Table.Th>
        <Table.Th>Amount</Table.Th>
        <Table.Th>Actions</Table.Th>
      </Table.Tr>
    </Table.Thead>
  )

  const UnpaidRow = ({invoice}) => {           
    function handleDelete() { 
      if (window.confirm(`Delete invoice from ${invoice.userDisplayName}?`)) {
        invoice.delete().then(() => fetchInvoices())
      }
    }
    function handleReject() { invoice.reject().then(() => fetchInvoices()) }
  
    return (
      <Table.Tr>
        <Table.Td>{invoice.userDisplayName}</Table.Td>
        <Table.Td>{getSlashDateString(invoice.createdAt)}</Table.Td>
        <Table.Td>{getSlashDateString(invoice.dueAt)}</Table.Td>
        <Table.Td><NumberFormatter prefix="$" value={invoice.amount} /></Table.Td>
        <Table.Td className='d-flex gap-2'>
          <IconButton icon={<IconTrash />} color="red.5" onClick={handleDelete} label="Delete" />
          <IconButton icon={<IconX />} color="red" onClick={handleReject} label="Reject" />
        </Table.Td>
      </Table.Tr>
    )
  }

  return (
    <div className="col-12 col-xl-6 px-1 mb-1">
      <Paper withBorder>
        <ModuleHeader min>Unpaid Invoices</ModuleHeader>
        <CRMScrollContainer setScrolled={setScrolled}>
          <Table striped>
            <UnpaidTableHead scrolled={scrolled}/>
              <Table.Tbody>
                {unpaidInvoices.map((invoice, index) => <UnpaidRow invoice={invoice} key={index} />)}
              </Table.Tbody>
          </Table>
        </CRMScrollContainer>
      </Paper>
    </div>
  )
}

export const PaidTable = ({invoices, fetchInvoices}) => {

  const limboInvoices = Object.values(invoices).sort((a, b) => a.paidAt - b.paidAt);
  
  const [scrolled, setScrolled] = useState(false);

  const LimboTableHead = () => (
    <Table.Thead className={"scroll-table-header " + (scrolled ? "scrolled" : "")}>
      <Table.Tr>
        <Table.Th>Timestamp</Table.Th>
        <Table.Th>Submitted By</Table.Th>
        <Table.Th>Platform</Table.Th>
        <Table.Th>Memo</Table.Th>
        <Table.Th>Actions</Table.Th>
      </Table.Tr>
    </Table.Thead>
  )

  const LimboRow = ({invoice}) => {           
    function handleAccept() { invoice.accept().then(() => fetchInvoices()) }
    function handleReject() { invoice.reject().then(() => fetchInvoices()) }
  
    return (
      <Table.Tr>
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
  }

  return (
    <div className="col-12 col-xl-6 mb-1 px-1">
      <Paper withBorder>
        <ModuleHeader min>Paid Invoices</ModuleHeader>
        <CRMScrollContainer setScrolled={setScrolled}>
          <Table striped>
            <LimboTableHead scrolled={scrolled}/>
              {/* <Table.Tbody>
                {limboInvoices.map((invoice, index) => <LimboRow invoice={invoice} key={index} />)}
              </Table.Tbody> */}
          </Table>
        </CRMScrollContainer>
      </Paper>
    </div>
  )
}