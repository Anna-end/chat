import { useState } from 'react'
import type { FormEvent } from 'react'
import { LoginInput } from './loginInputUi'
import { PasswordInput } from './passwordInputUi'
import { useNavigate } from 'react-router-dom'


export function AuthenticationPage() {
  const navigate = useNavigate()

  const [validData, setValidData] = useState({
    login: false,
    password: false,
  })

  const getInputValid = (elemInput: 'login' | 'password' , isValid: boolean) => {
      setValidData(prev => ({
        ...prev,
        [elemInput]: isValid
      }));
    };

  const handleAuthRedirect = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if(validData.login && validData.password) {
      navigate('/dashboard')
    }
  }

  return <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
    <form 
    className="w-full max-w-2xs bg-white shadow-xl rounded-xl p-8" 
     onSubmit={handleAuthRedirect}>
       <h1 className="text-2xl font-bold text-center text-gray-800 mb-8">
          Авторизация
        </h1>
        <div className="space-y-4">
          
          <LoginInput onSendIsValid={getInputValid}/>
          <PasswordInput onSendIsValid={getInputValid}/>
          
          <button
            type="submit"
            className="w-full bg-linear-to-r from-blue-600 to-blue-700 text-white font-semibold py-3 px-4 rounded-lg hover:opacity-90 transition shadow-md"
             
          >
            Войти
          </button>
        </div>
    </form>
  </div>
}