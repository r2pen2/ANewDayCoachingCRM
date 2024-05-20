import { notifications } from "@mantine/notifications";
import { IconCheck } from "@tabler/icons-react";
import { notifStyle } from "../api/notifications.ts";

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