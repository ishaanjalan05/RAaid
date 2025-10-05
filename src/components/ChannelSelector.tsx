import type { Channel, ChannelOption, Resident } from '../types/resident';

interface ChannelSelectorProps {
  selectedChannels: Set<Channel>;
  onToggleChannel: (channel: Channel) => void;
  getChannelRecipients: (channel: Channel) => Resident[];
  disabled: boolean;
}

const channelOptions: ChannelOption[] = [
  { value: 'email', label: 'Email', icon: '📧' },
  { value: 'sms', label: 'SMS', icon: '💬' },
  { value: 'groupme', label: 'GroupMe', icon: '👥' }
];

export const ChannelSelector = ({
  selectedChannels,
  onToggleChannel,
  getChannelRecipients,
  disabled
}: ChannelSelectorProps) => {
  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-3">
        Select Communication Channels
      </label>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {channelOptions.map(({ value, label, icon }) => {
          const recipients = getChannelRecipients(value);
          const isSelected = selectedChannels.has(value);

          return (
            <button
              key={value}
              onClick={() => onToggleChannel(value)}
              disabled={disabled}
              className={`p-4 rounded-lg border-2 transition-all ${
                isSelected
                  ? 'border-indigo-500 bg-indigo-50 shadow-md'
                  : 'border-gray-200 bg-white hover:border-indigo-300'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">{icon}</span>
                  <span className="font-medium text-gray-900">{label}</span>
                </div>
                {isSelected && <span className="text-indigo-500 text-xl">✓</span>}
              </div>
              <div className="text-sm text-gray-500 mt-2 text-left">
                {recipients.length} recipient{recipients.length !== 1 ? 's' : ''}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
