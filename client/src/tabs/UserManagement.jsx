import { Avatar, Checkbox, Paper, Text, TextInput, Tooltip } from '@mantine/core'
import { IconSearch } from '@tabler/icons-react';
import React from 'react'
import { User } from '../api/db/dbUser.ts';
import { navigationItems } from '../components/Navigation';
import { CRMBreadcrumbs } from '../components/Breadcrumbs.jsx';

export default function UserManagement() {

  const [userQuery, setUserQuery] = React.useState("");
  const [currentUser, setCurrentUser] = React.useState(null);
  const [allUsers, setAllUsers] = React.useState({});

  React.useEffect(() => { User.fetchSearch(navigationItems.ADMINUSERS).then((users) => { setAllUsers(users); }) }, [])

  const UserSearchResults = () => {

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
          <Paper key={index} onClick={setCurrentUser(user)} className={`d-flex mb-2 flex-row justify-content-between align-items-center p-2 user-assignment-paper`} withBorder style={{cursor: "pointer"}} >
            <div className="d-flex flex-row align-items-center justify-content-center">
              <Avatar src={user.personalData.pfpUrl} alt={user.personalData.displayName} />
              <Text style={{marginLeft: "0.5rem"}}>{user.personalData.displayName}</Text>
            </div>
          </Paper>
        )
      })
    )
  }

  return (
    <div>
      <CRMBreadcrumbs items={[{title: "User Management", href: navigationItems.ADMINUSERS}]} />
      <h2>User Management</h2>
      <TextInput style={{marginBottom: "1rem"}} value={userQuery} onChange={(e) => setUserQuery(e.target.value)} placeholder="Search for a user by display name or email..." rightSection={<IconSearch size="1rem" />}/>
      <UserSearchResults />
    </div>
  )
}