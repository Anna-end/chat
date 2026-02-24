import { useEffect } from 'react';
import {useFetchingCountUnreadMes} from '../../../api/FetchingCountUnreadMesWS';
interface PropsCounterUnreadMes {
  userLogin: string;
}
export const CounterUnreadMes = ({ userLogin }: PropsCounterUnreadMes) => {
  const { countUnreadMessages, getCountUnreadMes } = useFetchingCountUnreadMes();

  useEffect(() => {
    getCountUnreadMes(userLogin);
  }, [getCountUnreadMes, userLogin]);

  if (!countUnreadMessages) return null;

  return (
    <div className='bg-[#721E1E] text-[#E2D797] text-xs px-2 py-1 rounded-full'>
      {countUnreadMessages}
    </div>
  );
};
