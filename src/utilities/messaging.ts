import type { Channel } from '../types/Channel';
import type { Resident } from '../types/Resident';

export const getChannelRecipients = (
  channel: Channel,
  residents: Resident[],
): Resident[] => {
  return residents.filter((resident) => {
    if (channel === 'email') return resident.email;
    if (channel === 'sms') return resident.phone;
    if (channel === 'groupme') return resident.groupme;
    return false;
  });
};

export const sendMessage = (
  resident: Resident,
  channel: Channel,
  message: string,
) => {
  // Skips sending if the contact info is null
  if (
    (channel === 'email' && !resident.email) ||
    (channel === 'sms' && !resident.phone) ||
    (channel === 'groupme' && !resident.groupme)
  ) {
    return;
  }
  console.log(`To ${resident.name} via ${channel}: ${message}`);
};
