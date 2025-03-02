import { NextApiRequest, NextApiResponse } from 'next';
import { sendWelcomeEmail } from '../../../utils/lib/sendWelcomeMail';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { to, name } = req.body;

  if (!to || !name) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    // Call the sendWelcomeEmail function
    await sendWelcomeEmail(to, name);
    res.status(200).json({ message: 'Welcome email sent successfully' });
  } catch (error) {
    console.error('Error sending welcome email:', error);
    res.status(500).json({ message: 'Failed to send welcome email' });
  }
}