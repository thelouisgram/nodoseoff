export const sendMail = async (to:string, html:string, subject:string) => {
    const response = await fetch("/api/send-mail", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: to, // Replace with the recipient's email
        html: html,
        subject: subject,
      }),
    });

  };