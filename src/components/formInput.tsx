import type { UseFormRegister, FieldError } from 'react-hook-form';
import type { LoginFormData } from '../hooks/useLoginFormCheck';

interface FormInputProps {
  id: keyof LoginFormData;
  label: string;
  type?: string;
  placeholder: string;
  register: UseFormRegister<LoginFormData>;
  error?: FieldError;
  value: string;
  onChange?: () => void;
  children?: React.ReactNode;
}

export const FormInput: React.FC<FormInputProps> = ({
  id,
  label,
  type = 'text',
  placeholder,
  register,
  error,
  value,
  onChange,
  children,
}) => {
  const isError = !!error;
  const isValid = !isError && value.length > 0;

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-[#E2D797] mb-2">
        {label}
      </label>
      <input
        id={id}
        type={type}
        {...register(id, { onChange })}
        className={`
          w-full px-4 py-3 border rounded-lg focus:ring-2   text-[#721E1E]
          focus:ring-blue-500 focus:border-blue-500 transition
          ${
            isError
              ? 'border-red-500 bg-red-50'
              : isValid
                ? 'border-green-500 bg-green-50'
                : 'border-gray-300'
          }
        `}
        placeholder={placeholder}
      />
      {isError && <p className="mt-1 text-sm text-red-600">{error.message}</p>}
      {isValid && !isError && <p className="mt-1 text-sm text-green-600">{label} корректный</p>}
      {children}
    </div>
  );
};
