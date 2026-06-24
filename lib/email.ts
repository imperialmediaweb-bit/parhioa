import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

const FROM =
  process.env.EMAIL_FROM ||
  'Parohia Sf. Teodora <contact@parohiasfteodoradelasihla.ro>';

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://parohiasfteodoradelasihla.ro';

const LOGO_URL =
  'https://res.cloudinary.com/dghmoelly/image/upload/v1780574528/sf_theodora_de_la_sihla_ri9rz2.png';

/** Parohia / admin notification address. Defaults to the FROM address. */
function adminEmail(): string {
  if (process.env.ADMIN_EMAIL) return process.env.ADMIN_EMAIL;
  const m = FROM.match(/<([^>]+)>/) || FROM.match(/(\S+@\S+)/);
  return m?.[1] || 'contact@parohiasfteodoradelasihla.ro';
}

export async function sendThankYouEmail(opts: {
  to: string;
  donorName: string | null;
  amount: number;
  recurring: boolean;
  campaignTitle: string;
}) {
  if (!resend) {
    console.log('[email] RESEND_API_KEY missing — skipping thank-you email for', opts.to);
    return;
  }

  const greeting = opts.donorName ? `Dragă ${opts.donorName},` : 'Dragă ctitorule,';
  const amountLine = `${opts.amount} RON${opts.recurring ? ' / lună' : ''}`;

  const html = `
<!doctype html>
<html lang="ro">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Mulțumim pentru dar</title>
</head>
<body style="margin:0;padding:0;background:#f3ead8;font-family:Georgia,'Times New Roman',serif;color:#2c1810;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f3ead8;padding:24px 0;">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#fdf6e8;border:1px solid #c9a961;border-radius:16px;overflow:hidden;">
        <tr>
          <td style="background:linear-gradient(135deg,#6b1f2b 0%,#4a1620 100%);padding:32px 32px 28px;text-align:center;color:#fdf6e8;">
            <img src="${LOGO_URL}" alt="Sfânta Cuvioasă Teodora de la Sihla" width="96" height="96" style="display:block;margin:0 auto 12px;width:96px;height:96px;border-radius:12px;background:rgba(253,246,232,0.06);" />
            <h1 style="margin:0;font-size:24px;font-weight:600;letter-spacing:0.02em;">Slavă lui Dumnezeu</h1>
            <p style="margin:6px 0 0;font-size:13px;letter-spacing:0.18em;text-transform:uppercase;color:#e8c878;">pentru darul tău</p>
          </td>
        </tr>
        <tr>
          <td style="padding:32px;">
            <p style="margin:0 0 16px;font-size:17px;line-height:1.6;">${escape(greeting)}</p>
            <p style="margin:0 0 16px;font-size:16px;line-height:1.7;">
              Mulțumim din toată inima pentru jertfa ta de <strong style="color:#6b1f2b;">${amountLine}</strong>
              pentru <em>${escape(opts.campaignTitle)}</em>. Fiecare dar este o cărămidă vie
              în zidirea bisericii noastre.
            </p>
            <p style="margin:0 0 16px;font-size:16px;line-height:1.7;">
              Numele tău va fi pomenit la Sfânta Liturghie, iar lumânarea recunoștinței
              noastre arde pentru tine și familia ta.
            </p>
            <div style="margin:24px 0;padding:18px 20px;background:#f3ead8;border-left:4px solid #c9a961;border-radius:8px;">
              <p style="margin:0;font-style:italic;font-size:15px;line-height:1.6;color:#3d2418;">
                „Dăruind pentru Biserică, te faci moștenitor al comorilor veșnice."
              </p>
              <p style="margin:8px 0 0;font-size:12px;letter-spacing:0.16em;text-transform:uppercase;color:#6b1f2b;">
                — Sfântul Ioan Damaschin
              </p>
            </div>
            <p style="margin:0 0 24px;font-size:15px;line-height:1.7;">
              Poți urmări progresul zidirii și lista ctitorilor pe pagina noastră:
            </p>
            <p style="text-align:center;margin:0 0 24px;">
              <a href="${SITE_URL}/donations/strangere-de-fonduri-pentru-construirea-bisericii"
                 style="display:inline-block;padding:14px 28px;background:#6b1f2b;color:#fdf6e8;text-decoration:none;border-radius:999px;font-weight:600;font-size:15px;">
                Vezi progresul bisericii
              </a>
            </p>
            <p style="margin:24px 0 0;font-size:15px;line-height:1.7;">
              Cu binecuvântare,<br/>
              <strong>Pr. Cătălin Ailenei</strong><br/>
              <em style="color:#6b1f2b;">Parohia Sf. Cuv. Teodora de la Sihla – Botoșani</em>
            </p>
          </td>
        </tr>
        <tr>
          <td style="background:#f3ead8;padding:18px 32px;text-align:center;font-size:12px;color:#6b5544;border-top:1px solid #d6c4a0;">
            Acest email este o confirmare a donației tale prin procesatorul de plăți Stripe.<br/>
            Dacă nu ai inițiat această donație, te rugăm să ne contactezi.
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  try {
    await resend.emails.send({
      from: FROM,
      to: opts.to,
      subject: 'Mulțumim pentru darul tău — Parohia Sf. Teodora',
      html,
    });
  } catch (err) {
    console.error('[email] resend send failed:', err);
  }
}

function escape(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Notify parish admin when someone starts a donation but does not finish
 * (Stripe checkout session expired or async payment failed).
 */
export async function sendAdminPaymentFailedEmail(opts: {
  donorEmail: string | null;
  donorName: string | null;
  amount: number | null;
  campaign: string;
  reason: 'expired' | 'failed';
}) {
  const to = adminEmail();
  if (!resend) {
    console.log('[email] RESEND_API_KEY missing — skipping admin notification');
    return;
  }

  const subject =
    opts.reason === 'expired'
      ? 'Donație neterminată — Parohia Sf. Teodora'
      : 'Plată eșuată — Parohia Sf. Teodora';

  const reasonText =
    opts.reason === 'expired'
      ? 'Donatorul a deschis pagina de plată, dar nu a finalizat tranzacția în interval de 24 ore.'
      : 'Plata a fost inițiată, dar a fost respinsă de bancă sau de procesatorul de plăți.';

  const amountText = opts.amount ? `${opts.amount} RON` : '(sumă necunoscută)';

  const html = `<!doctype html><html lang="ro"><head><meta charset="utf-8"/></head>
<body style="margin:0;padding:0;background:#f3ead8;font-family:Georgia,serif;color:#2c1810;">
<table width="100%" cellpadding="0" cellspacing="0" style="padding:24px 0;background:#f3ead8;"><tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#fdf6e8;border:1px solid #c9a961;border-radius:16px;overflow:hidden;">
<tr><td style="background:linear-gradient(135deg,#6b1f2b,#4a1620);padding:24px;text-align:center;color:#fdf6e8;">
<img src="${LOGO_URL}" alt="Parohia Sf. Teodora" width="56" height="56" style="display:block;margin:0 auto 8px;width:56px;height:56px;border-radius:8px;" />
<h1 style="margin:6px 0 0;font-size:20px;">${escape(subject.replace(' — Parohia Sf. Teodora', ''))}</h1>
</td></tr>
<tr><td style="padding:24px;">
<p style="margin:0 0 12px;font-size:15px;line-height:1.6;">${escape(reasonText)}</p>
<table cellpadding="8" cellspacing="0" style="width:100%;border-collapse:collapse;background:#f3ead8;border-radius:8px;margin:12px 0;">
<tr><td style="font-weight:bold;width:120px;">Email:</td><td style="font-family:monospace;">${escape(opts.donorEmail || '—')}</td></tr>
<tr><td style="font-weight:bold;">Nume:</td><td>${escape(opts.donorName || '—')}</td></tr>
<tr><td style="font-weight:bold;">Sumă:</td><td>${escape(amountText)}</td></tr>
<tr><td style="font-weight:bold;">Campanie:</td><td>${escape(opts.campaign)}</td></tr>
</table>
${opts.donorEmail ? `<p style="margin:16px 0 0;font-size:14px;color:#6b5544;">Puteți contacta direct donatorul la <a href="mailto:${escape(opts.donorEmail)}" style="color:#6b1f2b;">${escape(opts.donorEmail)}</a> dacă doriți să-l ajutați să reia donația.</p>` : ''}
</td></tr>
<tr><td style="background:#f3ead8;padding:14px 24px;text-align:center;font-size:12px;color:#6b5544;border-top:1px solid #d6c4a0;">
Notificare automată — sistemul de donații al parohiei
</td></tr></table></td></tr></table></body></html>`;

  try {
    await resend.emails.send({
      from: FROM,
      to,
      subject,
      html,
    });
  } catch (err) {
    console.error('[email] admin notification send failed:', err);
  }
}

/**
 * Forward a contact-form submission to the parish admin mailbox.
 * Sets reply-to to the sender so the priest can reply directly.
 */
export async function sendContactToParish(opts: {
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
}) {
  const to = adminEmail();
  if (!resend) {
    console.log('[email] RESEND_API_KEY missing — contact message not forwarded:', opts);
    return;
  }

  const subjectLine = opts.subject
    ? `Mesaj nou de pe site — ${opts.subject}`
    : `Mesaj nou de pe site — ${opts.name}`;

  const html = `<!doctype html><html lang="ro"><head><meta charset="utf-8"/></head>
<body style="margin:0;padding:0;background:#f3ead8;font-family:Georgia,serif;color:#2c1810;">
<table width="100%" cellpadding="0" cellspacing="0" style="padding:24px 0;background:#f3ead8;"><tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#fdf6e8;border:1px solid #c9a961;border-radius:16px;overflow:hidden;">
<tr><td style="background:linear-gradient(135deg,#6b1f2b,#4a1620);padding:24px;text-align:center;color:#fdf6e8;">
<img src="${LOGO_URL}" alt="Parohia Sf. Teodora" width="56" height="56" style="display:block;margin:0 auto 8px;width:56px;height:56px;border-radius:8px;" />
<h1 style="margin:6px 0 0;font-size:20px;">Mesaj nou de pe site</h1>
</td></tr>
<tr><td style="padding:24px;">
<table cellpadding="8" cellspacing="0" style="width:100%;border-collapse:collapse;background:#f3ead8;border-radius:8px;margin-bottom:12px;">
<tr><td style="font-weight:bold;width:120px;">De la:</td><td>${escape(opts.name)}</td></tr>
<tr><td style="font-weight:bold;">Email:</td><td><a href="mailto:${escape(opts.email)}" style="color:#6b1f2b;">${escape(opts.email)}</a></td></tr>
${opts.phone ? `<tr><td style="font-weight:bold;">Telefon:</td><td>${escape(opts.phone)}</td></tr>` : ''}
${opts.subject ? `<tr><td style="font-weight:bold;">Subiect:</td><td>${escape(opts.subject)}</td></tr>` : ''}
</table>
<div style="background:#fff;border:1px solid #d6c4a0;border-radius:8px;padding:16px;white-space:pre-wrap;line-height:1.6;font-size:15px;color:#2c1810;">${escape(opts.message)}</div>
<p style="margin:16px 0 0;font-size:13px;color:#6b5544;">Pentru a răspunde, folosiți butonul „Reply" — va trimite direct la <strong>${escape(opts.email)}</strong>.</p>
</td></tr>
<tr><td style="background:#f3ead8;padding:14px 24px;text-align:center;font-size:12px;color:#6b5544;border-top:1px solid #d6c4a0;">
Mesaj primit prin formularul de contact al parohiei
</td></tr></table></td></tr></table></body></html>`;

  try {
    await resend.emails.send({
      from: FROM,
      to,
      replyTo: opts.email,
      subject: subjectLine,
      html,
    });
  } catch (err) {
    console.error('[email] contact forward failed:', err);
    throw err;
  }
}

/**
 * Acknowledge a newsletter subscription. Soft confirmation only — no
 * double-opt-in yet (parish would need to set that up if they start
 * scheduled campaigns). The CAN-SPAM-style unsubscribe link uses the
 * subscriber id.
 */
export async function sendNewsletterWelcome(opts: {
  to: string;
  unsubscribeUrl: string;
}) {
  if (!resend) {
    console.log('[email] RESEND_API_KEY missing — newsletter welcome skipped for', opts.to);
    return;
  }

  const html = `<!doctype html><html lang="ro"><head><meta charset="utf-8"/></head>
<body style="margin:0;padding:0;background:#f3ead8;font-family:Georgia,serif;color:#2c1810;">
<table width="100%" cellpadding="0" cellspacing="0" style="padding:24px 0;background:#f3ead8;"><tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#fdf6e8;border:1px solid #c9a961;border-radius:16px;overflow:hidden;">
<tr><td style="background:linear-gradient(135deg,#6b1f2b,#4a1620);padding:28px;text-align:center;color:#fdf6e8;">
<img src="${LOGO_URL}" alt="Parohia Sf. Teodora" width="80" height="80" style="display:block;margin:0 auto 10px;width:80px;height:80px;border-radius:10px;" />
<h1 style="margin:6px 0 0;font-size:22px;">Bine ai venit în comunitatea parohiei</h1>
</td></tr>
<tr><td style="padding:28px;">
<p style="margin:0 0 14px;font-size:16px;line-height:1.6;">Mulțumim că dorești să primești foaia parohiei prin email.</p>
<p style="margin:0 0 14px;font-size:15px;line-height:1.7;">Îți vom trimite ocazional: program pentru sărbători, anunțuri importante, gânduri duhovnicești pentru săptămâna în curs. Nu spam, nu reclame — doar lucruri din viața parohiei „Sfânta Cuvioasă Teodora de la Sihla".</p>
<p style="margin:18px 0 0;font-size:15px;line-height:1.7;">Cu binecuvântare,<br/><strong>Pr. Cătălin Ailenei</strong></p>
</td></tr>
<tr><td style="background:#f3ead8;padding:14px 24px;text-align:center;font-size:11px;color:#6b5544;border-top:1px solid #d6c4a0;">
Dacă nu mai dorești să primești aceste emailuri, <a href="${escape(opts.unsubscribeUrl)}" style="color:#6b1f2b;">dezabonează-te aici</a>.
</td></tr></table></td></tr></table></body></html>`;

  try {
    await resend.emails.send({
      from: FROM,
      to: opts.to,
      subject: 'Bine ai venit — Parohia Sf. Teodora',
      html,
    });
  } catch (err) {
    console.error('[email] newsletter welcome failed:', err);
  }
}
