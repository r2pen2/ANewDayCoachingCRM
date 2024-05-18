import { navigationItems } from "../components/Navigation"

export function getTab() {
  
  if (window.location.hash.includes("dashboard")) return navigationItems.DASHBOARD
  if (window.location.hash.includes("invoices")) return navigationItems.INVOICES
  if (window.location.hash.includes("settings")) return navigationItems.SETTINGS
  if (window.location.hash.includes("forms")) return navigationItems.FORMS
  if (window.location.hash.includes("schedule")) return navigationItems.SCHEDULE
  if (window.location.hash.includes("tools")) return navigationItems.TOOLS

  return "dashboard"
}