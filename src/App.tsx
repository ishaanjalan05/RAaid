import { useState, useEffect } from 'react';
import residentsData from './data/residents.json';

type Channel = 'email' | 'sms' | 'groupme';

interface Resident {
  id: string;
  name: string;
  room: string;
  preferredChannel: Channel;
  email: string | null;
  phone: string | null;
  groupme: string | null;
}

interface SendResult {
  channel: Channel;
  success: boolean;
  recipientCount: number;
}

function App() {
  const [message, setMessage] = useState('');
  const [selectedChannels, setSelectedChannels] = useState<Set<Channel>>(new Set());
  const [isSending, setIsSending] = useState(false);
  const [sendResults, setSendResults] = useState<SendResult[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const residents = residentsData.residents as Resident[];

  // Auto-save draft message to localStorage
  useEffect(() => {
    const savedDraft = localStorage.getItem('messageDraft');
    if (savedDraft) {
      setMessage(savedDraft);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem('messageDraft', message);
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

  const getChannelRecipients = (channel: Channel): Resident[] => {
    return residents.filter(resident => {
      if (channel === 'email') return resident.email;
      if (channel === 'sms') return resident.phone;
      if (channel === 'groupme') return resident.groupme;
      return false;
    });
  };

  const handleSend = async () => {
    setError(null);
    setSendResults(null);

    // Validation
    if (!message.trim()) {
      setError('Message cannot be blank');
      return;
    }

    if (selectedChannels.size === 0) {
      setError('Please select at least one channel');
      return;
    }

    setIsSending(true);

    // Simulate sending messages
    await new Promise(resolve => setTimeout(resolve, 1000));

    const results: SendResult[] = Array.from(selectedChannels).map(channel => {
      const recipients = getChannelRecipients(channel);
      return {
        channel,
        success: true,
        recipientCount: recipients.length
      };
    });

    setSendResults(results);
    setIsSending(false);

    // Clear draft after successful send
    localStorage.removeItem('messageDraft');
  };

  const handleNewMessage = () => {
    setMessage('');
    setSendResults(null);
    setError(null);
    localStorage.removeItem('messageDraft');
  };

  const channelOptions: { value: Channel; label: string; icon: string }[] = [
    { value: 'email', label: 'Email', icon: '📧' },
    { value: 'sms', label: 'SMS', icon: '💬' },
    { value: 'groupme', label: 'GroupMe', icon: '👥' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold text-indigo-900">RAid</h1>
          <p className="text-gray-600 mt-1">Residential Assistant Communication Hub</p>
          <div className="mt-3 text-sm text-gray-500">
            <span className="font-medium">RA:</span> {residentsData.ra.name} •
            <span className="ml-2"><span className="font-medium">Residents:</span> {residents.length}</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Broadcast Message</h2>

          {/* Message Input */}
          <div className="mb-6">
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
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
              {message ? '✓ Draft auto-saved' : 'Your draft will be saved automatically'}
            </div>
          </div>

          {/* Channel Selection */}
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
                    onClick={() => toggleChannel(value)}
                    disabled={isSending}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      isSelected
                        ? 'border-indigo-500 bg-indigo-50 shadow-md'
                        : 'border-gray-200 bg-white hover:border-indigo-300'
                    } ${isSending ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
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

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Success Results */}
          {sendResults && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <h3 className="text-green-900 font-semibold mb-2 flex items-center">
                <span className="mr-2">✓</span> Message Sent Successfully!
              </h3>
              <div className="space-y-1">
                {sendResults.map(result => (
                  <div key={result.channel} className="text-sm text-green-800">
                    <span className="font-medium capitalize">{result.channel}:</span> Sent to {result.recipientCount} recipient{result.recipientCount !== 1 ? 's' : ''}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
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

        {/* Residents List */}
        <div className="mt-6 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Residents</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 px-3 text-sm font-medium text-gray-700">Name</th>
                  <th className="text-left py-2 px-3 text-sm font-medium text-gray-700">Room</th>
                  <th className="text-left py-2 px-3 text-sm font-medium text-gray-700">Preferred</th>
                  <th className="text-left py-2 px-3 text-sm font-medium text-gray-700">Contact</th>
                </tr>
              </thead>
              <tbody>
                {residents.map(resident => (
                  <tr key={resident.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-3 text-sm text-gray-900">{resident.name}</td>
                    <td className="py-3 px-3 text-sm text-gray-600">{resident.room}</td>
                    <td className="py-3 px-3">
                      <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                        resident.preferredChannel === 'email' ? 'bg-blue-100 text-blue-800' :
                        resident.preferredChannel === 'sms' ? 'bg-green-100 text-green-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {resident.preferredChannel === 'email' && '📧'}
                        {resident.preferredChannel === 'sms' && '💬'}
                        {resident.preferredChannel === 'groupme' && '👥'}
                        <span className="ml-1 capitalize">{resident.preferredChannel}</span>
                      </span>
                    </td>
                    <td className="py-3 px-3 text-sm text-gray-600">
                      {resident.preferredChannel === 'email' && resident.email}
                      {resident.preferredChannel === 'sms' && resident.phone}
                      {resident.preferredChannel === 'groupme' && resident.groupme}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;