import { AppShell, Burger, Group, Text } from "@mantine/core";
import logo from "../assets/images/sun.png";

export function AppShellHeader({burgerOpen, setBurgerOpen}) {
  return (
    <AppShell.Header>
      <Group h="100%" px="md">
        <Burger opened={burgerOpen} onClick={() => setBurgerOpen(!burgerOpen)} hiddenFrom="sm" size="sm" />
        <img src={logo} alt="Logo" style={{ height: 40 }} />
        <Text fw={700}>A New Day Coaching</Text>
      </Group>
    </AppShell.Header>
  )
}