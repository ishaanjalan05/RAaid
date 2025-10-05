import { useState, useEffect } from 'react';
import residentsData from './data/residents.json';
import type { Channel, Resident, SendResult } from './types/resident';
import { Header } from './components/Header';
import { MessageInput } from './components/MessageInput';
import { ChannelSelector } from './components/ChannelSelector';
import { ErrorMessage } from './components/ErrorMessage';
import { SuccessResults } from './components/SuccessResults';
import { SendButton } from './components/SendButton';
import { ResidentsList } from './components/ResidentsList';
import { getChannelRecipients } from './utilities/residentUtils';
import { saveDraft, loadDraft, clearDraft } from './utilities/localStorage';

function App() {
  const [message, setMessage] = useState('');
  const [selectedChannels, setSelectedChannels] = useState<Set<Channel>>(new Set());
  const [isSending, setIsSending] = useState(false);
  const [sendResults, setSendResults] = useState<SendResult[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const residents = residentsData.residents as Resident[];

  // Auto-save draft message to localStorage
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

    // Prepare parameters for each channel
    const channelParams = Array.from(selectedChannels).map((channel) => {
      const recipients = getChannelRecipients(residents, channel);
      return {
        channel,
        message: message.trim(),
        recipients: recipients.map((resident) => ({
          id: resident.id,
          name: resident.name,
          contact: channel === 'email' ? resident.email :
                   channel === 'sms' ? resident.phone :
                   resident.groupme
        }))
      };
    });

    // Simulate sending messages, replace with firebase functions once thats done
    // TODO: Replace with actual firebase function call
    // const response = await sendMessages(channelParams);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const results: SendResult[] = channelParams.map((params) => ({
      channel: params.channel,
      success: true,
      recipientCount: params.recipients.length
    }));

    setSendResults(results);
    setIsSending(false);

    // Clear draft after successful send
    clearDraft();
  };

  const handleNewMessage = () => {
    setMessage('');
    setSendResults(null);
    setError(null);
    clearDraft();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Header raName={residentsData.ra.name} residentCount={residents.length} />

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Broadcast Message</h2>

          <MessageInput value={message} onChange={setMessage} disabled={isSending} />

          <ChannelSelector
            selectedChannels={selectedChannels}
            onToggleChannel={toggleChannel}
            getChannelRecipients={(channel) => getChannelRecipients(residents, channel)}
            disabled={isSending}
          />

          {error && <ErrorMessage message={error} />}

          {sendResults && <SuccessResults results={sendResults} />}

          <div className="flex space-x-3">
            <SendButton
              isSending={isSending}
              showNewMessage={!!sendResults}
              onSend={handleSend}
              onNewMessage={handleNewMessage}
            />
          </div>
        </div>

        <ResidentsList residents={residents} />
      </div>
    </div>
  );
}

export default App;