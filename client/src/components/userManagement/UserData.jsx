import { Avatar, Badge, Center, Divider, Group, Loader, Paper, Text, TextInput, Tooltip } from "@mantine/core";
import { IconAt, IconHome, IconPencil, IconPhoneCall, IconRefresh, IconStar, IconX } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { User } from "../../api/db/dbUser.ts";
import { notifSuccess } from "../Notifications.jsx";

export const PersonalData = ({user}) => {

  const dbUser = new User();
  dbUser.fillData(user);
  
  const handleEmailEditClick = () => {
    setEditEmail(!editEmail)
  }
  
  const handlePhoneEditClick = () => {
    setEditPhone(!editPhone)
  }

  const [tempEmail, setTempEmail] = useState("")
  const [tempPhone, setTempPhone] = useState("")

  useEffect(() => {
    setTempEmail(user?.personalData.email)
    setTempPhone(user?.personalData.phoneNumber)
  }, [user])
  
  const [editEmail, setEditEmail] = useState(false)
  const [editPhone, setEditPhone] = useState(false)

  const handleEmailEditKeyDown = (e) => { if (e.key === "Enter") { updateEmail() } }
  const handlePhoneEditKeyDown = (e) => { if (e.key === "Enter") { updatePhoneNumber() } }

  const updateEmail = () => {
    if (tempEmail.length <= 0) { return; }
    if (tempEmail === user.personalData.email) { return; }
    setEditEmail(false)
    dbUser.personalData.email = tempEmail;
    dbUser.setData().then(() => {
      notifSuccess("Email Updated", `Email for ${user.personalData.displayName} updated to ${tempEmail}.`)
    });
  }
  
  const updatePhoneNumber = () => {
    if (tempPhone.length <= 0) { return; }
    if (tempPhone === user.personalData.phoneNumber) { return; }
    setEditPhone(false)
    dbUser.personalData.phoneNumber = tempPhone;
    dbUser.setData().then(() => { 
      notifSuccess("Phone Number Updated", `Phone number for ${user.personalData.displayName} updated to ${tempPhone}.`)
    });
  }

  if (!user) { return; }
  return (
    <div className="col-12 col-lg-6 p-1 py-2">
      <Paper withBorder className="p-2 bg-gray-1 gap-2 d-flex flex-row align-items-center justify-content-lg-start justify-content-center">
        <Avatar src={user.pfpUrl} alt={user.displayName} className="m-0" size={100} style={{marginBottom: "1rem"}} />
        <div className="d-flex flex-column justify-content-center">      
          <div className="d-flex gap-2 align-items-center">
            <Text fz="sm" c="dimmed" tt="uppercase" fw={700}>{user.personalData.role}</Text>
            {user.admin && <Tooltip label="This account can manage tools, forms, invoices, and users."><Center><Badge>Admin</Badge></Center></Tooltip>}
          </div>
          <Text fz="lg" fw={500}>{user.personalData.displayName}</Text>
          <Group wrap="nowrap" gap={10} mt={3}>
            <IconStar stroke={1.5} size="1rem" className="text-dimmed"/>
            <Text fz="xs" c="dimmed">"{user.intents[0]}"</Text>
          </Group>
        </div>
        <Divider orientation="vertical" className="mx-2" />
        <div className="d-flex flex-column align-items-start justify-content-start">
          <Group wrap="nowrap" gap={10} mt={3}>
            <IconAt stroke={1.5} size="1rem" className="text-dimmed"/>
            {!editEmail && <Text fz="xs" c="dimmed">{tempEmail}</Text>}
            {editEmail && <TextInput size="xs" c="dimmed" value={tempEmail} onKeyDown={handleEmailEditKeyDown} onBlur={updateEmail} onChange={e => setTempEmail(e.target.value)}/>}
            <Tooltip label={!editEmail ? "Edit Email" : "Cancel"}>
              <Center>
                {!editEmail && <IconPencil onClick={handleEmailEditClick} stroke={1.5} size="1rem" className="text-dimmed" style={{cursor: "pointer"}}/>}
                {editEmail && <IconX onClick={handleEmailEditClick} stroke={1.5} size="1rem" className="text-dimmed" style={{cursor: "pointer"}}/>}
              </Center>
            </Tooltip>
          </Group>
          <Group wrap="nowrap" gap={10} mt={3}>
            <IconPhoneCall stroke={1.5} size="1rem" className="text-dimmed"/>
            {!editPhone && <Text fz="xs" c="dimmed">{tempPhone}</Text>}
            {editPhone && <TextInput size="xs" c="dimmed" value={tempPhone} onKeyDown={handlePhoneEditKeyDown} onBlur={updatePhoneNumber} onChange={e => setTempPhone(e.target.value)}/>}
            <Tooltip label={!editPhone ? "Edit Phone Number" : "Cancel"}>
              <Center>
                {!editPhone && <IconPencil onClick={handlePhoneEditClick} stroke={1.5} size="1rem" className="text-dimmed" style={{cursor: "pointer"}}/>}
                {editPhone && <IconX onClick={handlePhoneEditClick} stroke={1.5} size="1rem" className="text-dimmed" style={{cursor: "pointer"}}/>}
              </Center>
            </Tooltip>
          </Group>
          <Group wrap="nowrap" gap={10} mt={3}>
            <IconHome stroke={1.5} size="1rem" className="text-dimmed"/>
            <Text fz="xs" c="dimmed">{user.personalData.address}, {user.personalData.city} {user.personalData.state}, {user.personalData.zip}</Text>
          </Group>
        </div>
      </Paper>
    </div>
  )
}

