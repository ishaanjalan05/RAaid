export interface GroupMeRecipient {
  id: string;
  name: string;
  contact: string | null;
}

export interface SendGroupMeParams {
  message: string;
  recipients: GroupMeRecipient[];
}

export const sendGroupMe = async (params: SendGroupMeParams): Promise<boolean> => {
  try {
    console.log('Would send to recipients:', params.recipients);
    console.log('Message:', params.message);

    await new Promise((resolve) => setTimeout(resolve, 1000));
    return true;
  } catch (error) {
    console.error('Error sending GroupMe messages:', error);
    return false;
  }
};
