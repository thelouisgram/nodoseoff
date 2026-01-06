import { formatDate } from "../utils/dashboard/dashboard";

interface DrugAddedEmailResponse {
  subject: string;
  html: string;
}

export function generateDrugAddedEmail(
  fullName: string,
  drugName: string,
  startDate: string,
  stopDate: string,
  route: string,
  time: string[]
): DrugAddedEmailResponse {
  // Email subject
  const subject = `New Medication Added: ${drugName.charAt(0).toUpperCase() + drugName.slice(1)}`;

  // Email HTML content
  const html = `
    <html>
      <head>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
          
          body {
            font-family: "Inter", sans-serif;
            line-height: 2.0;
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
            align-items: center;
            justify-content: center;
            gap: 16px; /* Space between logo and text */
            background-color: hsl(218, 89%, 21%);
            padding: 20px;
            border-radius: 10px 10px 0 0;
          }
          .logo {
            height: 32px;
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
          .details {
            background-color: #eef2f7;
            padding: 15px;
            border-radius: 8px;
            font-size: 16px;
            color: #222;
            margin-bottom: 20px;
          }
          .details strong {
            color: hsl(218, 89%, 21%);
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
            <p>Hi  ${fullName.split(' ')[0]},</p>
            <p>You have successfully added a new medication to your NoDoseOff schedule.</p>

            <div class="details">
              <p><strong>Medication:</strong> ${drugName.charAt(0).toUpperCase() + drugName.slice(1).toLowerCase()}</p>
              <p><strong>From:</strong> ${formatDate(startDate)}</p>
             <p><strong>To:</strong> ${formatDate(stopDate)}</p>
              <p><strong>Time:</strong> ${time.join(', ')}</p>
              <p><strong>Route of Administration:</strong> ${route.charAt(0).toUpperCase() + route.slice(1).toLowerCase()}</p>
            </div>

            <p>Stay consistent with your medication and keep track of your health effortlessly with NoDoseOff.</p>

            <div style="text-align: center;">
              <a href="https://nodoseoff.vercel.app/dashboard" class="button">View Medication Schedule</a>
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