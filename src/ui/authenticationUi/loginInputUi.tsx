import { useState } from 'react';
import { validateInput } from '../../businessLogic/validationLoginForm';
import { ErrorElementInput } from './errorsInput';

interface Props {
  onSendIsValid: (elemInput: 'login' | 'password' , value: string | null) => void;
}

export function LoginInput({onSendIsValid}: Props) {

  const [loginData, setLoginData] = useState('')
  const [errors, setErrors] = useState<string[] | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [lastValidity, setLastValidity] = useState<boolean>(false)

   const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setLoginData(value)
    setIsFocused(true)
    
    if (value.trim() === '') {
      setErrors([])
      if (lastValidity !== false) {
        onSendIsValid('login', null)
        setLastValidity(false)
      }
      return
    }

    const { isValid, errors: newErrors } = validateInput(value)

    setErrors(newErrors)
    

    if (lastValidity !== isValid) {
      onSendIsValid('login', value)
      setLastValidity(isValid)
    }
  }

  const handleBlur = () => {
    setIsFocused(false);

  }

  return <div>
          <label 
            className="block text-sm font-medium text-gray-700 mb-2"
            htmlFor="login"
          > Логин
          </label>
          <input
            id="login"
            name="login"
            type="text"
            value={loginData}
            onChange={handleLoginChange}
            onBlur={handleBlur}
            className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2
            focus:ring-blue-500 focus:border-blue-500 transition`}
            placeholder="Введите логин"
          />
          {isFocused && errors && (<ErrorElementInput errors={errors} className=''/>)}
          
        </div>
}