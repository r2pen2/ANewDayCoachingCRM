import { Table } from "@mantine/core";

export const ToolTableHead = ({scrolled}) => (
  <Table.Thead className={"header " + (scrolled ? "scrolled" : "")}>
    <Table.Tr>
      <Table.Th>Name</Table.Th>
      <Table.Th>Description</Table.Th>
      <Table.Th>Users</Table.Th>
      <Table.Th>Actions</Table.Th>
    </Table.Tr>
  </Table.Thead>
)