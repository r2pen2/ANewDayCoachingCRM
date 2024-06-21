import { Avatar, Paper, Text } from "@mantine/core";

export const PersonalData = ({user}) => {
  if (!user) { return; }
  return (
    <div className="p-2 d-flex flex-row">
      <Avatar mx="auto" src={user.pfpUrl} alt={user.displayName} size={120} style={{marginBottom: "1rem"}} />
      <div className="d-flex flex-column">      
        <Text ta="center" fz="lg" fw={500} mt="md">{user.personalData.displayName}</Text>
        <Text ta="center" fz="sm" c="dimmed">{user.personalData.role}</Text>
      </div>
    </div>
  )
}