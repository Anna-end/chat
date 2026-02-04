export function AuthenticationPage() {
  return <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
    <form className="w-full max-w-2xs bg-white shadow-xl rounded-xl p-8" action="">
       <h1 className="text-2xl font-bold text-center text-gray-800 mb-8">
          Авторизация
        </h1>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Логин
            </label>
            <input
              type="text"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              placeholder="Введите логин"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Пароль
            </label>
            <input
              type="password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              placeholder="Введите пароль"
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold py-3 px-4 rounded-lg hover:opacity-90 transition shadow-md"
          >
            Войти
          </button>
        </div>
    </form>
  </div>
}