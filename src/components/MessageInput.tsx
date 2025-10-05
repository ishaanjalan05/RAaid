interface MessageInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
}

export const MessageInput = ({ value, onChange, disabled }: MessageInputProps) => {
  return (
    <div className="mb-6">
      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
        Message
      </label>
      <textarea
        id="message"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Type your message to residents..."
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
        rows={8}
        disabled={disabled}
      />
      <div className="mt-2 text-xs text-gray-500">
        {value ? '✓ Draft auto-saved' : 'Your draft will be saved automatically'}
      </div>
    </div>
  );
};
