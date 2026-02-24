import { useState } from 'react';

interface MessageInputProps {
  onSend: (text: string) => Promise<void>;
  disabled?: boolean;
  error?: string | null;
}

export const MessageInput = ({ onSend, disabled, error }: MessageInputProps) => {
  const [value, setValue] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim() || disabled) return;

    await onSend(value);
    setValue('');
  };

  return (
    <div className="p-4 border-t border-brand">
      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
      <form className="flex gap-2" onSubmit={handleSubmit}>
        <input
          type="text"
          value={value}
          onChange={e => setValue(e.target.value)}
          placeholder="Введите сообщение..."
          disabled={disabled}
          className="flex-1 px-4 py-2 rounded-full bg-white text-gray-800
                     focus:outline-none focus:ring-2 focus:ring-brand
                     disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={disabled || !value.trim()}
          className="px-6 py-2 rounded-full font-medium
                     bg-[#721E1E] text-white
                     hover:opacity-90 transition-opacity
                     focus:outline-none focus:ring-2 focus:ring-offset-2
                     disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Отправить
        </button>
      </form>
    </div>
  );
};