export const SyncCodeAndSessionNotes = ({user}) => {

  const dbUser = new User();
  dbUser.fillData(user);
  
  const handleEmailEditClick = () => {
    setEditEmail(!editEmail)
  }
  
  const handlePhoneEditClick = () => {
    setEditPhone(!editPhone)
  }

  const [tempEmail, setTempEmail] = useState("")
  const [tempPhone, setTempPhone] = useState("")

  useEffect(() => {
    setTempEmail(user?.personalData.email)
    setTempPhone(user?.personalData.phoneNumber)
  }, [user])
  
  const [editEmail, setEditEmail] = useState(false)
  const [editPhone, setEditPhone] = useState(false)

  const handleEmailEditKeyDown = (e) => { if (e.key === "Enter") { updateEmail() } }
  const handlePhoneEditKeyDown = (e) => { if (e.key === "Enter") { updatePhoneNumber() } }

  const updateEmail = () => {
    if (tempEmail.length <= 0) { return; }
    if (tempEmail === user.personalData.email) { return; }
    setEditEmail(false)
    dbUser.personalData.email = tempEmail;
    dbUser.setData().then(() => {
      notifSuccess("Email Updated", `Email for ${user.personalData.displayName} updated to ${tempEmail}.`)
    });
  }
  
  const updatePhoneNumber = () => {
    if (tempPhone.length <= 0) { return; }
    if (tempPhone === user.personalData.phoneNumber) { return; }
    setEditPhone(false)
    dbUser.personalData.phoneNumber = tempPhone;
    dbUser.setData().then(() => { 
      notifSuccess("Phone Number Updated", `Phone number for ${user.personalData.displayName} updated to ${tempPhone}.`)
    });
  }

  const [regeneratingSyncCode, setRegeneratingSyncCode] = useState(false)

  const regenSync = () => {
    setRegeneratingSyncCode(true)
    dbUser.generateSyncCode().then(() => {
      setRegeneratingSyncCode(false)
      notifSuccess("Sync Code Regenerated", `Sync code for ${user.personalData.displayName} has been regenerated.`)
    })
  }

  if (!user) { return; }
  return (
    <div className="col-12 col-lg-6 p-1 py-2">
      <Paper withBorder className="h-100  p-2 bg-gray-1 gap-2 d-flex flex-row align-items-center justify-content-lg-start justify-content-center">
        <div className="w-100 d-flex align-items-center gap-2 justify-content-center flex-column">
          <div className="d-flex flex-row gap-2">
            <Text fz="sm" c="dimmed" tt="uppercase" fw={700}>Sync Code</Text>
            <Tooltip label="Regenerate Sync Code">
              <Center>
                {!regeneratingSyncCode && <IconRefresh onClick={regenSync} stroke={1.5} size="1rem" className="text-dimmed" style={{cursor: "pointer"}}/>}
                {regeneratingSyncCode && <Loader size="1rem" />}
              </Center>
            </Tooltip>
          </div>
          <Text fz="lg" fw={500}>{user.syncCode}</Text>
        </div>
        <Divider orientation="vertical" className="mx-2" />
        <div className="w-100 d-flex align-items-center justify-content-center">
          <Text fz="sm" c="dimmed" tt="uppercase" fw={700}>Sync Code</Text>
        </div>
      </Paper>
    </div>
  )
}