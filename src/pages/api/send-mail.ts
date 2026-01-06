import { NextApiRequest, NextApiResponse } from 'next';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { to, subject, html } = req.body;

  // Validate required fields
  if (!to || !subject || !html) {
    return res.status(400).json({ error: 'Missing required fields: to, subject, html' });
  }

  try {
    const { data, error } = await resend.emails.send({
      from: 'Ade from NoDoseOff <onboarding@resend.dev>',
      to: to, 
      subject: subject,
      html: html,
    });

    if (error) {
      return res.status(400).json({ error });
    }

    // Note: Rate limit headers are added by middleware
    return res.status(200).json({ data });
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error' });
  }
}