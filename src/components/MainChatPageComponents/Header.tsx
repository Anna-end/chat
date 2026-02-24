import { useNavigate } from 'react-router-dom';
import { useLoginData } from '../../hooks/useLoginCurrentUser';
import { useWSData } from '../../hooks/useWSData';
export const Header = () => {
  const navigate = useNavigate();
  const { userData } = useLoginData();
  const { disconnect } = useWSData();
  const handleLogout = () => {
    localStorage.removeItem('user_auth_token');
    localStorage.removeItem('user_login');
    disconnect();
    navigate('/login');
  };
  return (
    <div className=" w-9/12 flex items-center justify-between bg-[#E2D797] p-4 rounded-lg shadow border">
      <div className="flex items-center gap-2 basis-64">
        <svg
          className="w-5 h-5 text-[#721E1E] font-bold"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
        <h3 className="text-[#721E1E] font-bold">{userData.login}</h3>
      </div>

      <h1 className="text-xl font-bold text-[#721E1E] basis-128 text-center">Chat</h1>

      <button
        className="flex items-center gap-1 basis-64 px-3 py-2 bg-[#721E1E] ring-1 ring-[#E2D797] hover:ring-3 hover:ring-[#dcbf20] text-[#E2D797] rounded-md text-sm font-medium transition-colors justify-center"
        onClick={handleLogout}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
          />
        </svg>
        Выйти
      </button>
    </div>
  );
};
