import logo from './logo.svg';
import './App.css';
import '@mantine/core/styles.css';

import { createTheme, MantineProvider, AppShell, Burger, Group } from '@mantine/core';
import { useState } from 'react';
import { AppShellNavigator, navigationItems } from './components/Navigation';
import { AppShellHeader } from './components/Header';

const theme = createTheme({});

function App() {

  const [burgerOpen, setBurgerOpen] = useState(false);

  const [currentTab, setCurrentTab] = useState("dashboard")

  const CurrentTab = () => {
    switch (currentTab) {
      case navigationItems.DASHBOARD:
        return <div>Dashboard</div>
      case navigationItems.INVOICES:
        return <div>Invoices</div>
      case navigationItems.FORMS:
        return <div>Forms</div>
      case navigationItems.SCHEDULE:
        return <div>Schedule</div>
      case navigationItems.SETTINGS:
        return <div>Settings</div>
      default:
    }
  }

  return (
    <MantineProvider theme={theme}>
      <AppShell
        header={{ height: 60 }}
        navbar={{ width: 300, breakpoint: 'sm', collapsed: { mobile: !burgerOpen } }}
        padding="md"
      >
        <AppShellHeader burgerOpen={burgerOpen} setBurgerOpen={setBurgerOpen}/> 
        <AppShellNavigator currentTab={currentTab} setCurrentTab={setCurrentTab} />
        <AppShell.Main>
          <CurrentTab />
        </AppShell.Main>
      </AppShell>
    </MantineProvider>
  );
}

export default App;
