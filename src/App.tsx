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
import { sendEmail } from './utilities/sendEmail';
import { sendGroupMe } from './utilities/sendGroupMe';
import { sendSMS } from './utilities/sendSMS';
import { ResidentForm } from './components/ResidentForm';

function App() {
  const [message, setMessage] = useState('');
  const [selectedChannels, setSelectedChannels] = useState<Set<Channel>>(new Set());
  const [isSending, setIsSending] = useState(false);
  const [sendResults, setSendResults] = useState<SendResult[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [residents, setResidents] = useState<Resident[]>(residentsData.residents as Resident[]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingResident, setEditingResident] = useState<Resident | null>(null);

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

    // Send messages through appropriate channels
    const results: SendResult[] = await Promise.all(
      channelParams.map(async (params) => {
        let success = false;

        try {
          if (params.channel === 'email') {
            success = await sendEmail({
              message: params.message,
              recipients: params.recipients
            });
          } else if (params.channel === 'groupme') {
            success = await sendGroupMe({
              message: params.message,
              recipients: params.recipients
            });
          } else if (params.channel === 'sms') {
            success = await sendSMS({
              message: params.message,
              recipients: params.recipients
            });
          }
        } catch (error) {
          console.error(`Error sending ${params.channel} message:`, error);
          success = false;
        }

        return {
          channel: params.channel,
          success,
          recipientCount: params.recipients.length
        };
      })
    );

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

  const handleAddResident = () => {
    setEditingResident(null);
    setIsFormOpen(true);
  };

  const handleEditResident = (resident: Resident) => {
    setEditingResident(resident);
    setIsFormOpen(true);
  };

  const handleDeleteResident = (residentId: string) => {
    setResidents(residents.filter((r) => r.id !== residentId));
  };

  const handleSaveResident = (resident: Resident) => {
    if (editingResident) {
      setResidents(residents.map((r) => (r.id === resident.id ? resident : r)));
    } else {
      const newResident = { ...resident, id: Date.now().toString() };
      setResidents([...residents, newResident]);
    }
    setIsFormOpen(false);
    setEditingResident(null);
  };

  const handleCancelForm = () => {
    setIsFormOpen(false);
    setEditingResident(null);
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
            getChannelRecipients={(channel: Channel) => getChannelRecipients(residents, channel)}
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

        <ResidentsList
          residents={residents}
          onAdd={handleAddResident}
          onEdit={handleEditResident}
          onDelete={handleDeleteResident}
        />

        {isFormOpen && (
          <ResidentForm
            resident={editingResident}
            onSave={handleSaveResident}
            onCancel={handleCancelForm}
          />
        )}
      </div>
    </div>
  );
}

export default App;