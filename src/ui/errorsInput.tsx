import { AlertCircle } from 'lucide-react';

interface Props {
  errors: string[] | null
  className?: string
}
export function ErrorElementInput({errors, className = ''}: Props) {
  if (!errors || errors.length === 0) {
  return null;
}

  return (
    <div className={`mt-2 ${className}`}>
      <ul className="space-y-1">
        {errors.map((error, index) => (
          <li 
            key={index} 
            className="flex items-start text-xs text-red-400"
          >
            <AlertCircle className="w-4 h-4 mr-2 mt-0.5 shrink-0" />
            <span>{error}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}