import { User } from '../entity/User';
import { resendInstance } from '../modules/resendInstance';
import { createConfirmationUrl } from './createConfirmationUrl';

export async function sendConfirmationEmail({
  email,
  id,
}: User): Promise<void> {
  const url = await createConfirmationUrl(id);

  console.log('Sending email to:', email, 'with id:', id);
  console.log('Email confirmation link:', url);

  await resendInstance.emails.send({
    from: 'MiLeMed <hey@notificiations.milemed.de>',
    to: email,
    subject: 'Thanks for signing up — please confirm your email',
    html: `<a href="${url}">Click this link to confirm your email</a>`,
  });
}
