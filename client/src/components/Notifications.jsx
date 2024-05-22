// Library Imports
import { notifications } from "@mantine/notifications";
import { IconCheck } from "@tabler/icons-react";
// API Imports
import { notifStyle } from "../api/notifications.ts";

/**
 * Send a notification with a green check to the notif queue
 * @param {string} title - notification title
 * @param {string} message - notification message content
 */
export function notifSuccess(title, message) {
  notifications.show({
    withCloseButton: true,
    autoClose: 5000,
    title: title,
    message: message,
    color: "green",
    icon: <IconCheck />,
    style: notifStyle,
    withBorder: true,
  });
}