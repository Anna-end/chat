//import { Navigate } from 'react-router-dom'

interface PrivateRouteProps {
  children: React.ReactNode
}

export function PrivateRoute({ children }: PrivateRouteProps) {

  //const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true'
  
  //if (!isAuthenticated) {

   // return <Navigate to="/login" />
  //}
  
  return <>{children}</>
}