import { useState } from 'react';
import { useAuthUsers } from '../../../api/gettingAuthUsersWS';
import { useWSData } from '../../../hooks/useWSData';
import { ShowingUsersBtn } from './ShowingUsersBtn';
import { IconUser } from './IconUser';
import { useSelectedMember } from '../../../hooks/useSelectedMemberContext';
import { useLoginData } from '../../../hooks/useLoginCurrentUser';
import { useUsersOnSite } from '../../../hooks/useUsersOnSite'
import type {User} from '../../../api/gettingAuthUsersWS';

export const ParticipantSidebar = () => {
  const ws = useWSData();
  const { loading, authenticatedUsers, getAuthUsers, getUnauthUsers, unAuthenticatedUsers } = useAuthUsers(ws);
  const [error, setError] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { userData } = useLoginData();
  const { setData } = useSelectedMember();

  const handleClickOnItem = (login: string) => {
    const selectedLogin = login;
    setData({ login: selectedLogin });
  };


  const allUsers  = useUsersOnSite({ authenticatedUsers, unAuthenticatedUsers});
  const onlineCount = authenticatedUsers
    .filter((user: User) => user.login !== userData.login)
    .filter((user: User) => user.isLogined).length;

  if (!authenticatedUsers || authenticatedUsers.length === 0) {
    return (
      <div className="w-1/3 bg-[#E2D797] rounded-lg shadow-xl shadow-black/50 p-4">
        <p className="text-[#721E1E]">Нет активных пользователей</p>
      </div>
    );
  }

  return (
    <div
      className={`
      ${isCollapsed ? 'w-16' : 'w-1/3'}
      bg-[#E2D797] rounded-lg shadow-xl shadow-black/50
      transition-all duration-300 ease-in-out
      flex flex-col h-full
    `}
    >
      <ShowingUsersBtn setIsCollapsed={setIsCollapsed} isCollapsed={isCollapsed} />

      {!isCollapsed && (
        <>
          <div className="px-4 py-2">
            <h2 className="font-bold text-[#721E1E] text-lg flex items-center justify-between">
              <span>Участники</span>
              <span className="bg-[#721E1E] text-[#E2D797] text-sm px-2 py-1 rounded-full">
                {onlineCount}
              </span>
            </h2>
          </div>

          <div className="flex-1 px-3 pb-4 overflow-y-auto scrollbar-thin scrollbar-thumb-[#721E1E] scrollbar-track-[#E2D797]">
            {loading && (
              <div className="flex items-center justify-center py-4">
                <div className="animate-pulse text-[#721E1E]">Загрузка...</div>
              </div>
            )}

            {!loading && authenticatedUsers.length === 0 && !error && (
              <div className="text-center text-[#721E1E] opacity-70 py-4">
                Нет активных пользователей
              </div>
            )}

            <div className="flex flex-col gap-2">
              {allUsers
                .filter((user: User) => user.login !== userData.login)
                .map((user: User) => (
                  <div
                    onClick={() => handleClickOnItem(user.login)}
                    key={user.login}
                    className="rounded-md shadow-sm shadow-black/30 bg-white p-3 flex items-center gap-3 hover:shadow-md transition-shadow"
                  >
                    <IconUser getlogin={user.login} getisLogined={user.isLogined} />

                    <div className="flex-1">
                      <div className="font-medium text-gray-800">{user.login}</div>
                      <div className="flex items-center gap-1 mt-0.5">
                        <span
                          className={`
                        w-2 h-2 rounded-full
                        ${user.isLogined ? 'bg-green-500' : 'bg-gray-400'}
                      `}
                        />
                        <span className="text-xs text-gray-500">
                          {user.isLogined ? 'В сети' : 'Не в сети'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>

            {error && (
              <div className="bg-red-100 text-red-700 p-3 rounded-md mt-4 text-sm">
                ⚠️ Ошибка загрузки.
                <button
                  onClick={() => {
                    setError(false);
                    getAuthUsers();
                    getUnauthUsers();
                  }}
                  className="ml-2 underline hover:no-underline"
                >
                  Повторить
                </button>
              </div>
            )}
          </div>
        </>
      )}

      {isCollapsed && (
        <div className="flex flex-col items-center py-4 gap-4">
          <div className="bg-[#721E1E] text-[#E2D797] w-8 h-8 rounded-full flex items-center justify-center font-bold">
            {onlineCount}
          </div>
          <div className="flex flex-col gap-2">
            {allUsers
              .filter((user: User) => user.login !== userData.login)
              .slice(0, 3)
              .map((user: User) => (
                <div
                  key={user.login}
                  className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold
                  ${user.isLogined ? 'bg-[#721E1E] text-[#E2D797]' : 'bg-gray-300 text-gray-600'}
                `}
                  title={user.login}
                >
                  {user.login.charAt(0).toUpperCase()}
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};
