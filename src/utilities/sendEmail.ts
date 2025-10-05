import emailjs from '@emailjs/browser';

export interface EmailRecipient {
  id: string;
  name: string;
  contact: string | null;
}

export interface SendEmailParams {
  message: string;
  recipients: EmailRecipient[];
}

export const sendEmail = async (params: SendEmailParams): Promise<boolean> => {
  try {
    emailjs.init('l_SwAE35PFsf-DwDl');
    const emailPromises = params.recipients.map((recipient) => {
      if (!recipient.contact) {
        console.warn(`No email address for recipient: ${recipient.name}`);
        return Promise.resolve();
      }

      return emailjs.send('service_5kjhbqn', 'template_k18ymz9', {
        to_email: recipient.contact,
        from_name: 'RA Broadcast',
        message: params.message,
      });
    });

    await Promise.all(emailPromises);
    return true;
  } catch (error) {
    console.error('Error sending emails:', error);
    return false;
  }
};
