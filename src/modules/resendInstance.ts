import { Resend } from 'resend';

export const resendInstance = new Resend(process.env.RESEND_API_KEY);
