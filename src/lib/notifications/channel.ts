/**
 * Notification delivery channel.
 * Email for web; switch NOTIFICATION_CHANNEL=push when the mobile app ships.
 */
export type NotificationChannel = "email" | "push";

export function activeNotificationChannel(): NotificationChannel {
  const raw = process.env.NOTIFICATION_CHANNEL?.trim().toLowerCase();
  if (raw === "push") return "push";
  return "email";
}

export function notificationsEnabled(): boolean {
  const raw = process.env.NOTIFICATIONS_ENABLED?.trim().toLowerCase();
  if (raw === "0" || raw === "false" || raw === "off") return false;
  return true;
}
