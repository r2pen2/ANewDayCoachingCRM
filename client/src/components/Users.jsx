import { Avatar, Paper, Spoiler, Text } from "@mantine/core";

export const UserSearchResults = ({selectedUser, setSelectedUser, allUsers, userQuery}) => {

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
    <Spoiler showLabel="Show More Users" className="centered-expander" hideLabel="Show Fewer Users" maxHeight={400}> 
      <Paper withBorder className="p-2 d-flex flex-column bg-gray-1 align-items-center justify-content-start gap-2">
        {users.map((user, index) => {
          return (
            <Paper key={index} onClick={() => {setSelectedUser(user)}} className={`d-flex w-100 flex-row justify-content-between align-items-center p-2`} withBorder style={{cursor: "pointer"}} >
              <div className="d-flex flex-row align-items-center justify-content-center">
                <Avatar src={user.personalData.pfpUrl} alt={user.personalData.displayName} />
                <Text style={{marginLeft: "0.5rem"}}>{user.personalData.displayName}</Text>
              </div>
            </Paper>
          )
        })}
      </Paper>
    </Spoiler>
  )
}