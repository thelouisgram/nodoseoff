export const getWelcomeEmailTemplate = (name: string) => ({
  subject: 'Welcome to NoDoseOff!',
  text: `Hi ${name},\n\nWelcome to NoDoseOff! We're excited to have you on board.\n\nBest regards,\nThe NoDoseOff Team`,
  html: `<p>Hi ${name},</p><p>Welcome to NoDoseOff! We're excited to have you on board.</p><p>Best regards,<br>The NoDoseOff Team</p>`,
});