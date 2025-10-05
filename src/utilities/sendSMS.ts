export interface SMSRecipient {
  id: string;
  name: string;
  contact: string | null;
}

export interface SendSMSParams {
  message: string;
  recipients: SMSRecipient[];
}

export const sendSMS = async (params: SendSMSParams): Promise<boolean> => {
  try {
    console.log('Would send to recipients:', params.recipients);
    console.log('Message:', params.message);

    await new Promise((resolve) => setTimeout(resolve, 1000));
    return true;
  } catch (error) {
    console.error('Error sending SMS messages:', error);
    return false;
  }
};
