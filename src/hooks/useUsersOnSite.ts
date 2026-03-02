import { useMemo } from 'react';
import { useAppSelector } from '../store/hooks';

export const useUsersOnSite = () => {
  const authenticatedUsers = useAppSelector(state => state.members.authenticatedUsers);
  const unauthenticatedUsers = useAppSelector(state => state.members.unauthenticatedUsers);

  const allUsers = useMemo(() => {
    return [...authenticatedUsers, ...unauthenticatedUsers];
  }, [authenticatedUsers, unauthenticatedUsers]);

  return allUsers;
};