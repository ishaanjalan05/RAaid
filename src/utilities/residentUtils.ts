import type { Channel, Resident } from '../types/resident';

export const getChannelRecipients = (residents: Resident[], channel: Channel): Resident[] => {
  return residents.filter((resident) => {
    if (resident.preferredChannel !== channel) return false;
    if (channel === 'email') return resident.email;
    if (channel === 'sms') return resident.phone;
    if (channel === 'groupme') return resident.groupme;
    return false;
  });
};
