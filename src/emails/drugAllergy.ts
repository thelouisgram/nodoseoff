interface DrugAllergyEmailResponse {
  subject: string;
  html: string;
}

export function generateDrugAllergyEmail(
  fullName: string,
  drugName: string,
): DrugAllergyEmailResponse {
  // Email subject
  const subject = `Drug Allergy Recorded: ${drugName.charAt(0).toUpperCase() + drugName.slice(1)}`;

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
            gap: 16px;
            background-color: hsl(0, 70%, 40%);
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
            color: hsl(0, 70%, 40%);
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
            color: hsl(0, 70%, 40%);
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
            <p>You have successfully recorded a drug you're allergic to in your NoDoseOff profile.</p>

            <div class="details">
              <p><strong>Drug Name:</strong> ${drugName.charAt(0).toUpperCase() + drugName.slice(1).toLowerCase()}</p>
            </div>

            <p>Please share this information with your healthcare provider to ensure safe medication use.</p>
            <p>You will be prevented from adding this drug moving forward to avoid allergic reactions.</p>
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
