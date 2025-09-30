import type { Channel } from './Channel';

export interface Resident {
  id: string;
  name: string;
  room: string;
  preferredChannel: Channel;
  email: string | null;
  phone: string | null;
  groupme: string | null;
}
