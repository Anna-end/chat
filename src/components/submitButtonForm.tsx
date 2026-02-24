interface SubmitButtonProps {
  isSubmitting: boolean;
  isValid: boolean;
}

export const SubmitButton: React.FC<SubmitButtonProps> = ({ isSubmitting, isValid }) => {
  const isDisabled = isSubmitting || !isValid;

  return (
    <button
      type="submit"
      disabled={isDisabled}
      className={`
        w-full font-semibold py-3 px-4 rounded-lg transition-all duration-200
        shadow-md hover:shadow-lg transform hover:-translate-y-0.5
        ${
          isDisabled
            ? 'bg-gray-400 cursor-not-allowed text-gray-200 hover:shadow-md hover:translate-y-0'
            : ' bg-[#E2D797] hover:bg-[#e3c82d] text-[#721E1E]'
        }
      `}
    >
      {isSubmitting ? (
        <span className="flex items-center justify-center">
          <svg
            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Вход...
        </span>
      ) : (
        'Войти'
      )}
    </button>
  );
};
