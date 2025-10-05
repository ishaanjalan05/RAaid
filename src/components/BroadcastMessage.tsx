import { useState, useEffect } from 'react';
import type { Channel } from '../types/Channel';
import type { Resident } from '../types/Resident';
import type { SendResult } from '../types/SendResult';
import { clearDraft, loadDraft, saveDraft } from '../utilities/storage';
import { getChannelRecipients, sendMessage } from '../utilities/messaging';

const channelOptions: { value: Channel; label: string; icon: string }[] = [
  { value: 'email', label: 'Email', icon: '📧' },
  { value: 'sms', label: 'SMS', icon: '💬' },
  { value: 'groupme', label: 'GroupMe', icon: '👥' },
];

type BroadcastMessageProps = {
  residents: Resident[];
};

export const BroadcastMessage = ({ residents }: BroadcastMessageProps) => {
  const [message, setMessage] = useState('');
  const [selectedChannels, setSelectedChannels] = useState<Set<Channel>>(
    new Set(),
  );
  const [isSending, setIsSending] = useState(false);
  const [sendResults, setSendResults] = useState<SendResult[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const savedDraft = loadDraft();
    if (savedDraft) {
      setMessage(savedDraft);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      saveDraft(message);
    }, 500);

    return () => clearTimeout(timer);
  }, [message]);

  const toggleChannel = (channel: Channel) => {
    const newChannels = new Set(selectedChannels);
    if (newChannels.has(channel)) {
      newChannels.delete(channel);
    } else {
      newChannels.add(channel);
    }
    setSelectedChannels(newChannels);
  };

  const handleSend = async () => {
    setError(null);
    setSendResults(null);

    if (!message.trim()) {
      setError('Message cannot be blank');
      return;
    }

    if (selectedChannels.size === 0) {
      setError('Please select at least one channel');
      return;
    }

    setIsSending(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const sentTracker = new Set<string>();
    const results: SendResult[] = [];

    for (const channel of selectedChannels) {
      const recipients = getChannelRecipients(channel, residents);
      let recipientCount = 0;

      for (const resident of recipients) {
        if (sentTracker.has(resident.id)) {
          continue;
        }

        const hasPreferred = selectedChannels.has(resident.preferredChannel);

        if (hasPreferred && resident.preferredChannel === channel) {
          sendMessage(resident, channel, message);
          sentTracker.add(resident.id);
          recipientCount++;
        } else if (!hasPreferred) {
          sendMessage(resident, channel, message);
          sentTracker.add(resident.id);
          recipientCount++;
        }
      }
      if (recipientCount > 0) {
        results.push({ channel, success: true, recipientCount });
      }
    }

    setSendResults(results);
    setIsSending(false);
    clearDraft();
    setMessage('');
  };

  const handleNewMessage = () => {
    setMessage('');
    setSendResults(null);
    setError(null);
    clearDraft();
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Broadcast Message
      </h2>

      <div className="mb-6">
        <label
          htmlFor="message"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Message
        </label>
        <textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message to residents..."
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
          rows={8}
          disabled={isSending}
        />
        <div className="mt-2 text-xs text-gray-500">
          {message
            ? '✓ Draft auto-saved'
            : 'Your draft will be saved automatically'}
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Select Communication Channels
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {channelOptions.map(({ value, label, icon }) => {
            const recipients = getChannelRecipients(value, residents);
            const isSelected = selectedChannels.has(value);

            return (
              <button
                key={value}
                onClick={() => toggleChannel(value)}
                disabled={isSending}
                className={`p-4 rounded-lg border-2 transition-all ${
                  isSelected
                    ? 'border-indigo-500 bg-indigo-50 shadow-md'
                    : 'border-gray-200 bg-white hover:border-indigo-300'
                } ${
                  isSending ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">{icon}</span>
                    <span className="font-medium text-gray-900">{label}</span>
                  </div>
                  {isSelected && (
                    <span className="text-indigo-500 text-xl">✓</span>
                  )}
                </div>
                <div className="text-sm text-gray-500 mt-2 text-left">
                  {recipients.length} recipient
                  {recipients.length !== 1 ? 's' : ''}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 text-sm font-medium">{error}</p>
        </div>
      )}

      {sendResults && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <h3 className="text-green-900 font-semibold mb-2 flex items-center">
            <span className="mr-2">✓</span> Message Sent Successfully!
          </h3>
          <div className="space-y-1">
            {sendResults.map((result) => (
              <div key={result.channel} className="text-sm text-green-800">
                <span className="font-medium capitalize">{result.channel}:</span>{' '}
                Sent to {result.recipientCount} recipient
                {result.recipientCount !== 1 ? 's' : ''}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex space-x-3">
        {!sendResults ? (
          <button
            onClick={handleSend}
            disabled={isSending}
            className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all ${
              isSending
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700 shadow-md hover:shadow-lg'
            } text-white`}
          >
            {isSending ? 'Sending...' : 'Send Message'}
          </button>
        ) : (
          <button
            onClick={handleNewMessage}
            className="flex-1 py-3 px-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all"
          >
            New Message
          </button>
        )}
      </div>
    </div>
  );
};
