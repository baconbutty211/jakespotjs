import { Navigate, RouteProps } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // Import your user context
import { ReactComponentElement, ReactNode } from 'react';

interface PrivateRouteProps {
  children: JSX.Element;
}

export default function PrivateRoute ( { children }: PrivateRouteProps ) {
  const { isLoggedIn } = useAuth(); // Get the user's authentication status from your context
  return ( isLoggedIn ? children : <Navigate to='/Login'/> );
};
