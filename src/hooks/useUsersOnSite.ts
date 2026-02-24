import { useMemo } from 'react';
import type { User } from '../api/gettingAuthUsersWS'
interface usersProps {
  authenticatedUsers: User[];
  unAuthenticatedUsers: User[];
}

export const useUsersOnSite = ({ authenticatedUsers, unAuthenticatedUsers }: usersProps): User[] => {
    const allUsers: User[] = useMemo(() => {
      
      const authUsers: User[] = authenticatedUsers.map(user => ({
        login: user.login,
        isLogined: user.isLogined
      }));
  
      const unauthUsers: User[] = unAuthenticatedUsers.map(user => ({
        login: user.login,
        isLogined: user.isLogined
      }));
  
      
  
      return ([...authUsers, ...unauthUsers]);
    }, [authenticatedUsers, unAuthenticatedUsers]);

    return allUsers
}