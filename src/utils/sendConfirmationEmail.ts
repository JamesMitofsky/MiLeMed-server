import { Resend } from 'resend';

type SendConfirmationEmailArgs = {
  toEmail: string;
  url: string;
};

/**
 * Sends an email to the specified recipient with a provided link.
 * @param toEmail - The recipient's email address.
 * @param url - The link to include in the email content.
 * @returns A Promise that resolves when the email is sent.
 */
export async function sendConfirmationEmail({
  toEmail,
  url,
}: SendConfirmationEmailArgs): Promise<void> {
  const resend = new Resend(process.env.RESEND_API_KEY);

  console.log('Sending email to:', toEmail);
  console.log('Email confirmation link:', url);

  await resend.emails.send({
    from: 'MiLeMed <hey@notificiations.milemed.de>',
    to: toEmail,
    subject: 'Thanks for signing up — please confirm your email',
    html: `<a href="${url}">Click this link to confirm your email</a>`,
  });
}
