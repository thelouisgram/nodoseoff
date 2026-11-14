/** Shared soft-UI chrome for transactional emails. */

export function appBaseUrl(): string {
  return (
    process.env.NEXT_PUBLIC_APP_URL?.trim().replace(/\/$/, "") ||
    "https://nodoseoff.com"
  );
}

export function emailShell(params: {
  title: string;
  bodyHtml: string;
  ctaLabel?: string;
  ctaHref?: string;
}): string {
  const logoUrl = `${appBaseUrl()}/assets/logo/logo-with-name-white.png`;
  const cta =
    params.ctaLabel && params.ctaHref
      ? `<div style="text-align:center;margin-top:28px">
           <a href="${params.ctaHref}" style="display:inline-block;background:#002860;color:#ffffff;padding:14px 28px;text-decoration:none;border-radius:12px;font-size:15px;font-weight:600">${params.ctaLabel}</a>
         </div>`
      : "";

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${params.title}</title>
</head>
<body style="margin:0;padding:0;background:#F4F5F7;font-family:Manrope,Helvetica,Arial,sans-serif;color:#0B1A2E">
  <div style="width:100%;max-width:560px;margin:0 auto;padding:24px 16px">
    <div style="background:#002860;border-radius:16px 16px 0 0;padding:22px 24px;text-align:center">
      <img src="${logoUrl}" alt="NoDoseOff" height="36" style="height:36px;width:auto" />
    </div>
    <div style="background:#ffffff;border:1px solid rgba(0,40,96,0.08);border-top:none;border-radius:0 0 16px 16px;padding:28px 24px">
      ${params.bodyHtml}
      ${cta}
    </div>
    <p style="margin:20px 0 0;text-align:center;font-size:12px;line-height:1.5;color:#6B7280">
      Need help? <a href="mailto:hello@nodoseoff.com" style="color:#002860;text-decoration:none;font-weight:600">hello@nodoseoff.com</a><br />
      © ${new Date().getFullYear()} NoDoseOff
    </p>
  </div>
</body>
</html>`;
}
