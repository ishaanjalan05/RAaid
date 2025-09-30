import type { Channel } from './Channel';

export interface SendResult {
  channel: Channel;
  success: boolean;
  recipientCount: number;
}
