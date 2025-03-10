interface WelcomeEmailParams {
  to: string; // Recipient's email address
  fullName: string; // Recipient's fullName
}

interface WelcomeEmailResponse {
  subject: string;
  html: string;
}

export function generateWelcomeEmail(fullName: string): WelcomeEmailResponse {
  // Email subject
  const subject = `Welcome to NoDoseOff, ${fullName}! Start Managing Your Medication Today`;

  // Email HTML content
  const html = `
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
          }
          .header {
            background-color: #4CAF50;
            color: white;
            padding: 20px;
            text-align: center;
          }
          .content {
            padding: 20px;
          }
          .button {
            display: inline-block;
            background-color: #4CAF50;
            color: white;
            padding: 10px 20px;
            text-decoration: none;
            border-radius: 5px;
          }
          .footer {
            margin-top: 20px;
            text-align: center;
            font-size: 12px;
            color: #777;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Welcome to NoDoseOff, ${fullName}!</h1>
        </div>
        <div class="content">
          <p>We're thrilled to have you on board. NoDoseOff is here to help you manage your medication schedules effortlessly and stay on top of your health.</p>
          <p>With NoDoseOff, you can:</p>
          <ul>
            <li>Set reminders for your medications</li>
            <li>Track your medication history</li>
            <li>Receive personalized health tips</li>
          </ul>
          <p>Get started now and take control of your health journey!</p>
          <a href="https://nodoseoff.vercel.app/dashboard" class="button">Go to Dashboard</a>
        </div>
        <div class="footer">
          <p>If you have any questions, feel free to reach out to our support team at <a href="mailto:nodoseoff@gmail.com">nodoseoff@gmail.com</a>.</p>
          <p>&copy; 2025 NoDoseOff. All rights reserved.</p>
        </div>
      </body>
    </html>
  `;

  return {
    subject,
    html,
  };
}