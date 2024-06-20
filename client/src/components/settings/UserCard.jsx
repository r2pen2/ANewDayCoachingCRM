import { Avatar, Button, Paper, Text } from "@mantine/core";
import { memo } from "react";
import { auth } from "../../api/firebase";

export const UserCard = memo(function UserCard({user}) {

  const SettingsAvatar = () => <Avatar mx="auto" src={user.pfpUrl} alt={user.displayName} size={120} style={{marginBottom: "1rem"}} />

  return (
    <div className="col-12 col-md-6 col-lg-4 col-xxl-2 px-0 px-md-2 mb-2 ">
      <Paper withBorder p="lg" className="d-flex flex-column align-items-center" bg="var(--mantine-color-body)">
        <SettingsAvatar />
        <Text ta="center" fz="lg" fw={500} mt="md">{user.displayName}</Text>
        <Text ta="center" fz="sm" c="dimmed">{user.role}</Text>
        <Button mt="md" onClick={() => auth.signOut()}>Sign Out</Button>
      </Paper>
    </div>
  )
})