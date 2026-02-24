import { useLoginForm } from '../hooks/useLoginFormCheck';
import type { LoginFormData } from '../hooks/useLoginFormCheck';
import { FormInput } from '../components/formInput';
import { SubmitButton } from '../components/submitButtonForm';
import { useLoginData } from '../hooks/useLoginCurrentUser';
import { useNavigate } from 'react-router-dom';
import { saveDataUserLocalStorage } from '../api/localStorage';
import { useAuth } from '../api/authenticationUserWS';
import { useWSData } from '../hooks/useWSData';
export function LoginPage() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    errors,
    isSubmitting,
    isValid,
    watchLogin,
    watchPassword,
    reset,
  } = useLoginForm();

  const ws = useWSData();

  const { login, errorAuthUser: authError } = useAuth(ws);

  const { setData } = useLoginData();
  const onSubmit = async (data: LoginFormData) => {
    try {
      console.log('Данные формы:', data);
      const success = await login(data.login, data.password);
      if (success) {
        setData({ login: data.login });
        saveDataUserLocalStorage(data.login, data.password);
        reset();

        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Ошибка:', error);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#E2D797] p-4">
      <form
        className="w-full max-w-md  bg-[#721E1E] text-[#83C082] shadow-2xl rounded-xl p-8 space-y-6"
        noValidate
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="text-center">
          <h1 className="text-3xl font-bold text-[#E2D797] mb-2">Авторизация</h1>
          <p className="text-sm text-[#E2D797]">Введите ваши данные для входа</p>
        </div>

        <div className="space-y-5 text-[#E2D797]">
          <FormInput
            id="login"
            label="Логин"
            placeholder="john_doe"
            register={register}
            error={errors.login}
            value={watchLogin}
            onChange={() => {}}
          />

          <FormInput
            id="password"
            label="Пароль"
            type="password"
            placeholder="••••••••"
            register={register}
            error={errors.password}
            value={watchPassword}
            onChange={() => {}}
          ></FormInput>
        </div>

        <div className="space-y-4">
          <SubmitButton isSubmitting={isSubmitting} isValid={isValid} />
          <div className="mt-2 flex items-center justify-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${ws.isConnected ? 'bg-green-500' : 'bg-red-500'}`}
            />
            <span className="text-xs text-gray-500">
              {ws.isConnected ? 'WebSocket подключен' : 'WebSocket отключен'}
            </span>
            {authError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {authError}
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
