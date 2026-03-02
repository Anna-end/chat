import { useEffect } from 'react';
import { useAppSelector } from '../../../store/hooks';
import { useFetchingCountUnreadMes } from '../../../api/FetchingCountUnreadMesWS';

interface Props {
  userLogin: string;
}

export const CounterUnreadMes = ({ userLogin }: Props) => {
  const { getCountUnreadMes } = useFetchingCountUnreadMes();
  const isConnected = useAppSelector(state => state.chat.isConnected);

  const count = useAppSelector(state => state.members.unreadCounts[userLogin] ?? 0);

  useEffect(() => {
    if (!isConnected) return;
    getCountUnreadMes(userLogin);
  }, [userLogin, isConnected]); 

  if (count === 0) return null;

  return (
    <span className="bg-[#721E1E] text-white text-xs rounded-full px-2 py-0.5">
      {count}
    </span>
  );
};
