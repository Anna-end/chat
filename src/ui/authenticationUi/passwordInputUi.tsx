import { useState } from 'react';
import { validateInput } from '../../businessLogic/validationLoginForm';
import { ErrorElementInput } from './errorsInput';

interface Props {
  onSendIsValid: (elemInput: 'login' | 'password' , value: string | null) => void;
}

export function PasswordInput({onSendIsValid}: Props) {
  const [passwordData, setPasswordData] = useState('')
  const [errors, setErrors] = useState<string[] | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [lastValidity, setLastValidity] = useState<boolean | null>(null)

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      setPasswordData(value)
      setIsFocused(true)
      
      if (value.trim() === '') {
        setErrors([])
        if (lastValidity !== false) {
          onSendIsValid('password', null)
          setLastValidity(false)
        }
        return
      }
  
      const { isValid, errors: newErrors } = validateInput(value)
  
      setErrors(newErrors)
      
  
      if (lastValidity !== isValid) {
        onSendIsValid('password', value)
        setLastValidity(isValid)
      }
    }
  
    const handleBlur = () => {
      setIsFocused(false);
  
    }

  return <div>
        <label 
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-2">
            Пароль
        </label>
        <input
            id="password"
            name="password"
            type="password"
            value={passwordData}
            onBlur={handleBlur}
            onChange={handlePasswordChange}
            className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2
            focus:ring-blue-500 focus:border-blue-500 transition`}
            placeholder="Введите пароль"
        />
        {isFocused && errors && (<ErrorElementInput errors={errors} className=''/>)}
        </div>
}