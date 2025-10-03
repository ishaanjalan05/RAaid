interface SendButtonProps {
  isSending: boolean;
  showNewMessage: boolean;
  onSend: () => void;
  onNewMessage: () => void;
}

export const SendButton = ({ isSending, showNewMessage, onSend, onNewMessage }: SendButtonProps) => {
  if (showNewMessage) {
    return (
      <button
        onClick={onNewMessage}
        className="flex-1 py-3 px-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all"
      >
        New Message
      </button>
    );
  }

  return (
    <button
      onClick={onSend}
      disabled={isSending}
      className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all ${
        isSending
          ? 'bg-gray-400 cursor-not-allowed'
          : 'bg-indigo-600 hover:bg-indigo-700 shadow-md hover:shadow-lg'
      } text-white`}
    >
      {isSending ? 'Sending...' : 'Send Message'}
    </button>
  );
};
