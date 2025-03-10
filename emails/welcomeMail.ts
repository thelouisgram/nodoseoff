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
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
      
      body {
        font-family: "Inter", sans-serif;
        line-height: 1.8;
        color: #333;
        margin: 0;
        padding: 0;
        background-color: #f4f7fc;
      }
      .container {
        width: 100%;
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
      }
     .header {
        display: flex;
        background-color: hsl(218, 89%, 21%);
        padding: 20px;
        border-radius: 10px 10px 0 0;
        text-align: center;
      }

      .logo {
        max-width: 50px; /* Adjust logo size */
        height: auto;
      }

      .header h1 {
        font-size: 24px; /* Adjust text size */
        color: white;
        font-weight: 700;
        margin: 0;
      }
      .content {
        background-color: white;
        padding: 35px;
        border-radius: 0 0 10px 10px;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
      }
      .content p {
        font-size: 17px;
        color: #444;
        margin-bottom: 20px;
      }
      .features {
        margin: 25px 0;
        padding-left: 0;
      }
      .features li {
        display: flex;
        align-items: center;
        font-size: 16px;
        color: #222;
        margin-bottom: 12px;
      }
      .features li::before {
        content: "✔";
        color: hsl(218, 89%, 21%);
        font-size: 18px;
        font-weight: bold;
        margin-right: 12px;
      }
      .button {
        display: inline-block;
        background-color: hsl(218, 89%, 21%);
        color: white;
        padding: 16px 32px;
        text-decoration: none;
        border-radius: 8px;
        font-size: 16px;
        font-weight: 600;
        margin-top: 20px;
        text-align: center;
        transition: background-color 0.3s ease, transform 0.2s ease;
      }
      .button:hover {
        background-color: hsl(218, 89%, 25%);
        transform: translateY(-2px);
      }
      .footer {
        margin-top: 30px;
        text-align: center;
        font-size: 14px;
        color: #666;
        padding: 20px;
        background-color: #eef2f7;
        border-radius: 10px;
      }
      .footer a {
        color: hsl(218, 89%, 21%);
        text-decoration: none;
        font-weight: 600;
      }
      .footer a:hover {
        text-decoration: underline;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <img src="https://nodoseoff.vercel.app/logoName.png" alt="NoDoseOff Logo" class="logo">
      </div>
      <div class="content">
        <p>We’re excited to have you on board! NoDoseOff is your personal medication assistant, designed to keep you on track with your health.</p>
        
        <p>With NoDoseOff, you can:</p>
        <ul class="features">
          <li>Set reminders for your medications.</li>
          <li>Track your medication history effortlessly.</li>
          <li>Receive personalized health insights.</li>
        </ul>

        <p>Start managing your medications seamlessly today.</p>

        <div style="text-align: center;">
          <a href="https://nodoseoff.vercel.app/dashboard" class="button">Go to Dashboard</a>
        </div>
      </div>
      <div class="footer">
        <p>Need help? Contact our support team at <a href="mailto:nodoseoff@gmail.com">nodoseoff@gmail.com</a>.</p>
        <p>&copy; 2025 NoDoseOff. All rights reserved.</p>
      </div>
    </div>
  </body>
</html>
  `;

  return {
    subject,
    html,
  };
}
