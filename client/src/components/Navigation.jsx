import {AppShell, NavLink } from "@mantine/core"
import { IconHome2, IconCreditCard, IconCalendarEvent, IconSettings } from '@tabler/icons-react';


/**
 * Object containing names for navigation tabs.
 * @typedef {Object} NavigationStyles
 * @property {string} DASHBOARD - The dashboard's tab ID.
 * @property {string} INVOICES - The invoice page's tab ID.
 * @property {string} SCHEDULE - The schedule page's tab ID.
 * @property {string} SETTINGS - The settings page's tab ID.
 */
export const navigationItems = {
  DASHBOARD: "dashboard",
  INVOICES: "invoices",
  SCHEDULE: "schedule",
  SETTINGS: "settings"
}

/**
 * Object containing the navigation styles.
 * @typedef {Object} NavigationStyles
 * @property {string} variant - The variant of the navigation styles.
 */
const navigationStyles = {
  variant: null
};

/**
 * Renders the navigation bar for the app shell.
 * @component
 * @param {Object} props - The component props.
 * @param {string} props.currentTab - The currently active tab.
 * @param {function} props.setCurrentTab - A function to set the current tab.
 * @returns {JSX.Element} The rendered component.
 */
export function AppShellNavigator({currentTab, setCurrentTab}) {
  return (    
    <AppShell.Navbar p="md">
      <NavLink
        label="Dashboard"
        leftSection={<IconHome2 />}
        variant={navigationStyles.variant}
        active={currentTab === navigationItems.DASHBOARD}
        onClick={() => setCurrentTab(navigationItems.DASHBOARD)}
      />
      <NavLink
        label="Invoices"
        leftSection={<IconCreditCard />}
        variant={navigationStyles.variant}
        active={currentTab === navigationItems.INVOICES} 
        onClick={() => setCurrentTab(navigationItems.INVOICES)}
      />
      <NavLink
        label="Schedule"
        leftSection={<IconCalendarEvent />}
        variant={navigationStyles.variant}
        active={currentTab === navigationItems.SCHEDULE}
        onClick={() => setCurrentTab(navigationItems.SCHEDULE)}
      />
      <NavLink
        label="Settings"
        leftSection={<IconSettings />}
        variant={navigationStyles.variant}
        active={currentTab === navigationItems.SETTINGS}
        onClick={() => setCurrentTab(navigationItems.SETTINGS)}
      />
    </AppShell.Navbar>
  )
}