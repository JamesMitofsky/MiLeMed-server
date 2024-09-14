import { User } from '../entity/User';
import { resendInstance } from 'src/modules/resendInstance';
import { createChangePasswordUrl } from './createChangePasswordUrl';

export async function sendChangePasswordEmail({
  email,
  id,
}: User): Promise<void> {
  console.log('Sending email to:', email, 'with id:', id);

  const url = await createChangePasswordUrl(id);
  console.log('Email confirmation link:', url);

  await resendInstance.emails.send({
    from: 'MiLeMed <hey@notificiations.milemed.de>',
    to: email,
    subject: 'Change your password',
    html: `<a href="${url}">Click this change your password</a>`,
  });
}
