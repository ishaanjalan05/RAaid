import { useState, useEffect } from 'react';
import residentsData from './data/residents.json';
import type { Channel, Resident, SendResult } from './types/resident';
import { Header } from './components/Header';
import { MessageInput } from './components/MessageInput';
import { ErrorMessage } from './components/ErrorMessage';
import { SuccessResults } from './components/SuccessResults';
import { SendButton } from './components/SendButton';
import { ResidentsList } from './components/ResidentsList';
// import { getChannelRecipients } from './utilities/residentUtils';
import { saveDraft, loadDraft, clearDraft } from './utilities/localStorage';
import { sendEmail } from './utilities/sendEmail';
import { sendGroupMe } from './utilities/sendGroupMe';
import { sendSMS } from './utilities/sendSMS';
import { ResidentForm } from './components/ResidentForm';

// TODO: Add email and groupme features, as well as login tools for personalization

function App() {
  const [message, setMessage] = useState('');
  const [sendToAllChannels, setSendToAllChannels] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [sendResults, setSendResults] = useState<SendResult[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [residents, setResidents] = useState<Resident[]>(residentsData.residents as Resident[]);
  const [selectedResidentIds, setSelectedResidentIds] = useState<Set<string>>(
    new Set(residentsData.residents.map((r) => r.id))
  );
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

  const handleSend = async () => {
    setError(null);
    setSendResults(null);

    // Validation
    if (!message.trim()) {
      setError('Message cannot be blank');
      return;
    }

    if (selectedResidentIds.size === 0) {
      setError('Please select at least one resident');
      return;
    }

    setIsSending(true);

    // Determine which channels to use
    let channelsToUse: Channel[];
    if (sendToAllChannels) {
      // Send via all channels
      channelsToUse = ['email', 'sms', 'groupme'];
    } else {
      // Send only via preferred channels
      channelsToUse = ['email', 'sms', 'groupme'];
    }

    // Filter to only selected residents
    const selectedResidents = residents.filter((r) => selectedResidentIds.has(r.id));

    const channelParams = channelsToUse.map((channel) => {
      let recipients;
      if (sendToAllChannels) {
        // Send to all selected residents via all channels
        recipients = selectedResidents;
      } else {
        // Get only selected residents who prefer this channel
        recipients = selectedResidents.filter((r) => r.preferredChannel === channel);
      }

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

    // Clear draft, message, and checkbox after send
    setMessage('');
    setSendToAllChannels(false);
    clearDraft();
  };

  const handleNewMessage = () => {
    setMessage('');
    setSendToAllChannels(false);
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
      // Auto-select newly added resident
      setSelectedResidentIds(new Set([...selectedResidentIds, newResident.id]));
    }
    setIsFormOpen(false);
    setEditingResident(null);
  };

  const handleCancelForm = () => {
    setIsFormOpen(false);
    setEditingResident(null);
  };

  const handleToggleResident = (residentId: string) => {
    const newSelected = new Set(selectedResidentIds);
    if (newSelected.has(residentId)) {
      newSelected.delete(residentId);
    } else {
      newSelected.add(residentId);
    }
    setSelectedResidentIds(newSelected);
  };

  const handleToggleAllResidents = () => {
    if (selectedResidentIds.size === residents.length) {
      // Deselect all
      setSelectedResidentIds(new Set());
    } else {
      // Select all
      setSelectedResidentIds(new Set(residents.map((r) => r.id)));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Header raName={residentsData.ra.name} residentCount={residents.length} />

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Broadcast Message</h2>

          <MessageInput value={message} onChange={setMessage} disabled={isSending} />

          <div className="mb-4">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={sendToAllChannels}
                onChange={(e) => setSendToAllChannels(e.target.checked)}
                disabled={isSending}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
              />
              <span className="text-sm text-gray-700">
                Send via all communication channels (email, SMS, and GroupMe)
              </span>
            </label>
            {!sendToAllChannels && (
              <p className="text-xs text-gray-500 mt-1 ml-6">
                When unchecked, messages are sent only via each resident's preferred method
              </p>
            )}
          </div>

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
          selectedResidentIds={selectedResidentIds}
          onToggleResident={handleToggleResident}
          onToggleAll={handleToggleAllResidents}
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