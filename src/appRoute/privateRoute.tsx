import { Navigate } from 'react-router-dom'
import { checkDataLocalStorage } from '../api/localStorage'
interface PrivateRouteProps {
  children: React.ReactNode
}

export function PrivateRoute({ children }: PrivateRouteProps) {

  const isAuthenticated = checkDataLocalStorage();
  
  if (!isAuthenticated) {

   return <Navigate to="/login" />
  }
  
  return <>{children}</>
}