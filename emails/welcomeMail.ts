interface WelcomeEmailResponse {
  subject: string;
  html: string;
}

export function generateWelcomeEmail(fullName: string): WelcomeEmailResponse {
  // Email subject
  const subject = `Welcome to NoDoseOff!`;

  // Email HTML content
  const html = `
    <html>
  <head>
    <style>
      body {
        font-family: Arial, sans-serif;
        line-height: 1.6;
        color: #333;
        margin: 0;
        padding: 0;
        background-color: #f9f9f9;
      }
      .header {
        background-color: hsl(218, 89%, 21%);
        color: white;
        padding: 40px 20px;
        text-align: center;
      }
      .header h1 {
        margin: 0;
        font-size: 28px;
        font-weight: bold;
      }
      .content {
        padding: 30px 20px;
        background-color: white;
        margin: 20px;
        border-radius: 10px;
      }
      .content p {
        font-size: 16px;
        color: #555;
        margin-bottom: 20px;
      }
      .features {
        margin: 20px 0;
      }
      .features li {
        display: flex;
        align-items: center;
        margin-bottom: 15px;
        font-size: 16px;
        color: #444;
      }
      .features li::before {
        content: "✔";
        color: hsl(218, 89%, 21%);
        font-size: 18px;
        margin-right: 10px;
      }
      .button {
        display: inline-block;
        background-color: hsl(218, 89%, 21%);
        color: white;
        padding: 14px 28px;
        text-decoration: none;
        border-radius: 8px;
        font-size: 16px;
        font-weight: bold;
        margin-top: 20px;
        transition: background-color 0.3s ease;
      }
      .button:hover {
        background-color: hsl(218, 89%, 25%);
      }
      .footer {
        margin-top: 20px;
        text-align: center;
        font-size: 12px;
        color: #777;
        padding: 20px;
        background-color: #f1f1f1;
        border-radius: 10px;
        margin: 20px;
      }
      .footer a {
        color: hsl(218, 89%, 21%);
        text-decoration: none;
      }
      .footer a:hover {
        text-decoration: underline;
      }
    </style>
  </head>
  <body>
    <div class="header">
      <h1>Welcome to NoDoseOff, ${fullName}!</h1>
    </div>
    <div class="content">
      <p>We're thrilled to have you on board. NoDoseOff is here to help you manage your medication schedules effortlessly and stay on top of your health.</p>
      <div class="features">
        <ul>
          <li>Set reminders for your medications</li>
          <li>Track your medication history</li>
          <li>Receive personalized health tips</li>
        </ul>
      </div>
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